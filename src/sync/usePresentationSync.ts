import { useCallback, useEffect, useRef, useState } from 'react';
import type { PeerCounts, RemoteCommand, RemoteCommandAction, SyncState } from '../types/presentation';

type SyncRole = 'stage' | 'remote' | 'presenter';

interface UsePresentationSyncOptions {
  session: string;
  role: SyncRole;
  onState?: (state: SyncState) => void;
  onCommand?: (cmd: RemoteCommand) => void;
}

export function usePresentationSync({
  session,
  role,
  onState,
  onCommand,
}: UsePresentationSyncOptions) {
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<PeerCounts>({ stages: 0, remotes: 0, presenters: 0 });

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const onStateRef = useRef(onState);
  const onCommandRef = useRef(onCommand);

  onStateRef.current = onState;
  onCommandRef.current = onCommand;

  useEffect(() => {
    let closed = false;
    let reconnectTimer: number | null = null;

    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`jeff_presentation_sync_v2_${session}`);
      bcRef.current = bc;
      bc.onmessage = (ev) => {
        const msg = ev.data as SyncState | RemoteCommand | undefined;
        if (!msg) return;
        if (msg.type === 'STATE') onStateRef.current?.(msg);
        else if (msg.type === 'CMD') onCommandRef.current?.(msg);
      };
    }

    const connectWs = () => {
      if (closed) return;
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${proto}//${window.location.host}/ws?session=${encodeURIComponent(session)}&role=${role}`;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (closed) return;
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
          reconnectTimer = window.setTimeout(connectWs, 1500);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        reconnectTimer = window.setTimeout(connectWs, 1500);
      }
    };

    connectWs();

    return () => {
      closed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, [session, role]);

  const sendState = useCallback((state: SyncState) => {
    const raw = JSON.stringify(state);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(raw);
    }
    bcRef.current?.postMessage(state);
  }, []);

  const sendCommand = useCallback((cmd: RemoteCommandAction) => {
    const payload: RemoteCommand = { type: 'CMD', ...cmd };
    const raw = JSON.stringify(payload);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(raw);
    }
    bcRef.current?.postMessage(payload);
  }, []);

  return { connected, peers, sendState, sendCommand };
}
