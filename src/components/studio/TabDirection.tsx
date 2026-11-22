import React from 'react';
import { useDeck } from '../../context/DeckContext';
import type { ArtDirection, KenBurnsSpeed } from '../../types/presentation';

const THEMES: Array<{ id: ArtDirection; name: string; desc: string }> = [
  {
    id: 'cinema',
    name: "Cinéma d'Animation",
    desc: 'Plein écran immersif, lumières Shinkai, typographie libre sans cards.',
  },
  {
    id: 'a24',
    name: 'Éditorial Indie (A24)',
    desc: 'Cadre galerie, métadonnées 35mm, typographie haute couture.',
  },
  {
    id: 'zine',
    name: 'Zine & Collage Moderne',
    desc: 'Textures halftone, scotch, tampons & énergie culture jeune.',
  },
];

export const TabDirection: React.FC = () => {
  const { config, updateConfig } = useDeck();

  return (
    <>
      <div>
        <div className="studio-section-title">Direction Artistique</div>
        <div className="theme-cards">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-card ${config.theme === t.id ? 'active' : ''}`}
              onClick={() => updateConfig({ theme: t.id })}
            >
              <strong>{t.name}</strong>
              <span>{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="studio-section-title">Ambiance & Pellicule</div>
        <label className="toggle-row">
          <span>Bandes Cinéma 2.39:1</span>
          <input
            type="checkbox"
            checked={config.letterbox}
            onChange={(e) => updateConfig({ letterbox: e.target.checked })}
          />
        </label>
        {config.letterbox && (
          <div className="slider-row">
            <span>Hauteur bandes ({config.letterboxHeight.toFixed(1)}vh)</span>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={config.letterboxHeight}
              onChange={(e) => updateConfig({ letterboxHeight: parseFloat(e.target.value) })}
            />
          </div>
        )}

        <label className="toggle-row">
          <span>Grain Pellicule 35mm</span>
          <input
            type="checkbox"
            checked={config.grain}
            onChange={(e) => updateConfig({ grain: e.target.checked })}
          />
        </label>
        {config.grain && (
          <div className="slider-row">
            <span>Intensité grain ({Math.round(config.grainOpacity * 100)}%)</span>
            <input
              type="range"
              min="0.01"
              max="0.12"
              step="0.005"
              value={config.grainOpacity}
              onChange={(e) => updateConfig({ grainOpacity: parseFloat(e.target.value) })}
            />
          </div>
        )}

        <label className="toggle-row">
          <span>Refs Jeunes & Memes subtils</span>
          <input
            type="checkbox"
            checked={config.memes}
            onChange={(e) => updateConfig({ memes: e.target.checked })}
          />
        </label>

        <label className="toggle-row">
          <span>Particules Golden Hour (07–12)</span>
          <input
            type="checkbox"
            checked={config.goldenDust}
            onChange={(e) => updateConfig({ goldenDust: e.target.checked })}
          />
        </label>

        <label className="toggle-row">
          <span>Barre Repères & Chrono (N)</span>
          <input
            type="checkbox"
            checked={config.hud}
            onChange={(e) => updateConfig({ hud: e.target.checked })}
          />
        </label>
      </div>

      <div>
        <div className="studio-section-title">Mouvement Caméra (Ken Burns)</div>
        <div className="seg-group">
          {(['slow', 'medium', 'still'] as KenBurnsSpeed[]).map((spd) => (
            <button
              key={spd}
              className={`seg-btn ${
                (spd === 'still' && !config.motion) ||
                (config.motion && config.motionSpeed === spd)
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                spd === 'still'
                  ? updateConfig({ motion: false, motionSpeed: 'still' })
                  : updateConfig({ motion: true, motionSpeed: spd })
              }
            >
              {spd === 'slow' ? 'Doux' : spd === 'medium' ? 'Fluide' : 'Fixe'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
