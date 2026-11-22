import { useCallback, useEffect, useRef, useState } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import type {
  PeerCounts,
  RemoteCommand,
  RemoteCommandAction,
  SyncState,
  SyncTransport,
} from '../types/presentation';

type SyncRole = 'stage' | 'remote' | 'presenter';

interface UsePresentationSyncOptions {
  session: string;
  role: SyncRole;
  onState?: (state: SyncState) => void;
  onCommand?: (cmd: RemoteCommand) => void;
}

export function isLocalOrLanHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '::1') return true;
  if (/^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  return false;
}

function sanitizeSession(session: string): string {
  return session.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'live';
}

export function usePresentationSync({
  session,
  role,
  onState,
  onCommand,
}: UsePresentationSyncOptions) {
  const cleanSession = sanitizeSession(session);
  const useLanWs = isLocalOrLanHost(window.location.hostname);

  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<SyncTransport>(useLanWs ? 'lan-ws' : 'cloud-p2p');
  const [peers, setPeers] = useState<PeerCounts>({ stages: 0, remotes: 0, presenters: 0 });

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const clientConnRef = useRef<DataConnection | null>(null);
  const stageConnsRef = useRef<Map<DataConnection, 'remote' | 'presenter'>>(new Map());
  const lastStateRef = useRef<SyncState | null>(null);

  const onStateRef = useRef(onState);
  const onCommandRef = useRef(onCommand);
  onStateRef.current = onState;
  onCommandRef.current = onCommand;

  useEffect(() => {
    let closed = false;
    let reconnectTimer: number | null = null;

    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`jeff_presentation_sync_v2_${cleanSession}`);
      bcRef.current = bc;
      bc.onmessage = (ev) => {
        const msg = ev.data as SyncState | RemoteCommand | undefined;
        if (!msg) return;
        if (msg.type === 'STATE') onStateRef.current?.(msg);
        else if (msg.type === 'CMD') onCommandRef.current?.(msg);
      };
    }

    const updateStagePeerCounts = () => {
      let remotes = 0;
      let presenters = 0;
      for (const [conn, pRole] of stageConnsRef.current.entries()) {
        if (!conn.open) continue;
        if (pRole === 'remote') remotes++;
        else presenters++;
      }
      setPeers({ stages: 1, remotes, presenters });
    };

    const startPeerJs = () => {
      if (closed) return;
      setTransport('cloud-p2p');
      const stageId = `jeff-youth-stage-${cleanSession}`;
      const peer = role === 'stage' ? new Peer(stageId) : new Peer();
      peerRef.current = peer;

      const connectClient = () => {
        if (closed || role === 'stage' || peer.destroyed) return;
        const conn = peer.connect(stageId, {
          metadata: { role },
          reliable: true,
        });
        clientConnRef.current = conn;

        conn.on('open', () => {
          if (closed) return;
          setConnected(true);
          setPeers({
            stages: 1,
            remotes: role === 'remote' ? 1 : 0,
            presenters: role === 'presenter' ? 1 : 0,
          });
          conn.send({ type: 'CMD', action: 'requestState' } satisfies RemoteCommand);
        });

        conn.on('data', (raw) => {
          const msg = raw as SyncState | RemoteCommand | undefined;
          if (!msg || typeof msg !== 'object') return;
          if (msg.type === 'STATE') onStateRef.current?.(msg);
        });

        conn.on('close', () => {
          if (closed) return;
          setConnected(false);
          setPeers({ stages: 0, remotes: 0, presenters: 0 });
          reconnectTimer = window.setTimeout(connectClient, 2000);
        });

        conn.on('error', () => {
          if (!closed) {
            reconnectTimer = window.setTimeout(connectClient, 2000);
          }
        });
      };

      peer.on('open', () => {
        if (closed) return;
        if (role === 'stage') {
          setConnected(true);
          updateStagePeerCounts();
        } else {
          connectClient();
        }
      });

      if (role === 'stage') {
        peer.on('connection', (conn) => {
          const meta = conn.metadata as { role?: string } | undefined;
          const pRole: 'remote' | 'presenter' =
            meta?.role === 'presenter' ? 'presenter' : 'remote';

          conn.on('open', () => {
            if (closed) {
              conn.close();
              return;
            }
            stageConnsRef.current.set(conn, pRole);
            updateStagePeerCounts();
            if (lastStateRef.current) {
              conn.send(lastStateRef.current);
            }
            onCommandRef.current?.({ type: 'CMD', action: 'requestState' });
          });

          conn.on('data', (raw) => {
            const msg = raw as RemoteCommand | undefined;
            if (msg && typeof msg === 'object' && msg.type === 'CMD') {
              onCommandRef.current?.(msg);
            }
          });

          const cleanupConn = () => {
            stageConnsRef.current.delete(conn);
            updateStagePeerCounts();
          };
          conn.on('close', cleanupConn);
          conn.on('error', cleanupConn);
        });
      }

      peer.on('error', () => {
        if (closed) return;
        if (role !== 'stage') {
          setConnected(false);
          reconnectTimer = window.setTimeout(connectClient, 2500);
        }
      });
    };

    const connectWs = () => {
      if (closed) return;
      setTransport('lan-ws');
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${proto}//${window.location.host}/ws?session=${encodeURIComponent(cleanSession)}&role=${role}`;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;
        let everOpened = false;

        ws.onopen = () => {
          if (closed) return;
          everOpened = true;
          setConnected(true);
          if (role !== 'stage') {
            ws.send(JSON.stringify({ type: 'CMD', action: 'requestState' }));
          }
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(String(ev.data)) as
              | SyncState
              | RemoteCommand
              | ({ type: 'PEERS' } & PeerCounts);
            if (msg.type === 'STATE') {
              onStateRef.current?.(msg);
            } else if (msg.type === 'CMD') {
              onCommandRef.current?.(msg);
            } else if (msg.type === 'PEERS') {
              setPeers({
                stages: msg.stages,
                remotes: msg.remotes,
                presenters: msg.presenters,
              });
            }
          } catch {
            // ignore malformed frame
          }
        };

        ws.onclose = () => {
          if (closed) return;
          setConnected(false);
          if (!everOpened) {
            startPeerJs();
          } else {
            reconnectTimer = window.setTimeout(connectWs, 1500);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        startPeerJs();
      }
    };

    if (useLanWs) {
      connectWs();
    } else {
      startPeerJs();
    }

    return () => {
      closed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
      clientConnRef.current?.close();
      clientConnRef.current = null;
      for (const conn of stageConnsRef.current.keys()) {
        conn.close();
      }
      stageConnsRef.current.clear();
      peerRef.current?.destroy();
      peerRef.current = null;
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, [cleanSession, role, useLanWs]);

  const sendState = useCallback((state: SyncState) => {
    lastStateRef.current = state;
    const raw = JSON.stringify(state);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(raw);
    }
    for (const conn of stageConnsRef.current.keys()) {
      if (conn.open) {
        conn.send(state);
      }
    }
    bcRef.current?.postMessage(state);
  }, []);

  const sendCommand = useCallback((cmd: RemoteCommandAction) => {
    const payload: RemoteCommand = { type: 'CMD', ...cmd };
    const raw = JSON.stringify(payload);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(raw);
    }
    if (clientConnRef.current?.open) {
      clientConnRef.current.send(payload);
    }
    bcRef.current?.postMessage(payload);
  }, []);

  return { connected, transport, peers, sendState, sendCommand };
}
