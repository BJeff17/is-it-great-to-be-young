import React, { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useDeck } from '../../context/DeckContext';

export const TabFineControl: React.FC = () => {
  const {
    slides,
    currentSlide,
    config,
    getEffectiveFine,
    updateFineControl,
    resetFineControl,
    exportConfigJson,
    importConfigJson,
  } = useDeck();

  const [scope, setScope] = useState<'global' | 'slide'>('slide');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeScope: 'global' | number = scope === 'global' ? 'global' : currentSlide;
  const fine =
    scope === 'global' ? config.globalFine : getEffectiveFine(currentSlide);
  const hasOverride = scope === 'slide' && Boolean(config.slideOverrides[currentSlide]);

  const handleExport = () => {
    const json = exportConfigJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youth-presentation-config.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Config exportée en JSON.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importConfigJson(String(reader.result ?? ''));
      setStatusMsg(ok ? 'Config importée avec succès.' : 'Fichier JSON invalide.');
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div>
        <div className="studio-section-title">Cible du Réglage Fin</div>
        <div className="btn-pair">
          <button
            className={`secondary-btn ${scope === 'global' ? 'active' : ''}`}
            onClick={() => setScope('global')}
          >
            Global (Toutes)
          </button>
          <button
            className={`secondary-btn ${scope === 'slide' ? 'active' : ''}`}
            onClick={() => setScope('slide')}
          >
            Slide {slides[currentSlide].numberLabel} {hasOverride ? '•' : ''}
          </button>
        </div>
      </div>

      <div>
        <div className="studio-section-title">Typographie & Contraste</div>
        <div className="slider-row">
          <span>Échelle texte ({Math.round(fine.textScale * 100)}%)</span>
          <input
            type="range"
            min="0.85"
            max="1.25"
            step="0.02"
            value={fine.textScale}
            onChange={(e) =>
              updateFineControl(activeScope, { textScale: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="slider-row">
          <span>Décalage vertical ({fine.offsetY.toFixed(1)}vh)</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.5"
            value={fine.offsetY}
            onChange={(e) =>
              updateFineControl(activeScope, { offsetY: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="slider-row">
          <span>Contraste voile ({Math.round(fine.scrimOpacity * 100)}%)</span>
          <input
            type="range"
            min="0.4"
            max="1.6"
            step="0.05"
            value={fine.scrimOpacity}
            onChange={(e) =>
              updateFineControl(activeScope, { scrimOpacity: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <div className="studio-section-title">Étalonnage Image</div>
        <div className="slider-row">
          <span>Luminosité ({Math.round(fine.brightness * 100)}%)</span>
          <input
            type="range"
            min="0.7"
            max="1.25"
            step="0.02"
            value={fine.brightness}
            onChange={(e) =>
              updateFineControl(activeScope, { brightness: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="slider-row">
          <span>Contraste ({Math.round(fine.contrast * 100)}%)</span>
          <input
            type="range"
            min="0.85"
            max="1.3"
            step="0.02"
            value={fine.contrast}
            onChange={(e) =>
              updateFineControl(activeScope, { contrast: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="slider-row">
          <span>Chaleur ({Math.round(fine.warmth * 100)}%)</span>
          <input
            type="range"
            min="0"
            max="0.25"
            step="0.01"
            value={fine.warmth}
            onChange={(e) =>
              updateFineControl(activeScope, { warmth: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <div className="studio-section-title">Sauvegarde & Réinitialisation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className="secondary-btn"
            onClick={() => {
              resetFineControl(activeScope);
              setStatusMsg(
                scope === 'global'
                  ? 'Réglages globaux réinitialisés.'
                  : `Surcharge Slide ${slides[currentSlide].numberLabel} réinitialisée.`
              );
            }}
          >
            <RotateCcw size={14} />
            <span>
              Réinitialiser ({scope === 'global' ? 'Global' : `Slide ${slides[currentSlide].numberLabel}`})
            </span>
          </button>

          <div className="btn-pair">
            <button className="secondary-btn" onClick={handleExport}>
              <Download size={14} />
              <span>Exporter JSON</span>
            </button>
            <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} />
              <span>Importer JSON</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          {statusMsg && (
            <div style={{ fontSize: '0.72rem', color: '#fde68a', fontFamily: 'var(--font-mono)' }}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
