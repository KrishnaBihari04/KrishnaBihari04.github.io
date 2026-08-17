import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Story chapters — cinematic, first-person narrative ───────────────────────
const chapters = [
  {
    id: 'origin',
    label: 'Origin',
    lines: [
      "I grew up obsessed with video games and anime.",
      "Not just consuming them — dissecting them.",
      "Asking: how does this work? Who built this? How?",
      "That question never left me.",
    ],
  },
  {
    id: 'spark',
    label: 'The Spark',
    lines: [
      "My first line of code changed everything.",
      "I could build things people actually used.",
      "Real apps. Real products. Real impact.",
      "I was seventeen and I already knew this was my path.",
    ],
  },
  {
    id: 'craft',
    label: 'The Craft',
    lines: [
      "I didn't learn by watching tutorials.",
      "I learned by shipping. Breaking. Fixing. Shipping again.",
      "Full-stack to AI pipelines — I care about the whole system.",
      "Not just writing code, but engineering solutions.",
    ],
  },
  {
    id: 'now',
    label: 'Now',
    lines: [
      "I build web apps, AI automations, and SaaS products.",
      "Freelancing. Studying. Always building something new.",
      "Chess taught me strategy. Martial arts taught me discipline.",
      "I bring both to every problem I solve.",
    ],
  },
];

const timelineItems = [
  {
    year: '2024 — now',
    title: 'Full-Stack & AI Developer',
    place: 'Freelance / Independent',
    description:
      'Building client products, AI-powered automation systems, and internal tools. Working with Twilio, ElevenLabs, OpenAI APIs, and modern full-stack frameworks.',
  },
  {
    year: '2023 — now',
    title: 'Software Development Student',
    place: 'ROC Mondriaan · The Hague, NL',
    description:
      'Studying software development with a focus on full-stack engineering, databases, and software architecture. Planning to continue with Applied Data Science & AI at The Hague University.',
  },
  {
    year: '2022',
    title: 'First Production Projects',
    place: 'Self-directed',
    description:
      'Shipped real-world applications independently. Learned by building, iterating, and deploying — not by watching. Developed a strong foundation across the full stack.',
  },
];

const CHAR_SPEED = 28;   // ms per character
const LINE_PAUSE = 600;  // pause after each line completes
const CHAPTER_PAUSE = 1200;

