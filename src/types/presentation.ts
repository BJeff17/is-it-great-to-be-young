export type ArtDirection = 'cinema' | 'a24' | 'zine';

export type KenBurnsSpeed = 'slow' | 'medium' | 'still';

export type StudioTab = 'direction' | 'fine' | 'audio' | 'remote';

export interface SlideFineControl {
  textScale: number;      // 0.85 to 1.25 (default 1.0)
  scrimOpacity: number;   // 0.4 to 1.6 (default 1.0)
  brightness: number;     // 0.7 to 1.25 (default 1.0)
  warmth: number;         // -0.15 to 0.25 sepia/warm shift (default 0)
  contrast: number;       // 0.85 to 1.3 (default 1.0)
  offsetY: number;        // -6 to 6 vh (default 0)
}

export interface DeckConfig {
  theme: ArtDirection;
  letterbox: boolean;
  letterboxHeight: number;  // 0 to 10 vh (default 6)
  grain: boolean;
  grainOpacity: number;     // 0 to 0.12 (default 0.04)
  memes: boolean;
  motion: boolean;
  motionSpeed: KenBurnsSpeed;
  goldenDust: boolean;
  hud: boolean;
  music: boolean;
  musicVolume: number;      // 0 to 1 (default 0.28)
  reverbWet: number;        // 0 to 1 (default 0.68)
  curtainOnPresent: boolean;
  globalFine: SlideFineControl;
  slideOverrides: Record<number, Partial<SlideFineControl>>;
  customBaseUrl: string;
}

export interface SlideData {
  id: number;               // 0..11
  numberLabel: string;      // '01'..'12'
  title: string;
  act: string;
  timeRange: string;
  targetEndSec: number;
  maxBeats: number;
  cue: string;
  spoken: string;
  pianoArcLabel: string;
  image?: string;
  imageAlt?: string;
}

export interface NetworkInfo {
  lanIp: string;
  ips: string[];
  port: number;
  protocol: string;
}

export interface PeerCounts {
  stages: number;
  remotes: number;
  presenters: number;
}

export interface AudioStatus {
  started: boolean;
  muted: boolean;
  ducked: boolean;
}

export interface SyncState {
  type: 'STATE';
  session: string;
  slide: number;
  totalSlides: number;
  beat: number;
  maxBeats: number;
  timerSeconds: number;
  isBlackout: boolean;
  isCurtainOpen: boolean;
  isPresenting: boolean;
  audio: AudioStatus;
  config: DeckConfig;
}

export type RemoteCommandAction =
  | { action: 'next' }
  | { action: 'prev' }
  | { action: 'goto'; slide: number; beat?: number }
  | { action: 'mute' }
  | { action: 'duck' }
  | { action: 'blackout' }
  | { action: 'liftCurtain' }
  | { action: 'openCurtain' }
  | { action: 'resetTimer' }
  | { action: 'updateConfig'; patch: Partial<DeckConfig> }
  | { action: 'scrollDelta'; direction: 'next' | 'prev' }
  | { action: 'requestState' };

export type RemoteCommand = { type: 'CMD' } & RemoteCommandAction;
