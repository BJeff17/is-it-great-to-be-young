import os from 'node:os';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Duplex } from 'node:stream';
import { defineConfig, type Plugin, type ViteDevServer, type PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import { WebSocketServer, WebSocket } from 'ws';

type ClientRole = 'stage' | 'remote' | 'presenter';

interface ClientMeta {
  ws: WebSocket;
  session: string;
  role: ClientRole;
}

interface NetworkCandidate {
  name: string;
  address: string;
  priority: number;
}

function getNetworkInfo(port: number) {
  const ifaces = os.networkInterfaces();
  const candidates: NetworkCandidate[] = [];

  for (const [name, entries] of Object.entries(ifaces)) {
    if (!entries) continue;
    for (const info of entries) {
      if (info.family !== 'IPv4' || info.internal) continue;
      if (info.address.startsWith('169.254.')) continue;

      const lower = name.toLowerCase();
      let priority = 50;
      if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('wlan')) {
        priority = 100;
      } else if (lower.includes('ethernet') && !lower.includes('vethernet')) {
        priority = 90;
      } else if (
        lower.includes('vethernet') ||
        lower.includes('wsl') ||
        lower.includes('docker') ||
        lower.includes('virtual') ||
        lower.includes('vbox') ||
        lower.includes('vmware') ||
        lower.includes('tailscale')
      ) {
        priority = 10;
      }
      if (info.address.startsWith('192.168.') || info.address.startsWith('10.')) {
        priority += 15;
      }
      candidates.push({ name, address: info.address, priority });
    }
  }

  candidates.sort((a, b) => b.priority - a.priority);
  const uniqueIps = Array.from(new Set(candidates.map((c) => c.address)));

  return {
    lanIp: uniqueIps[0] ?? 'localhost',
    ips: uniqueIps,
    port,
    protocol: 'http',
  };
}

function attachSyncHandlers(
  httpServer: NonNullable<ViteDevServer['httpServer']> | PreviewServer['httpServer'],
  middlewares: ViteDevServer['middlewares'] | PreviewServer['middlewares'],
  defaultPort: number
) {
  const sessions = new Map<string, Set<ClientMeta>>();
  const lastStateBySession = new Map<string, string>();
  const wss = new WebSocketServer({ noServer: true });

  const broadcastPeers = (session: string) => {
    const clients = sessions.get(session);
    if (!clients) return;
    let stages = 0;
    let remotes = 0;
    let presenters = 0;
    for (const c of clients) {
      if (c.ws.readyState !== WebSocket.OPEN) continue;
      if (c.role === 'stage') stages++;
      else if (c.role === 'remote') remotes++;
      else if (c.role === 'presenter') presenters++;
    }
    const payload = JSON.stringify({ type: 'PEERS', stages, remotes, presenters });
    for (const c of clients) {
      if (c.ws.readyState === WebSocket.OPEN) {
        c.ws.send(payload);
      }
    }
  };

  middlewares.use('/api/network', (req: IncomingMessage, res: ServerResponse, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }
    const addr = httpServer?.address();
    const port = addr && typeof addr === 'object' ? addr.port : defaultPort;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(getNetworkInfo(port)));
  });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const parsed = new URL(req.url ?? '/ws', 'http://localhost');
    const session = (parsed.searchParams.get('session') ?? 'live').slice(0, 48);
    const rawRole = parsed.searchParams.get('role');
    const role: ClientRole =
      rawRole === 'remote' || rawRole === 'presenter' ? rawRole : 'stage';

    const meta: ClientMeta = { ws, session, role };
    let group = sessions.get(session);
    if (!group) {
      group = new Set();
      sessions.set(session, group);
    }
    group.add(meta);

    const cachedState = lastStateBySession.get(session);
    if (cachedState && role !== 'stage') {
      ws.send(cachedState);
    }
    broadcastPeers(session);

    ws.on('message', (raw) => {
      const text = raw.toString();
      let msg: { type?: string };
      try {
        msg = JSON.parse(text);
      } catch {
        return;
      }

      const currentGroup = sessions.get(session);
      if (!currentGroup) return;

      if (msg.type === 'STATE') {
        lastStateBySession.set(session, text);
        for (const c of currentGroup) {
          if (c.ws !== ws && c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(text);
          }
        }
      } else if (msg.type === 'CMD') {
        for (const c of currentGroup) {
          if (c.role === 'stage' && c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(text);
          }
        }
      }
    });

    ws.on('close', () => {
      const currentGroup = sessions.get(session);
      if (!currentGroup) return;
      currentGroup.delete(meta);
      if (currentGroup.size === 0) {
        sessions.delete(session);
      } else {
        broadcastPeers(session);
      }
    });
  });

  if (httpServer) {
    httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
      const parsed = new URL(req.url ?? '/', 'http://localhost');
      if (parsed.pathname === '/ws') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      }
    });
  }
}

function syncServerPlugin(): Plugin {
  return {
    name: 'cinema-lan-sync',
    configureServer(server) {
      attachSyncHandlers(server.httpServer, server.middlewares, server.config.server.port ?? 5173);
    },
    configurePreviewServer(server) {
      attachSyncHandlers(server.httpServer, server.middlewares, server.config.preview.port ?? 4173);
    },
  };
}

export default defineConfig({
  plugins: [react(), syncServerPlugin()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
