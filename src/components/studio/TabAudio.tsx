import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useDeck } from '../../context/DeckContext';

export const TabAudio: React.FC = () => {
  const { slides, currentSlide, config, audioState, updateConfig, toggleMute, toggleDuck } =
    useDeck();
  const active = slides[currentSlide];

  return (
    <>
      <div>
        <div className="studio-section-title">Partition Piano Feutré</div>
        <label className="toggle-row">
          <span>Activer le Piano Adaptatif</span>
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
      </div>

      <div className="studio-card">
        <div className="studio-section-title">Arc Musical Actuel</div>
        <div style={{ fontSize: '0.84rem', color: '#fef3c7', fontWeight: 500 }}>
          {active.pianoArcLabel}
        </div>
        <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: 6, lineHeight: 1.45 }}>
          La musique suit automatiquement tes 4 arcs : silence pur à l’entrée du Pivot (Slide 06),
          éclosion d’un accord Fmaj9 sur <em>Unwritten pages</em>, puis résolution Golden Hour.
        </div>
      </div>

      <div>
        <div className="studio-section-title">Comportement Entrée en Scène</div>
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
