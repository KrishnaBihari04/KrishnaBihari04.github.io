import { useEffect, useRef, useState } from 'react';

const ROLES = [
  'Full-Stack Developer',
  'AI Automation Engineer',
  'SaaS Builder',
  'Future AI Founder',
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  /* ── Cursor spotlight ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  /* ── Typewriter ── */
  useEffect(() => {
    const current = ROLES[roleIndex];
    if (isPaused) {
      const pause = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(pause);
    }
    if (!isDeleting) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }
    }
  }, [displayed, isDeleting, isPaused, roleIndex]);

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 6vw, 6rem)',
      }}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 600px 500px at ${spotlight.x}% ${spotlight.y}%, rgba(200,170,110,0.08) 0%, transparent 70%)`,
          transition: 'background 0.15s ease',
          zIndex: 1,
        }}
      />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '900px' }}>
        {/* Eyebrow */}
        <p
          data-reveal
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--sand)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--forest-bright)',
              boxShadow: '0 0 8px var(--forest-bright)',
            }}
          />
          Available for new projects
        </p>

        {/* Headline */}
        <h1
          data-reveal
          data-delay="100"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            color: 'var(--soft-white)',
            marginBottom: '1.25rem',
          }}
        >
          Krishna Bihari —{' '}
          <br />
          <span
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--sand-light)',
            }}
          >
            Engineering software
          </span>{' '}
          that creates value.
        </h1>

        {/* Typewriter role */}
        <div
          data-reveal
          data-delay="200"
          style={{
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
              color: 'var(--muted)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '-0.01em',
            }}
          >
            {displayed}
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1.1em',
                background: 'var(--sand-light)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }}
            />
          </span>
        </div>

        {/* Sub-description */}
        <p
          data-reveal
          data-delay="300"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginBottom: '3.5rem',
          }}
        >
          Full-stack developer and AI engineer from the Netherlands — building
          web applications, AI-powered automations, and SaaS products that solve
          real business problems.
        </p>

        {/* CTA buttons */}
        <div
          data-reveal
          data-delay="400"
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <a href="#projects" className="btn-primary">
            View my work
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" className="btn-secondary">
            Get in touch
          </a>
        </div>

        {/* Stats row */}
        <div
          data-reveal
          data-delay="500"
          style={{
            display: 'flex',
            gap: 'clamp(2rem, 5vw, 4rem)',
            marginTop: '5rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '3+', label: 'Years building software' },
            { value: '10+', label: 'Projects shipped' },
            { value: '5+', label: 'AI & tech stacks' },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  fontWeight: 500,
                  color: 'var(--soft-white)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.3rem',
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 3,
        }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, var(--border-mid), transparent)',
            animation: 'scrollPulse 2.5s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
}
