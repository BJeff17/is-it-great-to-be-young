import React, { useMemo, useState } from 'react';
import { DEFAULT_CONFIG, SLIDES } from '../../data/slides';
import { usePresentationSync } from '../../sync/usePresentationSync';
import type { SyncState } from '../../types/presentation';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(sec: number) {
  return `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
}

export const PresenterConsoleView: React.FC = () => {
  const session = useMemo(
    () => new URLSearchParams(window.location.search).get('session') ?? 'live',
    []
  );

  const [state, setState] = useState<SyncState>({
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

  const { connected, peers, sendCommand } = usePresentationSync({
    session,
    role: 'presenter',
    onState: (incoming) => setState(incoming),
  });

  const active = SLIDES[state.slide] ?? SLIDES[0];
  const next = state.slide < SLIDES.length - 1 ? SLIDES[state.slide + 1] : null;
  const diff = state.timerSeconds - active.targetEndSec;

  let paceClass = 'ok';
  let paceLabel = 'Prêt · Cible 06:30';
  if (state.timerSeconds > 0) {
    if (Math.abs(diff) <= 15) {
      paceClass = 'ok';
      paceLabel = `Dans le tempo (cible ${formatTime(active.targetEndSec)})`;
    } else if (Math.abs(diff) <= 35) {
      paceClass = 'warn';
      paceLabel = `${diff > 0 ? '+' : ''}${diff}s vs cible slide`;
    } else {
      paceClass = 'bad';
      paceLabel = `${diff > 0 ? 'En retard +' : 'En avance '}${diff}s`;
    }
  }

  return (
    <div className="presenter-shell">
      <div className="presenter-top">
        <div>
          <div className="presenter-meta">
            SLIDE {pad2(state.slide + 1)}/{pad2(state.totalSlides)} · {active.act} ·{' '}
            {active.timeRange} · {connected ? `${peers.remotes} mobile(s)` : 'Hors ligne'}
          </div>
          <div className="presenter-title">{active.title}</div>
        </div>
        <div>
          <div className="presenter-chrono">{formatTime(state.timerSeconds)}</div>
          <div className={`presenter-pace ${paceClass}`}>{paceLabel}</div>
        </div>
      </div>

      <div className="presenter-cue-bar">
        <span>{active.cue}</span>
        <strong>
          Beat {state.beat} / {state.maxBeats}
        </strong>
      </div>

      <div className="presenter-grid">
        <div className="presenter-card">
          <h3>Texte & Repères Oraux</h3>
          <div className="presenter-spoken">{active.spoken}</div>
        </div>
        <div className="presenter-card">
          <h3>Slide Suivante</h3>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
            {next ? next.title : 'Fin de présentation'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#94a3b8' }}>
            {next ? next.cue : 'Saluer le public & remercier'}
          </div>

          <div style={{ marginTop: 22 }}>
            <h3>Partition Piano</h3>
            <div style={{ fontSize: 13, color: '#fde68a' }}>{active.pianoArcLabel}</div>
          </div>
        </div>
      </div>

      <div className="presenter-controls">
        <button onClick={() => sendCommand({ action: 'prev' })}>← Reculer</button>
        <button className="primary" onClick={() => sendCommand({ action: 'next' })}>
          Beat / Slide Suivante →
        </button>
        <button
          className={state.audio.muted ? 'active' : ''}
          onClick={() => sendCommand({ action: 'mute' })}
        >
          Piano Mute (M)
        </button>
        <button
          className={state.audio.ducked ? 'active' : ''}
          onClick={() => sendCommand({ action: 'duck' })}
        >
          Voice Duck (D)
        </button>
        <button
          className={state.isBlackout ? 'active' : ''}
          onClick={() => sendCommand({ action: 'blackout' })}
        >
          Blackout (B)
        </button>
        <button onClick={() => sendCommand({ action: 'resetTimer' })}>Reset Chrono (R)</button>
      </div>
    </div>
  );
};
