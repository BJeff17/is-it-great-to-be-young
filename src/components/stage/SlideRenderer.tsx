import React from 'react';
import { useDeck } from '../../context/DeckContext';
import { EmberCanvas } from './EmberCanvas';

export const SlideRenderer: React.FC = () => {
  const { slides, currentSlide, currentBeat, isInstantMode, getEffectiveFine } = useDeck();

  const renderSlideBody = (id: number, isActive: boolean, beat: number) => {
    const rev = (n: number) => (isActive && beat >= n ? 'revealed' : '');
    switch (id) {
      case 0:
        return (
          <>
            <div className="s1-bg" />
            <div className={`s1-ambient-glow ${isActive && beat >= 1 ? 'lit' : ''}`} />
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <div className="slide-content s1-center">
              <div className="eyebrow s1-eyebrow">What everyone tells you</div>
              <div className="s1-quote-wrap">
                <h1 className={`s1-quote ${isActive && beat >= 1 ? 'crossed' : ''}`}>
                  “The <em>best years</em>
                  <br />
                  of your life.”
                </h1>
                <svg
                  className={`s1-slash ${isActive && beat >= 1 ? 'drawn' : ''}`}
                  viewBox="0 0 900 110"
                  preserveAspectRatio="none"
                >
                  <path d="M 18 92 Q 380 56, 882 18" />
                </svg>
              </div>
              <div className={`beat s1-response ${rev(1)}`}>
                <div className="s1-really">Really?</div>
                <div className="s1-rule" />
                <div className="s1-sub">Two sides of the same coin</div>
              </div>
              <div
                className="zine-stamp zine-only meme-ref"
                style={{ '--rot': '5deg', bottom: '11vh', right: '8vw', color: '#fb7185' } as React.CSSProperties}
              >
                ADULT PROPAGANDA™
              </div>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[1].image} alt={slides[1].imageAlt} />
            <div className="vignette s2-vignette" />
            <div className="slide-content s2-layout">
              <div className={`beat ${rev(1)}`}>
                <div className="s2-dot-row">
                  <span className="s2-dot" />
                  <span className="s2-tag">Middle school</span>
                </div>
                <h2 className="s2-title">Out of sync.</h2>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[2].image} alt={slides[2].imageAlt} />
            <div className="vignette s3-vignette" />
            <div className="slide-content s3-layout">
              <div className={`beat s3-hairline-block ${rev(1)}`}>
                <h2 className="s3-title">No armor yet.</h2>
                <p className="s3-whisper">When a tiny world feels like the whole universe.</p>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[3].image} alt={slides[3].imageAlt} />
            <div className="vignette s4-vignette" />
            <div className="slide-content s4-layout">
              <div className="s4-inner">
                <div className="s4-os-whisper">
                  <span className="s4-os-dot" />
                  <span>childhood.exe</span>
                </div>
                <h2 className="s4-title">Too early.</h2>

                <div className={`beat ${rev(1)}`}>
                  <div className="s4-loader">
                    <div className="s4-loader-meta">
                      <span>CAREFREE YEARS</span>
                      <span className="err">38% · INTERRUPTED</span>
                    </div>
                    <div className="s4-bar-track">
                      <div className="s4-bar-fill" />
                    </div>
                  </div>
                </div>

                <div className={`beat s4-whispers meme-ref ${rev(2)}`}>
                  <div className="s4-line">
                    <span className="time">07:02</span>
                    <span>Global crisis before breakfast</span>
                  </div>
                  <div className="s4-line">
                    <span className="time">07:03</span>
                    <span>Job &amp; degree just to stay afloat</span>
                  </div>
                  <div className="s4-line meme-line">
                    <span className="time">07:04</span>
                    <span>“This is fine.”</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[4].image} alt={slides[4].imageAlt} />
            <div className="vignette s5-vignette" />
            <div className="slide-content s5-layout">
              <div className={`beat s5-ledger ${rev(1)}`}>
                <div className="eyebrow s5-eyebrow">The generational invoice</div>
                <h2 className="s5-title">The bill.</h2>
                <div className="s5-row">
                  <span>Climate</span>
                  <span className="dim">Past due</span>
                </div>
                <div className="s5-row">
                  <span>Economy</span>
                  <span className="dim">Unpaid</span>
                </div>
                <div className="s5-row">
                  <span>Systems</span>
                  <span className="dim">Carried over</span>
                </div>
                <div className={`beat ${rev(2)}`}>
                  <div className="s5-total">
                    <span className="label">TOTAL DUE</span>
                    <span className="val">FIX IT.</span>
                  </div>
                  <span className="s5-note meme-ref">we didn't even order.</span>
                </div>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="s6-bg" />
            <EmberCanvas
              active={isActive}
              expanded={isActive && beat >= 1}
              instantMode={isInstantMode}
            />
            <div className="slide-content s6-center">
              <div className="spark-stage">
                <div className={`spark-halo ${isActive && beat >= 1 ? 'expanded' : ''}`} />
                <div className="spark-core" />
              </div>
              <div className={`beat ${rev(1)}`}>
                <div className="s6-whisper">Unwritten pages.</div>
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[6].image} alt={slides[6].imageAlt} />
            <div className="vignette s7-vignette" />
            <div className="slide-content s7-layout">
              <div className="s7-failure-wrap">
                <div className={`s7-failure ${isActive && beat >= 1 ? 'struck' : ''}`}>FAILURE</div>
                <div className={`s7-gold-line ${isActive && beat >= 1 ? 'drawn' : ''}`} />
              </div>
              <div className={`beat ${rev(1)}`}>
                <h2 className="s7-plot">
                  Plot
                  <br />
                  <span>Development.</span>
                </h2>
                <div className="s7-hand meme-ref">it's called learning.</div>
              </div>
              <div
                className="zine-stamp zine-only meme-ref"
                style={{ '--rot': '-4deg', bottom: '11vh', left: '7.5vw', color: '#7c2d12' } as React.CSSProperties}
              >
                CHARACTER ARC 10/10
              </div>
            </div>
          </>
        );

      case 7:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[7].image} alt={slides[7].imageAlt} />
            <div className="vignette s8-vignette" />
            <div className="slide-content s8-layout">
              <div className={`beat pillar-editorial ${rev(1)}`}>
                <div className="pillar-num">01</div>
                <div className="pillar-rule" />
                <h2 className="pillar-title">What to love.</h2>
                <p className="pillar-whisper">Passions, curiosity, what makes you feel alive.</p>
              </div>
            </div>
          </>
        );

      case 8:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[8].image} alt={slides[8].imageAlt} />
            <div className="vignette s9-vignette" />
            <div className="slide-content s9-layout">
              <div className={`beat pillar-editorial ${rev(1)}`}>
                <div className="pillar-num">02</div>
                <div className="pillar-rule" />
                <h2 className="pillar-title">How to love.</h2>
                <p className="pillar-whisper">Finding your people — and caring deeply.</p>
              </div>
            </div>
          </>
        );

      case 9:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[9].image} alt={slides[9].imageAlt} />
            <div className="vignette s10-vignette" />
            <div className="slide-content s10-layout">
              <div className={`beat pillar-editorial ${rev(1)}`}>
                <div className="pillar-num">03</div>
                <div className="pillar-rule" />
                <h2 className="pillar-title">Zero regrets.</h2>
                <p className="pillar-whisper">Living a life you’ll be proud to look back on.</p>
              </div>
            </div>
          </>
        );

      case 10:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[10].image} alt={slides[10].imageAlt} />
            <div className="vignette s11-vignette" />
            <div className="slide-content s11-layout">
              <div className="s11-inner">
                <h2 className="s11-enjoy">Long enough to enjoy.</h2>
                <div className={`beat ${rev(1)}`}>
                  <div className="s11-rule" />
                  <h2 className="s11-regret">Short enough to regret.</h2>
                </div>
              </div>
            </div>
          </>
        );

      case 11:
      default:
        return (
          <>
            <div className="zine-tape tl" />
            <div className="zine-tape br" />
            <img className="slide-bg-img" src={slides[11].image} alt={slides[11].imageAlt} />
            <div className="vignette s12-vignette" />
            <div className="slide-content s12-layout">
              <div className="s12-inner">
                <div className="eyebrow s12-eyebrow">Your youth list</div>
                <div className="s12-list">
                  <div className="s12-step">Take a break.</div>
                  <div className="s12-step">Write the list.</div>
                  <div className="s12-step">Live through it.</div>
                </div>
                <div className={`beat s12-final ${rev(1)}`}>…and just be happy.</div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="slides-container">
      {slides.map((s) => {
        const isActive = s.id === currentSlide;
        const fine = getEffectiveFine(s.id);
        const frameStyle = {
          '--slide-text-scale': fine.textScale,
          '--slide-scrim-mul': fine.scrimOpacity,
          '--slide-img-brightness': fine.brightness,
          '--slide-img-contrast': fine.contrast,
          '--slide-img-warmth': Math.max(0, fine.warmth),
          '--slide-offset-y': `${fine.offsetY}vh`,
        } as React.CSSProperties;

        return (
          <section key={s.id} className={`slide ${isActive ? 'active' : ''}`}>
            <div className="slide-frame" style={frameStyle}>
              {renderSlideBody(s.id, isActive, currentBeat)}
            </div>
          </section>
        );
      })}
    </div>
  );
};
