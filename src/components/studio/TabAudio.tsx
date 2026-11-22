import React from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { useDeck } from '../../context/DeckContext';
import type { SoundMode } from '../../types/presentation';

const SOUND_MODES: Array<{ id: SoundMode; label: string }> = [
  { id: 'cinema', label: 'Cinéma Mix' },
  { id: 'solo', label: 'Piano Pur' },
  { id: 'soft', label: 'Ultra-Doux' },
];

export const TabAudio: React.FC = () => {
  const {
    slides,
    currentSlide,
    config,
    audioState,
    updateConfig,
    toggleMute,
    toggleDuck,
    previewAudio,
  } = useDeck();
  const active = slides[currentSlide];

  return (
    <>
      <div>
        <div className="studio-section-title">Ambiance Sonore (Zéro-Clic)</div>
        <div className="seg-group" style={{ marginBottom: 10 }}>
          {SOUND_MODES.map((m) => (
            <button
              key={m.id}
              className={`seg-btn ${config.soundMode === m.id ? 'active' : ''}`}
              onClick={() => updateConfig({ soundMode: m.id })}
            >
              {m.label}
            </button>
          ))}
        </div>

        <label className="toggle-row">
          <span>Activer la Musique Adaptative</span>
          <input
            type="checkbox"
            checked={config.music}
            onChange={(e) => updateConfig({ music: e.target.checked })}
          />
        </label>
        <div className="slider-row">
          <span>Volume ({Math.round(config.musicVolume * 100)}%)</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={config.musicVolume}
            onChange={(e) => updateConfig({ musicVolume: parseFloat(e.target.value) })}
          />
        </div>
        <div className="slider-row">
          <span>Réverbération Salle ({Math.round(config.reverbWet * 100)}%)</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.03"
            value={config.reverbWet}
            onChange={(e) => updateConfig({ reverbWet: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <div className="studio-section-title">Contrôle Scène Live</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="btn-pair">
            <button
              className={`secondary-btn ${audioState.muted ? 'active' : ''}`}
              onClick={toggleMute}
            >
              {audioState.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{audioState.muted ? 'Reprendre (M)' : 'Mute doux (M)'}</span>
            </button>
            <button
              className={`secondary-btn ${audioState.ducked ? 'active' : ''}`}
              onClick={toggleDuck}
            >
              <span>Voice Duck 35% (D)</span>
            </button>
          </div>
          <button className="secondary-btn" onClick={previewAudio}>
            <Play size={14} />
            <span>Tester le son (Accord Fmaj9)</span>
          </button>
        </div>
      </div>

      <div className="studio-card">
        <div className="studio-section-title">Arc Musical Actuel</div>
        <div style={{ fontSize: '0.84rem', color: '#fef3c7', fontWeight: 500 }}>
          {active.pianoArcLabel}
        </div>
        <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: 6, lineHeight: 1.45 }}>
          Score évolutif : ouverture Satie, valse Hisaishi (02–03), pulse Einaudi sur l’alternance
          (04–05), silence complet au Pivot (06), puis thème Golden Hour chantant.
        </div>
      </div>

      <div>
        <div className="studio-section-title">Entrée en Scène</div>
        <label className="toggle-row">
          <span>Rideau Cinéma au lancement (P)</span>
          <input
            type="checkbox"
            checked={config.curtainOnPresent}
            onChange={(e) => updateConfig({ curtainOnPresent: e.target.checked })}
          />
        </label>
      </div>
    </>
  );
};
