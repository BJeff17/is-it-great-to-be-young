import React, { useMemo, useRef, useState } from 'react';
import { DEFAULT_CONFIG, SLIDES } from '../../data/slides';
import { usePresentationSync } from '../../sync/usePresentationSync';
import type { ArtDirection, RemoteCommandAction, SyncState } from '../../types/presentation';

type RemoteTab = 'trackpad' | 'script' | 'live';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(sec: number) {
  return `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
}

export const MobileRemoteView: React.FC = () => {
  const session = useMemo(
    () => new URLSearchParams(window.location.search).get('session') ?? 'live',
    []
  );

  const [tab, setTab] = useState<RemoteTab>('trackpad');
  const [stageState, setStageState] = useState<SyncState>({
    type: 'STATE',
    session,
    slide: 0,
    totalSlides: SLIDES.length,
    beat: 0,
    maxBeats: SLIDES[0].maxBeats,
    timerSeconds: 0,
    isBlackout: false,
    isCurtainOpen: false,
    isPresenting: false,
    audio: { started: false, muted: false, ducked: false },
    config: DEFAULT_CONFIG,
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const wheelLockRef = useRef(0);

  const { connected, transport, peers, sendCommand } = usePresentationSync({
    session,
    role: 'remote',
    onState: (incoming) => setStageState(incoming),
  });

  const fireCmd = (cmd: RemoteCommandAction) => {
    navigator.vibrate?.(18);
    sendCommand(cmd);
  };

  const slide = SLIDES[stageState.slide] ?? SLIDES[0];
  const diff = stageState.timerSeconds - slide.targetEndSec;
  const paceText =
    stageState.timerSeconds === 0
      ? `Prêt · ${formatTime(SLIDES[SLIDES.length - 1].targetEndSec)}`
      : Math.abs(diff) <= 15
        ? `Dans le tempo (${formatTime(slide.targetEndSec)})`
        : diff > 0
          ? `+${diff}s vs cible`
          : `${diff}s vs cible`;

  const handleTrackpadWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - wheelLockRef.current < 320) return;
    if (Math.abs(e.deltaY) < 12) return;
    wheelLockRef.current = now;
    fireCmd({ action: 'scrollDelta', direction: e.deltaY > 0 ? 'next' : 'prev' });
  };

  const connLabel = connected
    ? transport === 'cloud-p2p'
      ? `P2P Live · ${peers.stages} écran`
      : `LAN Live · ${peers.stages} écran`
    : 'Connexion...';

  return (
    <div className="remote-shell">
      <header className="remote-header">
        <div>
          <div className="remote-status">
            <span
              className="remote-dot"
              style={{
                background: connected ? '#10b981' : '#f59e0b',
                boxShadow: connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
              }}
            />
            <span>{connLabel}</span>
          </div>
          <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 600, marginTop: 3 }}>
            Slide {pad2(stageState.slide + 1)}/{pad2(stageState.totalSlides)} · Beat {stageState.beat}/
            {stageState.maxBeats}
          </div>
        </div>

        <div className="remote-chrono-wrap">
          <div className="remote-chrono">{formatTime(stageState.timerSeconds)}</div>
          <div className="remote-pace">{paceText}</div>
        </div>
      </header>

      <div className="remote-mode-bar">
        <button
          className={`remote-mode-btn ${tab === 'trackpad' ? 'active' : ''}`}
          onClick={() => setTab('trackpad')}
        >
          Scroll / Pad
        </button>
        <button
          className={`remote-mode-btn ${tab === 'script' ? 'active' : ''}`}
          onClick={() => setTab('script')}
        >
          Prompteur
        </button>
        <button
          className={`remote-mode-btn ${tab === 'live' ? 'active' : ''}`}
          onClick={() => setTab('live')}
        >
          Réglages Live
        </button>
      </div>

      <main className="remote-main">
        <div className="remote-cue-card">
          <div className="remote-cue-title">{slide.title}</div>
          <div className="remote-cue-sub">{slide.cue}</div>
        </div>

        {tab === 'trackpad' && (
          <div
            className="remote-trackpad"
            onWheel={handleTrackpadWheel}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              }
            }}
            onTouchEnd={(e) => {
              if (!touchStartRef.current || e.changedTouches.length !== 1) return;
              const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
              const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
              touchStartRef.current = null;
              if (Math.abs(dy) > 34 || Math.abs(dx) > 34) {
                const forward = Math.abs(dy) >= Math.abs(dx) ? dy < 0 : dx < 0;
                fireCmd({ action: 'scrollDelta', direction: forward ? 'next' : 'prev' });
              }
            }}
            onClick={() => fireCmd({ action: 'next' })}
          >
            <div className="remote-trackpad-icon">ZONE SCROLL & TACTILE</div>
            <div className="remote-trackpad-hint">
              Glisse vers le <strong>haut / gauche</strong> ou touche pour avancer.
              <br />
              Glisse vers le <strong>bas / droite</strong> pour reculer.
            </div>
          </div>
        )}

        {tab === 'script' && <div className="remote-script-scroll">{slide.spoken}</div>}

        {tab === 'live' && (
          <div className="remote-live-grid">
            <div className="remote-actions-2col">
              <button
                className={`remote-pill-btn ${stageState.isCurtainOpen ? 'active' : ''}`}
                onClick={() =>
                  fireCmd({ action: stageState.isCurtainOpen ? 'liftCurtain' : 'openCurtain' })
                }
              >
                {stageState.isCurtainOpen ? 'Lever le Rideau' : 'Remettre Rideau'}
              </button>
              <button
                className={`remote-pill-btn ${stageState.isBlackout ? 'active' : ''}`}
                onClick={() => fireCmd({ action: 'blackout' })}
              >
                {stageState.isBlackout ? 'Quitter Blackout' : 'Blackout (B)'}
              </button>
              <button
                className={`remote-pill-btn ${stageState.audio.muted ? 'active' : ''}`}
                onClick={() => fireCmd({ action: 'mute' })}
              >
                {stageState.audio.muted ? 'Reprendre Audio' : 'Mute Audio (M)'}
              </button>
              <button
                className={`remote-pill-btn ${stageState.audio.ducked ? 'active' : ''}`}
                onClick={() => fireCmd({ action: 'duck' })}
              >
                Voice Duck 35%
              </button>
            </div>

            <button className="remote-pill-btn" onClick={() => fireCmd({ action: 'resetTimer' })}>
              Réinitialiser Chrono (00:00)
            </button>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Direction Artistique sur scène
              </div>
              <div className="remote-mode-bar" style={{ padding: 0, borderBottom: 'none' }}>
                {(['cinema', 'a24', 'zine'] as ArtDirection[]).map((th) => (
                  <button
                    key={th}
                    className={`remote-mode-btn ${stageState.config.theme === th ? 'active' : ''}`}
                    onClick={() => fireCmd({ action: 'updateConfig', patch: { theme: th } })}
                  >
                    {th.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="remote-scrubber">
        {SLIDES.map((s) => (
          <button
            key={s.id}
            className={`remote-scrub-btn ${s.id === stageState.slide ? 'active' : ''}`}
            onClick={() => fireCmd({ action: 'goto', slide: s.id, beat: 0 })}
          >
            {s.numberLabel}
          </button>
        ))}
      </div>

      <footer className="remote-thumb-bar">
        <button className="thumb-prev" onClick={() => fireCmd({ action: 'prev' })}>
          ← Reculer
        </button>
        <button className="thumb-next" onClick={() => fireCmd({ action: 'next' })}>
          {stageState.isCurtainOpen ? 'Lancer Scène →' : 'Suivant →'}
        </button>
      </footer>
    </div>
  );
};
