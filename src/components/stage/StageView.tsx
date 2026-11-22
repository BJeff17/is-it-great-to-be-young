import React, { useEffect, useRef, useState } from 'react';
import { useDeck } from '../../context/DeckContext';
import { CinemaCurtain } from './CinemaCurtain';
import { GoldenDustCanvas } from './GoldenDustCanvas';
import { SlideRenderer } from './SlideRenderer';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(sec: number) {
  return `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
}

export const StageView: React.FC = () => {
  const {
    slides,
    currentSlide,
    currentBeat,
    timerSeconds,
    isBlackout,
    isCurtainOpen,
    isPresenting,
    isTransitioning,
    isInstantMode,
    studioOpen,
    config,
    audioState,
    peers,
    sessionId,
    setStudioOpen,
    setStudioTab,
    nextStep,
    prevStep,
    liftCurtain,
    startImmersivePresentation,
    toggleBlackout,
    toggleFullscreen,
    toggleMute,
    toggleDuck,
    resetTimer,
    updateConfig,
  } = useDeck();

  const [cursorHidden, setCursorHidden] = useState(false);
  const cursorTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Auto-hide cursor in presentation / curtain mode
  useEffect(() => {
    const resetCursor = () => {
      setCursorHidden(false);
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
      if (isPresenting || isCurtainOpen) {
        cursorTimerRef.current = window.setTimeout(() => setCursorHidden(true), 1600);
      }
    };
    resetCursor();
    window.addEventListener('mousemove', resetCursor);
    return () => {
      window.removeEventListener('mousemove', resetCursor);
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    };
  }, [isPresenting, isCurtainOpen]);

  // Global keyboard shortcuts & clicker support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') {
        if (studioOpen) return;
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        if (studioOpen) return;
        e.preventDefault();
        prevStep();
      } else if (e.key.toLowerCase() === 's') {
        setStudioOpen(!studioOpen);
      } else if (e.key.toLowerCase() === 'p') {
        startImmersivePresentation();
      } else if (e.key.toLowerCase() === 'o') {
        window.open(`/presenter?session=${encodeURIComponent(sessionId)}`, 'JeffPresenterConsole', 'width=980,height=740');
      } else if (e.key.toLowerCase() === 'b') {
        toggleBlackout();
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      } else if (e.key.toLowerCase() === 'd') {
        toggleDuck();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        updateConfig({ hud: !config.hud });
      } else if (e.key.toLowerCase() === 'r') {
        resetTimer();
      } else if (e.key === 'Escape') {
        setStudioOpen(false);
        if (isBlackout) toggleBlackout();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    studioOpen,
    config.hud,
    isBlackout,
    sessionId,
    nextStep,
    prevStep,
    setStudioOpen,
    startImmersivePresentation,
    toggleBlackout,
    toggleMute,
    toggleDuck,
    toggleFullscreen,
    updateConfig,
    resetTimer,
  ]);

  const active = slides[currentSlide];
  const kenBurnsDuration =
    config.motionSpeed === 'still' || !config.motion
      ? '0s'
      : config.motionSpeed === 'medium'
        ? '10s'
        : '16s';

  const rootStyle = {
    '--letterbox-h': `${config.letterboxHeight}vh`,
    '--grain-opacity': config.grainOpacity,
    '--ken-burns-dur': kenBurnsDuration,
  } as React.CSSProperties;

  const classes = [
    'stage-root',
    config.letterbox && config.theme === 'cinema' ? 'letterbox-on' : '',
    !config.grain ? 'no-grain' : '',
    !config.memes ? 'no-memes' : '',
    !config.motion || config.motionSpeed === 'still' ? 'no-motion' : '',
    config.hud ? 'show-hud' : '',
    isPresenting ? 'presenting' : '',
    isCurtainOpen ? 'curtain-open' : '',
    isInstantMode ? 'instant-mode' : '',
    cursorHidden ? 'cursor-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  let audioLabel = 'PIANO READY';
  let audioClass = 'audio-pill';
  if (!config.music) {
    audioLabel = 'PIANO OFF';
    audioClass = 'audio-pill muted';
  } else if (audioState.muted) {
    audioLabel = 'PIANO MUTED (M)';
    audioClass = 'audio-pill muted';
  } else if (audioState.ducked) {
    audioLabel = 'PIANO DUCKED (D)';
    audioClass = 'audio-pill playing';
  } else if (audioState.started) {
    audioLabel = currentSlide === 5 && currentBeat === 0 ? 'PIVOT SILENCE' : 'PIANO LIVE';
    audioClass = 'audio-pill playing';
  }

  return (
    <div
      className={classes}
      data-theme={config.theme}
      style={rootStyle}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }}
      onTouchEnd={(e) => {
        if (studioOpen || !touchStartRef.current || e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        touchStartRef.current = null;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) nextStep();
          else prevStep();
        }
      }}
    >
      <div className="film-grain" />
      <div className="zine-halftone" />
      <GoldenDustCanvas
        visible={currentSlide >= 6 && config.goldenDust && config.motion}
        instantMode={isInstantMode}
      />
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      <div
        className={`act-veil ${isTransitioning ? 'dip' : ''} ${isBlackout ? 'blackout' : ''}`}
      />

      <CinemaCurtain onLift={liftCurtain} />

      {/* A24 Editorial Frame Metadata */}
      <div className="a24-meta tl">{active.act}</div>
      <div className="a24-meta tr">{active.timeRange}</div>
      <div className="a24-meta bl">IS IT REALLY THAT GREAT TO BE YOUNG?</div>
      <div className="a24-meta br">
        {pad2(currentSlide + 1)} / {pad2(slides.length)}
      </div>

      {/* Main Clickable Stage */}
      <div
        style={{ width: '100%', height: '100%' }}
        onClick={(e) => {
          if (studioOpen) {
            setStudioOpen(false);
            return;
          }
          if (e.clientX < window.innerWidth * 0.22) prevStep();
          else nextStep();
        }}
      >
        <SlideRenderer />
      </div>

      {/* Progress Hairline */}
      <div
        className="progress-hairline"
        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
      />

      {/* Optional Presenter HUD (N) */}
      <div className="presenter-hud">
        <span>
          {pad2(currentSlide + 1)}/{pad2(slides.length)}
        </span>
        <span className="hud-accent">
          Beat {currentBeat}/{active.maxBeats}
        </span>
        <span>{active.cue}</span>
        <span>{formatTime(timerSeconds)}</span>
      </div>

      {/* Subtle Floating Piano Pill */}
      <button
        className={audioClass}
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        title="Mute / Reprendre le piano (M)"
      >
        <span>♪</span>
        <span>{audioLabel}</span>
      </button>

      {/* Top Right Non-Fullscreen Controls */}
      <div className="stage-top-right">
        {peers.remotes > 0 && (
          <button
            className="remote-badge online"
            onClick={(e) => {
              e.stopPropagation();
              setStudioTab('remote');
              setStudioOpen(true);
            }}
            title="Téléphone connecté en temps réel"
          >
            <span className="remote-dot" />
            <span>MOBILE ({peers.remotes})</span>
          </button>
        )}
        <button
          className="studio-trigger"
          onClick={(e) => {
            e.stopPropagation();
            setStudioOpen(!studioOpen);
          }}
          title="Ouvrir le Studio Pro (S)"
        >
          <span>⚙</span>
          <span>STUDIO (S)</span>
        </button>
      </div>
    </div>
  );
};
