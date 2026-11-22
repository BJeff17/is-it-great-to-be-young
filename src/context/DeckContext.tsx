import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CinemaPianoEngine } from '../audio/CinemaPianoEngine';
import { DEFAULT_CONFIG, DEFAULT_FINE_CONTROL, SLIDES } from '../data/slides';
import { isLocalOrLanHost, usePresentationSync } from '../sync/usePresentationSync';
import type {
  AudioStatus,
  DeckConfig,
  NetworkInfo,
  PeerCounts,
  RemoteCommand,
  SlideData,
  SlideFineControl,
  StudioTab,
  SyncTransport,
} from '../types/presentation';

const STORAGE_KEY = 'jeff_youth_deck_react_v2';
const SESSION_STORAGE_KEY = 'jeff_youth_session_id';

function randomRoomCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function resolveInitialSession(params: URLSearchParams): string {
  const fromUrl = params.get('session');
  if (fromUrl) return fromUrl;
  if (isLocalOrLanHost(window.location.hostname)) return 'live';
  try {
    const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) return cached;
    const fresh = randomRoomCode();
    sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return randomRoomCode();
  }
}

interface DeckContextValue {
  slides: SlideData[];
  currentSlide: number;
  currentBeat: number;
  timerSeconds: number;
  isBlackout: boolean;
  isCurtainOpen: boolean;
  isPresenting: boolean;
  isTransitioning: boolean;
  isInstantMode: boolean;
  studioOpen: boolean;
  studioTab: StudioTab;
  config: DeckConfig;
  audioState: AudioStatus;
  sessionId: string;
  isPublicHost: boolean;
  networkInfo: NetworkInfo;
  wsConnected: boolean;
  syncTransport: SyncTransport;
  peers: PeerCounts;
  getEffectiveFine: (slideIndex: number) => SlideFineControl;
  setStudioOpen: (open: boolean) => void;
  setStudioTab: (tab: StudioTab) => void;
  regenerateSession: () => void;
  previewAudio: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToSlide: (slideIndex: number, beat?: number) => void;
  liftCurtain: () => void;
  startImmersivePresentation: () => void;
  toggleBlackout: () => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
  toggleDuck: () => void;
  resetTimer: () => void;
  updateConfig: (patch: Partial<DeckConfig>) => void;
  updateFineControl: (scope: 'global' | number, patch: Partial<SlideFineControl>) => void;
  resetFineControl: (scope: 'global' | number) => void;
  exportConfigJson: () => string;
  importConfigJson: (raw: string) => boolean;
}

const DeckContext = createContext<DeckContextValue | null>(null);

