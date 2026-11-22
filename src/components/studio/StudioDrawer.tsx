import React from 'react';
import { Palette, Sliders, Music, Smartphone, X } from 'lucide-react';
import { useDeck } from '../../context/DeckContext';
import type { StudioTab } from '../../types/presentation';
import { TabAudio } from './TabAudio';
import { TabDirection } from './TabDirection';
import { TabFineControl } from './TabFineControl';
import { TabRemote } from './TabRemote';

const TABS: Array<{ id: StudioTab; label: string; Icon: React.FC<{ size?: number }> }> = [
  { id: 'direction', label: 'DA', Icon: Palette },
  { id: 'fine', label: 'Fin', Icon: Sliders },
  { id: 'audio', label: 'Piano', Icon: Music },
  { id: 'remote', label: 'Mobile', Icon: Smartphone },
];

export const StudioDrawer: React.FC = () => {
  const {
    slides,
    currentSlide,
    studioOpen,
    studioTab,
    setStudioOpen,
    setStudioTab,
    goToSlide,
    startImmersivePresentation,
  } = useDeck();

  return (
    <aside className={`studio-drawer ${studioOpen ? 'open' : ''}`}>
      <div className="studio-header">
        <h2>Studio Pro · 12 Slides</h2>
        <button className="close-btn" onClick={() => setStudioOpen(false)} aria-label="Fermer">
          <X size={15} />
        </button>
      </div>

      <div className="studio-tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`studio-tab ${studioTab === id ? 'active' : ''}`}
            onClick={() => setStudioTab(id)}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="studio-body">
        {studioTab === 'direction' && <TabDirection />}
        {studioTab === 'fine' && <TabFineControl />}
        {studioTab === 'audio' && <TabAudio />}
        {studioTab === 'remote' && <TabRemote />}
      </div>

      <div className="studio-footer">
        <div className="slide-jump-grid">
          {slides.map((s) => (
            <button
              key={s.id}
              className={`jump-btn ${s.id === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(s.id, 0)}
            >
              {s.numberLabel}
            </button>
          ))}
        </div>
        <button className="primary-btn" onClick={startImmersivePresentation}>
          Lancer la Vraie Présentation (P)
        </button>
      </div>
    </aside>
  );
};