export default function About() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef    = useRef(false);

  // Which chapter we're on
  const [chapterIdx,  setChapterIdx]  = useState(0);
  // Lines fully revealed so far (in current chapter)
  const [revealedLines, setRevealedLines] = useState<number>(0);
  // Characters revealed in the currently-typing line
  const [charCount,   setCharCount]   = useState(0);
  // Whether the whole story is done
  const [done,        setDone]        = useState(false);
  // Whether animation has started
  const [started,     setStarted]     = useState(false);

  const chapter = chapters[chapterIdx];

  // ── Core typewriter engine ────────────────────────────────────────────────
  const typeChar = useCallback((
    cIdx: number,
    lIdx: number,
    chars: number,
  ) => {
    const ch    = chapters[cIdx];
    const line  = ch.lines[lIdx];

    if (chars < line.length) {
      setCharCount(chars + 1);
      timerRef.current = setTimeout(() => typeChar(cIdx, lIdx, chars + 1), CHAR_SPEED);
    } else {
      // Line done
      const nextLine = lIdx + 1;
      if (nextLine < ch.lines.length) {
        timerRef.current = setTimeout(() => {
          setRevealedLines(nextLine);
          setCharCount(0);
          typeChar(cIdx, nextLine, 0);
        }, LINE_PAUSE);
      } else {
        // Chapter done
        const nextChapter = cIdx + 1;
        if (nextChapter < chapters.length) {
          timerRef.current = setTimeout(() => {
            setChapterIdx(nextChapter);
            setRevealedLines(0);
            setCharCount(0);
            typeChar(nextChapter, 0, 0);
          }, CHAPTER_PAUSE);
        } else {
          // Story complete
          timerRef.current = setTimeout(() => setDone(true), LINE_PAUSE);
        }
      }
    }
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setChapterIdx(0);
    setRevealedLines(0);
    setCharCount(0);
    setDone(false);
    setStarted(true);
    typeChar(0, 0, 0);
  }, [typeChar]);

  // Auto-start on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          timerRef.current = setTimeout(start, 500);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start]);

  // ── Reveal animation for lower sections ──────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const totalLines = chapters.reduce((s, c) => s + c.lines.length, 0);
  const completedLines = chapters
    .slice(0, chapterIdx)
    .reduce((s, c) => s + c.lines.length, 0) + revealedLines;
  const progressPct = done ? 100 : Math.round((completedLines / totalLines) * 100);

  return (
    <section id="about">

      {/* ══════════════════════════════════════════════════════════
          CINEMATIC TYPEWRITER SCREEN
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={sectionRef}
        style={{
          minHeight:  '100svh',
          display:    'flex',
          alignItems: 'center',
          position:   'relative',
          overflow:   'hidden',
        }}
      >

        {/* Ambient glow left */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '30%', left: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(45,74,62,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div
          className="container-main"
          style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '6rem' }}
        >

          {/* Section label */}
          <p style={{
            fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--sand)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '4rem',
          }}>
            <span style={{ width: '1.5rem', height: '1px', background: 'var(--sand)', opacity: 0.5, display: 'inline-block' }} />
            About
          </p>

          {/* Chapter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            {chapters.map((ch, i) => {
              const isPast    = i < chapterIdx;
              const isCurrent = i === chapterIdx && started;
              return (
                <span
                  key={ch.id}
                  style={{
                    fontSize:      '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding:       '4px 12px',
                    borderRadius:  '100px',
                    border:        isCurrent
                      ? '1px solid rgba(200,184,154,0.5)'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: isCurrent
                      ? 'var(--sand)'
                      : isPast
                      ? 'rgba(200,184,154,0.35)'
                      : 'var(--muted)',
                    background: isCurrent ? 'rgba(200,184,154,0.06)' : 'transparent',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {ch.label}
                </span>
              );
            })}
          </div>

          {/* Story text */}
          <div style={{ maxWidth: '680px' }}>
            {!started && (
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                color: 'var(--muted)',
                fontStyle: 'italic',
              }}>
                Scroll to begin.
              </p>
            )}

            {chapters.map((ch, cIdx) => {
              if (cIdx > chapterIdx) return null;
              const isCurrentChapter = cIdx === chapterIdx;

              return (
                <div key={ch.id} style={{ marginBottom: isCurrentChapter ? 0 : '2.5rem' }}>
                  {ch.lines.map((line, lIdx) => {
                    const isPastLine    = cIdx < chapterIdx || lIdx < revealedLines;
                    const isTypingLine  = isCurrentChapter && lIdx === revealedLines;
                    const isFutureLine  = !isPastLine && !isTypingLine;

                    if (isFutureLine) return null;

                    const displayText = isTypingLine
                      ? line.slice(0, charCount)
                      : line;

                    return (
                      <p
                        key={lIdx}
                        style={{
                          fontSize:      'clamp(1.15rem, 2.4vw, 1.65rem)',
                          fontWeight:    400,
                          lineHeight:    1.5,
                          letterSpacing: '-0.01em',
                          marginBottom:  '0.5rem',
                          color: isPastLine
                            ? 'rgba(240,236,228,0.2)'
                            : 'var(--soft-white)',
                          transition: 'color 0.5s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        {/* Active bar */}
                        {isTypingLine && (
                          <span aria-hidden="true" style={{
                            display:     'inline-block',
                            flexShrink:  0,
                            width:       '3px',
                            height:      '1em',
                            borderRadius:'2px',
                            background:  'var(--sand)',
                          }} />
                        )}
                        {displayText}
                        {/* Blinking cursor */}
                        {isTypingLine && (
                          <span
                            aria-hidden="true"
                            style={{
                              display:    'inline-block',
                              width:      '2px',
                              height:     '1.1em',
                              background: 'var(--sand-light)',
                              borderRadius: '1px',
                              animation:  'blink 0.9s step-end infinite',
                              verticalAlign: 'middle',
                              marginLeft: '1px',
                            }}
                          />
                        )}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Progress + controls */}
          <div style={{
            marginTop:  '3rem',
            display:    'flex',
            alignItems: 'center',
            gap:        '1.25rem',
          }}>
            {/* Track */}
            <div style={{
              width:      '160px',
              height:     '1px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '2px',
              overflow:   'hidden',
            }}>
              <div style={{
                height:     '100%',
                width:      `${progressPct}%`,
                background: 'linear-gradient(90deg, var(--sand-dark), var(--sand-light))',
                transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>

            <span style={{
              fontSize:      '0.68rem',
              letterSpacing: '0.08em',
              color:         'var(--muted)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {progressPct}%
            </span>

            {done && (
              <button
                onClick={start}
                aria-label="Replay story"
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '0.4rem',
                  fontSize:   '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:      'var(--muted-light)',
                  background: 'none',
                  border:     '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  cursor:     'pointer',
                  padding:    '5px 14px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color       = 'var(--sand)';
                  e.currentTarget.style.borderColor = 'rgba(200,184,154,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color       = 'var(--muted-light)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8a6 6 0 1 0 1.5-3.9L2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 3v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Replay
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ══════════════════════════════════════════════════════════
          DETAILS: TRAITS + TIMELINE
      ══════════════════════════════════════════════════════════ */}
      <div className="section-padding">
        <div className="container-main">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '5rem',
          }}>

            {/* LEFT — who I am ─────────────────────────────────── */}
            <div>
              <p
                data-reveal
                style={{
                  fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--sand)',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  marginBottom: '2rem',
                }}
              >
                <span style={{ width: '1.5rem', height: '1px', background: 'var(--sand)', opacity: 0.5, display: 'inline-block' }} />
                How I work
              </p>

              <p data-reveal data-delay="100" style={{
                color: 'var(--muted-light)', lineHeight: 1.8, marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}>
                I build complete systems — from backend architecture and AI integrations
                to the interfaces people actually use. I care about outcomes, not just
                clean code. Every project I take on has a clear business goal behind it.
              </p>

              <p data-reveal data-delay="150" style={{
                color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.9rem',
              }}>
                Currently building AI automation products and taking on freelance projects.
                Open to long-term collaborations with founders and businesses who want to
                move fast and build things that last.
              </p>

              {/* Traits */}
              <div data-reveal data-delay="200" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Strategy',   sub: 'Chess · Systems thinking · Long-term architecture' },
                  { label: 'Discipline', sub: 'Martial arts · Consistent output · No shortcuts' },
                  { label: 'Craft',      sub: 'Detail-first · Clean systems · Purposeful design' },
                  { label: 'Momentum',   sub: 'Ship fast · Learn faster · Iterate always' },
                ].map((t, i) => (
                  <div
                    key={t.label}
                    style={{
                      display:     'flex',
                      gap:         '1.25rem',
                      alignItems:  'flex-start',
                      padding:     '1.1rem 0',
                      borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <span style={{
                      fontSize:      '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color:         'var(--sand)',
                      minWidth:      '72px',
                      paddingTop:    '2px',
                    }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {t.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — timeline ─────────────────────────────────── */}
            <div>
              <p
                data-reveal
                style={{
                  fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--sand)',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  marginBottom: '2rem',
                }}
              >
                <span style={{ width: '1.5rem', height: '1px', background: 'var(--sand)', opacity: 0.5, display: 'inline-block' }} />
                Timeline
              </p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {timelineItems.map((item, i) => (
                  <div
                    key={item.year}
                    data-reveal
                    data-delay={`${i * 100}`}
                    style={{
                      display:     'grid',
                      gridTemplateColumns: '6.5rem 1fr',
                      gap:         '1.25rem',
                      paddingBottom: '2rem',
                      paddingLeft:   '1rem',
                      borderLeft:   '1px solid rgba(255,255,255,0.06)',
                      position:    'relative',
                    }}
                  >
                    {/* Dot */}
                    <span style={{
                      position:    'absolute',
                      left:        '-4px',
                      top:         '0.3rem',
                      width:       '7px',
                      height:      '7px',
                      borderRadius:'50%',
                      background:  'var(--charcoal-3)',
                      border:      '1px solid rgba(255,255,255,0.15)',
                    }} />

                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)', paddingTop: '0.1rem' }}>
                      {item.year}
                    </span>

                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--soft-white)', marginBottom: '0.15rem' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--sand)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                        {item.place}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Passions strip */}
              <div data-reveal data-delay="300" style={{ marginTop: '1rem' }}>
                <p style={{
                  fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--sand)',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  marginBottom: '1.25rem',
                }}>
                  <span style={{ width: '1.5rem', height: '1px', background: 'var(--sand)', opacity: 0.5, display: 'inline-block' }} />
                  Off-screen
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    'Chess · 1250 Elo',
                    'Taekwondo · Kickboxing · Muay Thai',
                    'Basketball',
                    'Anime',
                    'Automotive design',
                  ].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize:    '0.72rem',
                        letterSpacing: '0.04em',
                        color:       'var(--muted-light)',
                        border:      '1px solid rgba(255,255,255,0.07)',
                        borderRadius:'100px',
                        padding:     '4px 12px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Blink keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