function loadStoredConfig(): DeckConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<DeckConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      globalFine: { ...DEFAULT_FINE_CONTROL, ...(parsed.globalFine ?? {}) },
      slideOverrides: { ...DEFAULT_CONFIG.slideOverrides, ...(parsed.slideOverrides ?? {}) },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isInstantMode = params.get('instant') === '1';
  const isPublicHost = !isLocalOrLanHost(window.location.hostname);

  const [sessionId, setSessionId] = useState<string>(() => resolveInitialSession(params));

  const [config, setConfig] = useState<DeckConfig>(() => {
    const base = loadStoredConfig();
    const themeParam = params.get('theme');
    if (themeParam === 'cinema' || themeParam === 'a24' || themeParam === 'zine') {
      return { ...base, theme: themeParam };
    }
    return base;
  });

  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    const raw = parseInt(params.get('slide') ?? '0', 10);
    return Number.isFinite(raw) ? Math.max(0, Math.min(SLIDES.length - 1, raw)) : 0;
  });

  const [currentBeat, setCurrentBeat] = useState<number>(() => {
    const slideIdx = Math.max(
      0,
      Math.min(SLIDES.length - 1, parseInt(params.get('slide') ?? '0', 10) || 0)
    );
    const raw = parseInt(params.get('beat') ?? '0', 10) || 0;
    return Math.max(0, Math.min(SLIDES[slideIdx].maxBeats, raw));
  });

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isCurtainOpen, setIsCurtainOpen] = useState(params.get('curtain') === '1');
  const [isPresenting, setIsPresenting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [studioOpen, setStudioOpen] = useState(params.get('studio') === '1');
  const [studioTab, setStudioTab] = useState<StudioTab>(() => {
    const t = params.get('tab');
    return t === 'fine' || t === 'audio' || t === 'remote' ? t : 'direction';
  });

  const [audioState, setAudioState] = useState<AudioStatus>({
    started: false,
    muted: false,
    ducked: false,
  });

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(() => ({
    lanIp: window.location.hostname || 'localhost',
    ips: [],
    port: Number(window.location.port || (window.location.protocol === 'https:' ? 443 : 80)),
    protocol: window.location.protocol.replace(':', '') || 'http',
  }));

  const pianoRef = useRef<CinemaPianoEngine | null>(null);
  if (!pianoRef.current) {
    pianoRef.current = new CinemaPianoEngine(() => {
      if (pianoRef.current) {
        setAudioState(pianoRef.current.getStatus());
      }
    });
  }

  useEffect(() => {
    const engine = pianoRef.current;
    return () => {
      engine?.destroy();
    };
  }, []);

  // Fetch host LAN IP ONLY on local/LAN servers (skip on Vercel static hosting)
  useEffect(() => {
    if (isPublicHost) return;
    fetch('/api/network')
      .then((r) => {
        const ct = r.headers.get('content-type') ?? '';
        if (!r.ok || !ct.includes('application/json')) return null;
        return r.json();
      })
      .then((data: NetworkInfo | null) => {
        if (data && data.lanIp) {
          setNetworkInfo(data);
        }
      })
      .catch(() => {
        // fallback already set
      });
  }, [isPublicHost]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage quota errors
    }
  }, [config]);

  useEffect(() => {
    const engine = pianoRef.current;
    if (!engine) return;
    engine.setSettings({
      enabled: config.music,
      soundMode: config.soundMode,
      volume: config.musicVolume,
      reverbWet: config.reverbWet,
      blackout: isBlackout,
      curtainOpen: isCurtainOpen,
    });
  }, [config.music, config.soundMode, config.musicVolume, config.reverbWet, isBlackout, isCurtainOpen]);

  useEffect(() => {
    pianoRef.current?.onSlideChange(currentSlide, currentBeat);
  }, [currentSlide, currentBeat]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    const onFs = () => setIsPresenting(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const stateRef = useRef({
    currentSlide,
    currentBeat,
    isTransitioning,
    isCurtainOpen,
    isBlackout,
  });
  stateRef.current = { currentSlide, currentBeat, isTransitioning, isCurtainOpen, isBlackout };

  const regenerateSession = useCallback(() => {
    const nextCode = randomRoomCode();
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, nextCode);
    } catch {
      // ignore
    }
    setSessionId(nextCode);
  }, []);

  const previewAudio = useCallback(() => {
    pianoRef.current?.playPreviewChord();
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(0);
  }, []);

  const goToSlide = useCallback(
    (slideIndex: number, beat = 0) => {
      const target = Math.max(0, Math.min(SLIDES.length - 1, slideIndex));
      const prev = stateRef.current.currentSlide;
      const crossingMajorAct =
        !isInstantMode && ((prev === 4 && target === 5) || (prev === 5 && target === 6));

      if (crossingMajorAct && !stateRef.current.isTransitioning) {
        setIsTransitioning(true);
        window.setTimeout(() => {
          setCurrentSlide(target);
          setCurrentBeat(Math.max(0, Math.min(SLIDES[target].maxBeats, beat)));
          window.setTimeout(() => setIsTransitioning(false), 180);
        }, 220);
        return;
      }

      setCurrentSlide(target);
      setCurrentBeat(Math.max(0, Math.min(SLIDES[target].maxBeats, beat)));
    },
    [isInstantMode]
  );

  const liftCurtain = useCallback(() => {
    setIsCurtainOpen(false);
    setTimerSeconds(0);
    setTimerRunning(true);
    setCurrentSlide(0);
    setCurrentBeat(0);
    pianoRef.current?.ensureStarted();
    pianoRef.current?.syncLevels();
  }, []);

  const startImmersivePresentation = useCallback(() => {
    setStudioOpen(false);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
    if (config.curtainOnPresent) {
      setIsCurtainOpen(true);
    } else {
      pianoRef.current?.ensureStarted();
      setTimerRunning(true);
    }
  }, [config.curtainOnPresent]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      setStudioOpen(false);
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const toggleBlackout = useCallback(() => {
    setIsBlackout((b) => !b);
  }, []);

  const toggleMute = useCallback(() => {
    pianoRef.current?.toggleMute();
  }, []);

  const toggleDuck = useCallback(() => {
    pianoRef.current?.toggleDuck();
  }, []);

  const nextStep = useCallback(() => {
    const st = stateRef.current;
    if (st.isTransitioning) return;
    if (st.isCurtainOpen) {
      liftCurtain();
      return;
    }
    pianoRef.current?.ensureStarted();
    setTimerRunning(true);
    const maxB = SLIDES[st.currentSlide].maxBeats;
    if (st.currentBeat < maxB) {
      setCurrentBeat(st.currentBeat + 1);
    } else if (st.currentSlide < SLIDES.length - 1) {
      goToSlide(st.currentSlide + 1, 0);
    }
  }, [goToSlide, liftCurtain]);

  const prevStep = useCallback(() => {
    const st = stateRef.current;
    if (st.isTransitioning) return;
    if (st.currentBeat > 0) {
      setCurrentBeat(st.currentBeat - 1);
    } else if (st.currentSlide > 0) {
      const prevIdx = st.currentSlide - 1;
      goToSlide(prevIdx, SLIDES[prevIdx].maxBeats);
    }
  }, [goToSlide]);

  const updateConfig = useCallback((patch: Partial<DeckConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateFineControl = useCallback(
    (scope: 'global' | number, patch: Partial<SlideFineControl>) => {
      setConfig((prev) => {
        if (scope === 'global') {
          return { ...prev, globalFine: { ...prev.globalFine, ...patch } };
        }
        return {
          ...prev,
          slideOverrides: {
            ...prev.slideOverrides,
            [scope]: { ...(prev.slideOverrides[scope] ?? {}), ...patch },
          },
        };
      });
    },
    []
  );

  const resetFineControl = useCallback((scope: 'global' | number) => {
    setConfig((prev) => {
      if (scope === 'global') {
        return { ...prev, globalFine: { ...DEFAULT_FINE_CONTROL } };
      }
      const nextOverrides = { ...prev.slideOverrides };
      delete nextOverrides[scope];
      return { ...prev, slideOverrides: nextOverrides };
    });
  }, []);

  const exportConfigJson = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importConfigJson = useCallback((raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw) as Partial<DeckConfig>;
      if (!parsed || typeof parsed !== 'object') return false;
      setConfig((prev) => ({
        ...prev,
        ...parsed,
        globalFine: { ...DEFAULT_FINE_CONTROL, ...(parsed.globalFine ?? prev.globalFine) },
        slideOverrides: parsed.slideOverrides ?? prev.slideOverrides,
      }));
      return true;
    } catch {
      return false;
    }
  }, []);

  const getEffectiveFine = useCallback(
    (slideIndex: number): SlideFineControl => ({
      ...config.globalFine,
      ...(config.slideOverrides[slideIndex] ?? {}),
    }),
    [config.globalFine, config.slideOverrides]
  );

  const pathname = window.location.pathname;
  const isStageRoute = !pathname.startsWith('/remote') && !pathname.startsWith('/presenter');

  const handleIncomingCommand = useCallback(
    (cmd: RemoteCommand) => {
      if (!isStageRoute) return;
      switch (cmd.action) {
        case 'next':
        case 'scrollDelta':
          if (cmd.action === 'scrollDelta' && cmd.direction === 'prev') {
            prevStep();
          } else {
            nextStep();
          }
          break;
        case 'prev':
          prevStep();
          break;
        case 'goto':
          goToSlide(cmd.slide, cmd.beat ?? 0);
          break;
        case 'mute':
          toggleMute();
          break;
        case 'duck':
          toggleDuck();
          break;
        case 'blackout':
          toggleBlackout();
          break;
        case 'liftCurtain':
          liftCurtain();
          break;
        case 'openCurtain':
          setIsCurtainOpen(true);
          break;
        case 'resetTimer':
          resetTimer();
          break;
        case 'updateConfig':
          updateConfig(cmd.patch);
          break;
        case 'requestState':
          sendStateNow();
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isStageRoute, nextStep, prevStep, goToSlide, toggleMute, toggleDuck, toggleBlackout, liftCurtain, resetTimer, updateConfig]
  );

  const {
    connected: wsConnected,
    transport: syncTransport,
    peers,
    sendState,
  } = usePresentationSync({
    session: sessionId,
    role: 'stage',
    onCommand: isStageRoute ? handleIncomingCommand : undefined,
  });

  const sendStateNow = useCallback(() => {
    if (!isStageRoute) return;
    sendState({
      type: 'STATE',
      session: sessionId,
      slide: currentSlide,
      totalSlides: SLIDES.length,
      beat: currentBeat,
      maxBeats: SLIDES[currentSlide].maxBeats,
      timerSeconds,
      isBlackout,
      isCurtainOpen,
      isPresenting,
      audio: audioState,
      config,
    });
  }, [
    isStageRoute,
    sendState,
    sessionId,
    currentSlide,
    currentBeat,
    timerSeconds,
    isBlackout,
    isCurtainOpen,
    isPresenting,
    audioState,
    config,
  ]);

  useEffect(() => {
    sendStateNow();
  }, [sendStateNow]);

  const value: DeckContextValue = {
    slides: SLIDES,
    currentSlide,
    currentBeat,
    timerSeconds,
    isBlackout,
    isCurtainOpen,
    isPresenting,
    isTransitioning,
    isInstantMode,
    studioOpen,
    studioTab,
    config,
    audioState,
    sessionId,
    isPublicHost,
    networkInfo,
    wsConnected,
    syncTransport,
    peers,
    getEffectiveFine,
    setStudioOpen,
    setStudioTab,
    regenerateSession,
    previewAudio,
    nextStep,
    prevStep,
    goToSlide,
    liftCurtain,
    startImmersivePresentation,
    toggleBlackout,
    toggleFullscreen,
    toggleMute,
    toggleDuck,
    resetTimer,
    updateConfig,
    updateFineControl,
    resetFineControl,
    exportConfigJson,
    importConfigJson,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export function useDeck(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck must be used inside DeckProvider');
  return ctx;
}
