import { useEffect, useState, useCallback } from 'react';

const navLinks = [
  { label: 'About',   href: '#about'    },
  { label: 'Work',    href: '#projects' },
  { label: 'Client',  href: '#client-portal'   },
  { label: 'Skills',  href: '#skills'   },
  { label: 'Contact', href: '#contact'  },
];

const NAV_H = 80;

export default function Navbar() {
  const [pastHero,      setPastHero]      = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const getHeroHeight = () => {
      const hero = document.getElementById('home');
      return hero ? hero.offsetHeight : window.innerHeight;
    };

    setPastHero(window.scrollY > getHeroHeight() * 0.6);

    const onScroll = () => {
      const h = getHeroHeight();
      setPastHero(window.scrollY > h * 0.6);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActiveSection('#' + e.target.id);
      }),
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) closeMenu(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [closeMenu]);

  const nameVisible = menuOpen;

  // FIX: omhoog van 20vh naar 12vh zodat naam ruim boven de lijn valt
 const nameTop = menuOpen ? '16vh' : '-3rem';

  const nameTransitionDelay = '0s';

  return (
    <>
      {/* ── Scroll progress line ── */}
      <div
        aria-hidden="true"
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          height:     '2px',
          width:      `${progress}%`,
          background: 'linear-gradient(90deg, var(--sand-dark), var(--sand-light))',
          zIndex:     1001,
          opacity:    pastHero ? 1 : 0,
          transition: 'width 0.08s linear, opacity 0.4s ease',
        }}
      />

      {/* ── Floating name ── */}
      {/* FIX: href altijd '#', onClick voorkomt navigatie als menu open is */}
      <a
        href="#"
        onClick={(e) => { if (menuOpen) e.preventDefault(); }}
        style={{
          position:       'fixed',
          zIndex:         200,
          left:           '50%',
          top:            nameTop,
          transform:      'translate(-50%, -50%)',
          fontFamily:     'AmsterdamFour, serif',
          // FIX: clamp zodat naam niet te groot wordt op smalle schermen
          fontSize:       menuOpen ? 'clamp(1.8rem, 8vw, 2.8rem)' : '1.75rem',
          color:          menuOpen ? 'var(--sand)' : 'var(--soft-white)',
          textDecoration: 'none',
          letterSpacing:  '0.02em',
          lineHeight:     1,
          whiteSpace:     'nowrap',
          cursor:         menuOpen ? 'default' : 'pointer',
          pointerEvents:  menuOpen ? 'none' : (pastHero ? 'none' : 'auto'),
          opacity:        nameVisible ? 1 : 0,
          textShadow:     menuOpen
            ? '0 0 40px rgba(212,183,141,0.25)'
            : '0 2px 12px rgba(0,0,0,0.5)',
          transition: [
            `top 0.62s cubic-bezier(0.4,0,0.2,1) ${nameTransitionDelay}`,
            `font-size 0.62s cubic-bezier(0.4,0,0.2,1) ${nameTransitionDelay}`,
            `color 0.45s ease ${nameTransitionDelay}`,
            `text-shadow 0.45s ease ${nameTransitionDelay}`,
            'opacity 0.5s cubic-bezier(0.16,1,0.3,1)',
          ].join(', '),
        }}
      >
        Krishna Bihari
      </a>

      {/* ── Desktop pill nav — appears after hero ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="pill-nav"
        style={{
          position:             'fixed',
          top:                  pastHero ? '1.5rem' : '-5rem',
          left:                 '50%',
          transform:            'translateX(-50%)',
          zIndex:               999,
          display:              'flex',
          alignItems:           'center',
          gap:                  '2px',
          padding:              '5px 6px',
          background:           'rgba(12,12,12,0.85)',
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border:               '1px solid rgba(255,255,255,0.07)',
          borderRadius:         '100px',
          boxShadow:            '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
          opacity:              pastHero ? 1 : 0,
          pointerEvents:        pastHero ? 'auto' : 'none',
          transition:           'top 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
          whiteSpace:           'nowrap',
        }}
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              style={{
                position:       'relative',
                padding:        '7px 16px',
                fontSize:       '0.78rem',
                fontWeight:     isActive ? 500 : 400,
                letterSpacing:  '0.03em',
                color:          isActive ? 'var(--soft-white)' : 'rgba(255,255,255,0.42)',
                textDecoration: 'none',
                borderRadius:   '100px',
                background:     isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                border:         isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                transition:     'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color      = 'rgba(255,255,255,0.75)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color      = 'rgba(255,255,255,0.42)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {link.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position:     'absolute',
                    bottom:       '5px',
                    left:         '50%',
                    transform:    'translateX(-50%)',
                    width:        '3px',
                    height:       '3px',
                    borderRadius: '50%',
                    background:   'var(--sand-light)',
                  }}
                />
              )}
            </a>
          );
        })}

        <div
          aria-hidden="true"
          style={{
            width:      '1px',
            height:     '16px',
            background: 'rgba(255,255,255,0.1)',
            margin:     '0 4px',
            flexShrink: 0,
          }}
        />

        <a
          href="#contact"
          style={{
            padding:        '7px 18px',
            fontSize:       '0.76rem',
            fontWeight:     500,
            letterSpacing:  '0.05em',
            color:          '#111',
            background:     'var(--sand-light)',
            textDecoration: 'none',
            borderRadius:   '100px',
            flexShrink:     0,
            transition:     'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity   = '0.8';
            e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity   = '1';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Let&apos;s talk
        </a>
      </nav>

      {/* ── Desktop nav bar (links left/right of name) — hidden after hero ── */}
      <div
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         100,
          height:         `${NAV_H}px`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 2.5rem',
          pointerEvents:  'none',
          opacity:        pastHero ? 0 : 1,
          transition:     'opacity 0.4s ease',
        }}
      >
        <div
          className="hidden md:flex"
          style={{ gap: '2.5rem', alignItems: 'center', pointerEvents: pastHero ? 'none' : 'auto' }}
        >
          {navLinks.slice(0, 2).map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize:       '0.75rem',
                  fontFamily:     'var(--font-body)',
                  fontWeight:     500,
                  letterSpacing:  '0.14em',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  color:          isActive ? 'var(--soft-white)' : 'var(--muted-light)',
                  paddingBottom:  '4px',
                  borderBottom:   isActive ? '1px solid var(--sand)' : '1px solid transparent',
                  transition:     'color 0.25s, border-color 0.25s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--soft-white)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--soft-white)' : 'var(--muted-light)')}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '1rem',
            pointerEvents: pastHero ? 'none' : 'auto',
          }}
        >
          <div className="hidden md:flex" style={{ gap: '2.5rem', alignItems: 'center', marginRight: '1.5rem' }}>
            {navLinks.slice(2).map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize:       '0.75rem',
                    fontFamily:     'var(--font-body)',
                    fontWeight:     500,
                    letterSpacing:  '0.14em',
                    textTransform:  'uppercase',
                    textDecoration: 'none',
                    color:          isActive ? 'var(--soft-white)' : 'var(--muted-light)',
                    paddingBottom:  '4px',
                    borderBottom:   isActive ? '1px solid var(--sand)' : '1px solid transparent',
                    transition:     'color 0.25s, border-color 0.25s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--soft-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--soft-white)' : 'var(--muted-light)')}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <a
            href="#contact"
            className="hidden md:inline-flex"
            style={{
              fontSize:       '0.72rem',
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              fontFamily:     'var(--font-body)',
              fontWeight:     500,
              color:          'var(--forest-green)',
              border:         '1px solid var(--forest-green)',
              borderRadius:   '2px',
              padding:        '8px 20px',
              textDecoration: 'none',
              transition:     'background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--forest-green)';
              el.style.color      = '#fff';
              el.style.boxShadow  = '0 4px 20px rgba(74,111,80,0.35)';
              el.style.transform  = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'transparent';
              el.style.color      = 'var(--forest-green)';
              el.style.boxShadow  = 'none';
              el.style.transform  = 'translateY(0)';
            }}
          >
            Let&apos;s talk
          </a>
        </div>
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden"
        style={{
          position:       'fixed',
          top:            `${NAV_H / 2 - 20}px`,
          right:          '1.25rem',
          zIndex:         201,
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          width:          '40px',
          height:         '40px',
          padding:        0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ position: 'relative', display: 'block', width: '20px', height: '12px' }}>
          {/* Top bar */}
          <span style={{
            display:         'block',
            position:        'absolute',
            left:            0,
            width:           '20px',
            height:          '1.5px',
            background:      'var(--soft-white)',
            borderRadius:    '2px',
            transformOrigin: '50% 50%',
            top:             menuOpen ? '5px' : '0px',
            transform:       menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition:      'top 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }} />
          {/* Middle bar */}
          <span style={{
            display:      'block',
            position:     'absolute',
            left:         0,
            height:       '1.5px',
            background:   'var(--soft-white)',
            borderRadius: '2px',
            top:          '5px',
            width:        menuOpen ? '0px' : '13px',
            opacity:      menuOpen ? 0 : 1,
            transition:   menuOpen
              ? 'width 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease'
              : 'width 0.22s cubic-bezier(0.4,0,0.2,1) 0.2s, opacity 0.2s ease 0.2s',
          }} />
          {/* Bottom bar */}
          <span style={{
            display:         'block',
            position:        'absolute',
            left:            0,
            width:           '20px',
            height:          '1.5px',
            background:      'var(--soft-white)',
            borderRadius:    '2px',
            transformOrigin: '50% 50%',
            top:             menuOpen ? '5px' : '10px',
            transform:       menuOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition:      'top 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </span>
      </button>

      {/* ── Mobile full-screen overlay ── */}
      <div
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         99,
          background:     'rgba(8,8,8,0.97)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          // FIX: meer paddingTop zodat content ruimte heeft onder de naam op 12vh
          paddingTop:     '10rem',
          opacity:        menuOpen ? 1 : 0,
          pointerEvents:  menuOpen ? 'auto' : 'none',
          transition:     'opacity 0.4s ease',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width:        '40px',
            height:       '1px',
            background:   'rgba(212,183,141,0.3)',
            marginBottom: '2.5rem',
            opacity:      menuOpen ? 1 : 0,
            transition:   'opacity 0.5s ease 0.2s',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.2rem', marginBottom: '3.5rem' }}>
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{
                fontSize:       '1.75rem',
                fontFamily:     'var(--font-display)',
                fontStyle:      'italic',
                color:          activeSection === link.href ? 'var(--sand)' : 'var(--soft-white)',
                textDecoration: 'none',
                opacity:        menuOpen ? 1 : 0,
                transform:      menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: [
                  `opacity 0.45s ease ${0.09 * i + 0.22}s`,
                  `transform 0.45s cubic-bezier(0.4,0,0.2,1) ${0.09 * i + 0.22}s`,
                  'color 0.2s',
                  'text-shadow 0.2s',
                ].join(', '),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color      = 'var(--sand)';
                e.currentTarget.style.textShadow = '0 0 30px rgba(212,183,141,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color      = activeSection === link.href ? 'var(--sand)' : 'var(--soft-white)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          onClick={closeMenu}
          style={{
            fontSize:       '0.78rem',
            letterSpacing:  '0.14em',
            textTransform:  'uppercase',
            fontFamily:     'var(--font-body)',
            fontWeight:     500,
            color:          'var(--forest-green)',
            border:         '1px solid var(--forest-green)',
            borderRadius:   '2px',
            padding:        '11px 32px',
            textDecoration: 'none',
            marginBottom:   '2.5rem',
            opacity:        menuOpen ? 1 : 0,
            transform:      menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition:     'opacity 0.45s ease 0.55s, transform 0.45s ease 0.55s, background 0.25s, box-shadow 0.25s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'var(--forest-green)';
            el.style.color      = '#fff';
            el.style.boxShadow  = '0 4px 24px rgba(74,111,80,0.4)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'transparent';
            el.style.color      = 'var(--forest-green)';
            el.style.boxShadow  = 'none';
          }}
        >
          Let&apos;s talk
        </a>

        <div
          style={{
            display:    'flex',
            gap:        '2.5rem',
            opacity:    menuOpen ? 1 : 0,
            transform:  menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.45s ease 0.63s, transform 0.45s ease 0.63s',
          }}
        >
          {[
            { label: 'GitHub',   href: 'https://github.com/kasbihari'          },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/krishna-bihari' },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize:       '0.72rem',
                letterSpacing:  '0.12em',
                textTransform:  'uppercase',
                fontFamily:     'var(--font-body)',
                color:          'var(--muted-light)',
                textDecoration: 'none',
                transition:     'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sand)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-light)')}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .pill-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}