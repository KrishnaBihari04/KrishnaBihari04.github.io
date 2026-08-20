import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Play, Pause } from "lucide-react";

const ROLES = [
  "Full-Stack Developer",
  "AI Automation Engineer",
  "SaaS Builder",
  "Future AI Founder",
];

const TARGET_SPIN_SPEED = 120;
const INERTIA_FRICTION_PER_SEC = 0.1;
const FLICK_THRESHOLD = 70;
const STOP_EPSILON = 3;
const SPIN_UP_TAU = 0.8;
const PAUSE_DECAY_TAU = 0.45;

const ARM_ANGLE_REST = -24;
const ARM_ANGLE_OUTER_GROOVE = 4;
const ARM_ANGLE_INNER_GROOVE = 21;

const TRACK_SRC = "/audio/act ii date @ 8 (feat. Drake) [remix].mp3";
const ALBUM_ART_SRC = "/images/act ii date @ 8 (feat. Drake) [remix].jpg";

type PlayerMode = "paused" | "dragging" | "inertia" | "spinning";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

function createCrackleBuffer(
  ctx: AudioContext,
  durationSeconds: number,
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.015;
  }

  let i = 0;

  while (i < length) {
    if (Math.random() < 0.0009) {
      const popLength = 15 + Math.floor(Math.random() * 35);
      const amp = Math.random() * 0.55;

      for (
        let j = 0;
        j < popLength && i + j < length;
        j++
      ) {
        data[i + j] +=
          (Math.random() * 2 - 1) *
          amp *
          (1 - j / popLength);
      }

      i += popLength;
    } else {
      i++;
    }
  }

  return buffer;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vinylContainerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [needleDown, setNeedleDown] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const rotate = useMotionValue<number>(0);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const modeRef = useRef<PlayerMode>("paused");
  const isPlayingRef = useRef(false);
  const wasAudibleRef = useRef(false);
  const lastPointerAngleRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const smoothedGlowRef = useRef(0);
  const crackleGainRef = useRef<GainNode | null>(null);

  /* ---------------------------------------------------------------
     Audio element
  ---------------------------------------------------------------- */

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);

    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setTrackProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();

      void audioCtxRef.current?.close().catch(() => undefined);

      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    setNeedleDown(isPlaying && !isDragging);
  }, [isPlaying, isDragging]);

  /* ---------------------------------------------------------------
     Audio graph
  ---------------------------------------------------------------- */

  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        void audioCtxRef.current.resume();
      }

      return;
    }

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 14000;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;

    const gain = ctx.createGain();
    gain.gain.value = 1;

    source.connect(filter);
    filter.connect(analyser);
    analyser.connect(gain);
    gain.connect(ctx.destination);

    const crackleBuffer = createCrackleBuffer(ctx, 6);

    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = "bandpass";
    crackleFilter.frequency.value = 3200;
    crackleFilter.Q.value = 0.6;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0;

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(ctx.destination);

    crackleSource.start(0);

    audioCtxRef.current = ctx;
    filterNodeRef.current = filter;
    analyserRef.current = analyser;
    freqDataRef.current = new Uint8Array(
      new ArrayBuffer(analyser.frequencyBinCount),
    );
    gainNodeRef.current = gain;
    crackleGainRef.current = crackleGain;
  }, []);

  /* ---------------------------------------------------------------
     Physics / animation loop
  ---------------------------------------------------------------- */

  useEffect(() => {
    const setEnvelope = (speedRatio: number, targetGain: number) => {
      const gain = gainNodeRef.current;
      const filter = filterNodeRef.current;
      const crackle = crackleGainRef.current;

      if (!gain || !filter) {
        return;
      }

      const currentTime = audioCtxRef.current?.currentTime ?? 0;

      const detuneDrop = clamp(
        1 - Math.abs(speedRatio - 1) * 0.12,
        0.5,
        1,
      );

      const nextGain = clamp(targetGain * detuneDrop, 0, 1);

      gain.gain.setTargetAtTime(
        nextGain,
        currentTime,
        0.03,
      );

      filter.frequency.setTargetAtTime(
        lerp(1400, 15000, clamp(speedRatio, 0, 1)),
        currentTime,
        0.03,
      );

      if (crackle) {
        crackle.gain.setTargetAtTime(
          0.045 * clamp(speedRatio, 0, 1),
          currentTime,
          0.08,
        );
      }
    };

    const updateReactiveGlow = (mode: PlayerMode) => {
      const glow = glowRef.current;

      if (!glow) {
        return;
      }

      const analyser = analyserRef.current;
      const freqData = freqDataRef.current;

      let level = 0;

      if (analyser && freqData && mode !== "paused") {
        analyser.getByteFrequencyData(freqData);

        const bandEnd = Math.min(24, freqData.length);

        if (bandEnd > 0) {
          let sum = 0;

          for (let i = 0; i < bandEnd; i++) {
            sum += freqData[i];
          }

          level = sum / bandEnd / 255;
        }
      }

      const smoothing = reducedMotionRef.current ? 0.08 : 0.22;

      smoothedGlowRef.current = lerp(
        smoothedGlowRef.current,
        level,
        smoothing,
      );

      const base = 0.22;
      const amount = reducedMotionRef.current ? 0.25 : 0.65;

      const intensity =
        base + smoothedGlowRef.current * amount;

      const blur =
        46 +
        smoothedGlowRef.current *
          (reducedMotionRef.current ? 12 : 34);

      glow.style.opacity = intensity.toFixed(3);
      glow.style.filter = `blur(${blur.toFixed(1)}px)`;
    };

    const tick = (now: number) => {
      const last = lastFrameTimeRef.current ?? now;

      const dt = clamp((now - last) / 1000, 0, 0.05);

      lastFrameTimeRef.current = now;

      const mode = modeRef.current;
      const audio = audioRef.current;

      if (mode === "spinning") {
        velocityRef.current = lerp(
          velocityRef.current,
          TARGET_SPIN_SPEED,
          1 - Math.exp(-dt / SPIN_UP_TAU),
        );

        rotationRef.current += velocityRef.current * dt;

        if (audio && wasAudibleRef.current) {
          const ratio = clamp(
            velocityRef.current / TARGET_SPIN_SPEED,
            0.05,
            1,
          );

          audio.playbackRate = ratio;
          setEnvelope(ratio, 1);
        }
      } else if (mode === "inertia") {
        velocityRef.current *= Math.pow(
          INERTIA_FRICTION_PER_SEC,
          dt,
        );

        rotationRef.current += velocityRef.current * dt;

        if (audio && wasAudibleRef.current) {
          const ratio = clamp(
            Math.abs(velocityRef.current) /
              TARGET_SPIN_SPEED,
            0,
            3,
          );

          audio.playbackRate = clamp(ratio, 0.02, 3);

          setEnvelope(
            clamp(ratio, 0, 1),
            clamp(ratio, 0, 1),
          );
        }

        if (Math.abs(velocityRef.current) < STOP_EPSILON) {
          velocityRef.current = 0;

          if (isPlayingRef.current) {
            modeRef.current = "spinning";
          } else {
            modeRef.current = "paused";
            audio?.pause();
            setEnvelope(1, 0);
          }
        }
      } else if (mode === "paused") {
        velocityRef.current = lerp(
          velocityRef.current,
          0,
          1 - Math.exp(-dt / PAUSE_DECAY_TAU),
        );

        rotationRef.current += velocityRef.current * dt;
      }

      rotate.set(rotationRef.current);
      updateReactiveGlow(mode);

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = null;
    };
  }, [rotate]);

  /* ---------------------------------------------------------------
     Pointer / vinyl
  ---------------------------------------------------------------- */

  const calculateAngle = (
    clientX: number,
    clientY: number,
  ): number => {
    const vinyl = vinylContainerRef.current;

    if (!vinyl) {
      return 0;
    }

    const rect = vinyl.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
      Math.atan2(clientY - centerY, clientX - centerX) *
      (180 / Math.PI)
    );
  };

  const applyScratchAudio = (
    delta: number,
    dt: number,
  ): void => {
    const audio = audioRef.current;

    if (
      !audio ||
      !wasAudibleRef.current ||
      !audioCtxRef.current
    ) {
      return;
    }

    const gain = gainNodeRef.current;
    const filter = filterNodeRef.current;
    const crackle = crackleGainRef.current;

    const currentTime = audioCtxRef.current.currentTime;

    if (delta >= 0) {
      const speedRatio = clamp(
        (delta / dt) / TARGET_SPIN_SPEED,
        0.15,
        4,
      );

      audio.playbackRate = speedRatio;

      gain?.gain.setTargetAtTime(
        clamp(
          1 - Math.abs(speedRatio - 1) * 0.15,
          0.4,
          1,
        ),
        currentTime,
        0.02,
      );

      filter?.frequency.setTargetAtTime(
        lerp(
          1200,
          9000,
          clamp(speedRatio / 2, 0, 1),
        ),
        currentTime,
        0.02,
      );
    } else {
      audio.playbackRate = 0.4;

      if (Number.isFinite(audio.duration)) {
        audio.currentTime = clamp(
          audio.currentTime - Math.abs(delta) * 0.0025,
          0,
          audio.duration,
        );
      }

      gain?.gain.setTargetAtTime(
        0.16,
        currentTime,
        0.02,
      );

      filter?.frequency.setTargetAtTime(
        700,
        currentTime,
        0.02,
      );
    }

    crackle?.gain.setTargetAtTime(
      0.05,
      currentTime,
      0.05,
    );
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    e.preventDefault();

    ensureAudioGraph();

    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);

    modeRef.current = "dragging";
    wasAudibleRef.current = isPlayingRef.current;
    velocityRef.current = 0;

    lastPointerAngleRef.current = calculateAngle(
      e.clientX,
      e.clientY,
    );

    lastPointerTimeRef.current = performance.now();
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    if (modeRef.current !== "dragging") {
      return;
    }

    const rawAngle = calculateAngle(
      e.clientX,
      e.clientY,
    );

    let delta =
      rawAngle - lastPointerAngleRef.current;

    if (delta > 180) {
      delta -= 360;
    }

    if (delta < -180) {
      delta += 360;
    }

    const now = performance.now();

    const dt = Math.max(
      (now - lastPointerTimeRef.current) / 1000,
      1 / 240,
    );

    const instantVelocity = delta / dt;

    velocityRef.current = lerp(
      velocityRef.current,
      instantVelocity,
      0.6,
    );

    rotationRef.current += delta;

    rotate.set(rotationRef.current);

    lastPointerAngleRef.current = rawAngle;
    lastPointerTimeRef.current = now;

    applyScratchAudio(delta, dt);
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
  ): void => {
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const flickSpeed = Math.abs(velocityRef.current);

    if (flickSpeed > FLICK_THRESHOLD) {
      modeRef.current = "inertia";
    } else if (isPlayingRef.current) {
      modeRef.current = "spinning";

      const gain = gainNodeRef.current;
      const filter = filterNodeRef.current;
      const currentTime =
        audioCtxRef.current?.currentTime ?? 0;

      if (audioRef.current) {
        audioRef.current.playbackRate = 1;
      }

      gain?.gain.setTargetAtTime(
        1,
        currentTime,
        0.05,
      );

      filter?.frequency.setTargetAtTime(
        15000,
        currentTime,
        0.05,
      );
    } else {
      modeRef.current = "paused";
    }
  };

  /* ---------------------------------------------------------------
     Play / pause
  ---------------------------------------------------------------- */

  const togglePlay = async (): Promise<void> => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    ensureAudioGraph();

    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();

      if (modeRef.current === "spinning") {
        modeRef.current = "paused";
      }

      return;
    }

    try {
      await audioCtxRef.current?.resume();
      await audio.play();

      wasAudibleRef.current = true;
      setIsPlaying(true);

      if (modeRef.current !== "dragging") {
        modeRef.current = "spinning";
      }
    } catch (error) {
      console.log("Audio play blocked:", error);
    }
  };

  /* ---------------------------------------------------------------
     Mouse spotlight / shimmer
  ---------------------------------------------------------------- */

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const x =
        ((e.clientX - rect.left) / rect.width) * 100;

      const y =
        ((e.clientY - rect.top) / rect.height) * 100;

      setSpotlight({ x, y });

      const vinyl = vinylContainerRef.current;
      const shimmer = shimmerRef.current;

      if (vinyl && shimmer) {
        const rect = vinyl.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle =
          Math.atan2(
            e.clientY - centerY,
            e.clientX - centerX,
          ) *
          (180 / Math.PI);

        shimmer.style.setProperty(
          "--shimmer-angle",
          `${angle}deg`,
        );
      }
    };

    container.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    return () => {
      container.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
    };
  }, []);

  /* ---------------------------------------------------------------
     Typewriter
  ---------------------------------------------------------------- */

  useEffect(() => {
    const currentRole = ROLES[roleIndex];

    if (isPaused) {
      const timeout = window.setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    if (!isDeleting) {
      if (displayed.length < currentRole.length) {
        const timeout = window.setTimeout(() => {
          setDisplayed(
            currentRole.slice(
              0,
              displayed.length + 1,
            ),
          );
        }, 60);

        return () => {
          window.clearTimeout(timeout);
        };
      }

      setIsPaused(true);
      return;
    }

    if (displayed.length > 0) {
      const timeout = window.setTimeout(() => {
        setDisplayed(
          displayed.slice(0, -1),
        );
      }, 35);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    setIsDeleting(false);

    setRoleIndex((current) => {
      return (current + 1) % ROLES.length;
    });
  }, [
    displayed,
    isDeleting,
    isPaused,
    roleIndex,
  ]);

  const armTargetAngle = needleDown
    ? lerp(
        ARM_ANGLE_OUTER_GROOVE,
        ARM_ANGLE_INNER_GROOVE,
        clamp(trackProgress, 0, 1),
      )
    : ARM_ANGLE_REST;

  return (
    <section
      id="home"
      ref={containerRef}
      className="hero-section"
    >
      <div
        aria-hidden="true"
        className="hero-spotlight"
        style={{
          background: `radial-gradient(
            ellipse 600px 500px at ${spotlight.x}% ${spotlight.y}%,
            rgba(200,170,110,0.08) 0%,
            transparent 70%
          )`,
        }}
      />

      <div
        aria-hidden="true"
        className="hero-grain"
      />

      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-availability hero-animate hero-delay-1">
            <span className="hero-status-dot" />
            Available for new projects
          </p>

          <h1 className="hero-title hero-animate hero-delay-2">
            Krishna Bihari — <br />

            <span className="hero-title-accent">
              Engineering software
            </span>{" "}
            that creates value.
          </h1>

          <div className="hero-role hero-animate hero-delay-3">
            <span>
              {displayed}
              <span className="hero-cursor" />
            </span>
          </div>

          <p className="hero-description hero-animate hero-delay-4">
            Full-stack developer and AI engineer from the Netherlands —
            building web applications, AI-powered automations, and SaaS
            products that solve real business problems.
          </p>

          <div className="hero-actions hero-animate hero-delay-5">
            <a
              href="#work"
              className="btn-primary"
            >
              View my work
            </a>

            <a
              href="/client"
              className="btn-secondary"
            >
              Client portal
            </a>

            <a
              href="#contact"
              className="btn-secondary"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="hero-player">
          <div className="vinyl-stage">
            <div
              ref={glowRef}
              aria-hidden="true"
              className="vinyl-glow"
            />

            <motion.div
              aria-hidden="true"
              className="tonearm"
              animate={{
                rotate: armTargetAngle,
                y: needleDown ? 0 : -6,
              }}
              transition={{
                type: "spring",
                stiffness: needleDown ? 130 : 95,
                damping: 15,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="tonearm-svg"
              >
                <circle
                  cx="88"
                  cy="12"
                  r="7"
                  fill="#1a1a18"
                  stroke="#3a3833"
                  strokeWidth="1.5"
                />

                <circle
                  cx="88"
                  cy="12"
                  r="2.5"
                  fill="#0a0a09"
                />

                <line
                  x1="88"
                  y1="12"
                  x2="16"
                  y2="78"
                  stroke="#2a2925"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <rect
                  x="8"
                  y="72"
                  width="16"
                  height="9"
                  rx="2"
                  fill="#1e1d1a"
                  stroke="#3a3833"
                  strokeWidth="1"
                />

                <circle
                  cx="9"
                  cy="81"
                  r="1.6"
                  fill={
                    needleDown
                      ? "var(--forest-bright, #6fae7d)"
                      : "#4a4843"
                  }
                />
              </svg>
            </motion.div>

            <div
              ref={vinylContainerRef}
              className="vinyl"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <motion.div
                className="vinyl-disc"
                style={{
                  rotate,
                }}
              >
                <div className="album-art">
                  <img
                    src={ALBUM_ART_SRC}
                    alt="Album artwork"
                    draggable={false}
                  />

                  <div className="vinyl-center-hole" />
                </div>
              </motion.div>
            </div>

            <div
              ref={shimmerRef}
              aria-hidden="true"
              className="vinyl-shimmer"
            />
          </div>

          <button
            type="button"
            className="player-button"
            onClick={() => void togglePlay()}
            aria-label={
              isPlaying
                ? "Pauzeer track"
                : "Speel track af"
            }
          >
            {isPlaying && !isDragging ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="hero-stats">
        {[
          {
            value: "3+",
            label: "Years building software",
          },
          {
            value: "10+",
            label: "Projects shipped",
          },
          {
            value: "5+",
            label: "AI & tech stacks",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="hero-stat"
          >
            <p className="hero-stat-value">
              {stat.value}
            </p>

            <p className="hero-stat-label">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="hero-scroll"
      >
        <span>Scroll</span>

        <div className="hero-scroll-line" />
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          padding:
            clamp(5rem, 10vw, 8rem)
            clamp(1.25rem, 6vw, 6rem);
        }

        .hero-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.035;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
        }

        .hero-copy {
          width: 100%;
          min-width: 0;
        }

        .hero-availability {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0 0 1.75rem;
          color: var(--sand);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .hero-status-dot {
          display: block;
          width: 6px;
          min-width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--forest-bright);
          box-shadow: 0 0 8px var(--forest-bright);
        }

        .hero-title {
          margin: 0 0 1.25rem;
          color: var(--soft-white);
          font-size: clamp(2.2rem, 5.5vw, 4.5rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .hero-title-accent {
          color: var(--sand-light);
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }

        .hero-role {
          min-height: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          color: var(--muted);
          font-family: "JetBrains Mono", monospace;
          font-size: clamp(0.95rem, 2.2vw, 1.35rem);
          letter-spacing: -0.01em;
        }

        .hero-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          margin-left: 3px;
          vertical-align: text-bottom;
          background: var(--sand-light);
          animation: heroBlink 1s step-end infinite;
        }

        .hero-description {
          max-width: 500px;
          margin: 0 0 2.5rem;
          color: var(--muted);
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.7rem;
        }

        .hero-player {
          width: 100%;
          min-width: 0;
          min-height: clamp(320px, 48vw, 560px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 0;
        }

        .vinyl-stage {
          position: relative;
          width: clamp(220px, 32vw, 380px);
          height: clamp(220px, 32vw, 380px);
        }

        .vinyl-glow {
          position: absolute;
          inset: -18%;
          z-index: 0;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(200, 170, 110, 0.35) 0%,
              rgba(200, 170, 110, 0.08) 45%,
              transparent 72%
            );
          opacity: 0.22;
          filter: blur(46px);
          pointer-events: none;
        }

        .tonearm {
          position: absolute;
          top: -6%;
          right: -14%;
          width: 46%;
          height: 46%;
          z-index: 4;
          transform-origin: 88% 12%;
          pointer-events: none;
        }

        .tonearm-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .vinyl {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(38, 38, 38, 0.4);
          border-radius: 50%;
          background-color: #0e0e0d;
          background-image:
            radial-gradient(
              circle,
              transparent 30%,
              rgba(0, 0, 0, 0.9) 31%,
              transparent 32%
            ),
            radial-gradient(
              circle,
              transparent 45%,
              rgba(255, 255, 255, 0.02) 46%,
              transparent 47%
            ),
            radial-gradient(
              circle,
              transparent 60%,
              rgba(0, 0, 0, 0.85) 61%,
              transparent 62%
            ),
            radial-gradient(
              circle,
              transparent 75%,
              rgba(255, 255, 255, 0.01) 76%,
              transparent 77%
            );
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
          cursor: grab;
          touch-action: none;
          user-select: none;
        }

        .vinyl:active {
          cursor: grabbing;
        }

        .vinyl-disc {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .album-art {
          position: relative;
          width: clamp(72px, 10vw, 112px);
          height: clamp(72px, 10vw, 112px);
          overflow: hidden;
          border: 4px solid #0e0e0d;
          border-radius: 50%;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
        }

        .album-art img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }

        .vinyl-center-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          transform: translate(-50%, -50%);
          border: 1px solid #222;
          border-radius: 50%;
          background: #050505;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);
        }

        .vinyl-shimmer {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: 50%;
          pointer-events: none;
          background:
            conic-gradient(
              from var(--shimmer-angle, 0deg),
              transparent 0deg,
              rgba(255, 255, 255, 0.16) 6deg,
              transparent 16deg,
              transparent 344deg,
              rgba(255, 255, 255, 0.1) 354deg,
              transparent 360deg
            );
          -webkit-mask-image:
            radial-gradient(
              circle,
              transparent 26%,
              black 32%,
              black 78%,
              transparent 83%
            );
          mask-image:
            radial-gradient(
              circle,
              transparent 26%,
              black 32%,
              black 78%,
              transparent 83%
            );
          mix-blend-mode: screen;
          opacity: 0.6;
        }

        .player-button {
          width: 44px;
          height: 44px;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-mid);
          border-radius: 50%;
          background: rgba(23, 23, 23, 0.6);
          color: #d4d4d4;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transition:
            background-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .player-button:hover {
          background: rgba(40, 40, 40, 0.8);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .hero-stats {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1280px;
          margin: clamp(2.5rem, 5vw, 5rem) auto 0;
          display: flex;
          flex-wrap: wrap;
          gap: clamp(2rem, 5vw, 4rem);
        }

        .hero-stat-value {
          margin: 0 0 0.3rem;
          color: var(--soft-white);
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .hero-stat-label {
          margin: 0;
          color: var(--muted);
          font-size: 0.75rem;
          letter-spacing: 0.04em;
        }

        .hero-scroll {
          position: absolute;
          left: 50%;
          bottom: 2.5rem;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .hero-scroll span {
          color: var(--muted);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hero-scroll-line {
          width: 1px;
          height: 48px;
          background:
            linear-gradient(
              to bottom,
              var(--border-mid),
              transparent
            );
          animation:
            heroScrollPulse 2.5s ease-in-out infinite;
        }

        .hero-animate {
          opacity: 0;
          transform: translateY(18px);
          animation:
            heroReveal
            800ms
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .hero-delay-1 {
          animation-delay: 80ms;
        }

        .hero-delay-2 {
          animation-delay: 160ms;
        }

        .hero-delay-3 {
          animation-delay: 240ms;
        }

        .hero-delay-4 {
          animation-delay: 320ms;
        }

        .hero-delay-5 {
          animation-delay: 400ms;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroBlink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }
        }

        @keyframes heroScrollPulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(1);
          }

          50% {
            opacity: 1;
            transform: scaleY(1.15);
          }
        }

        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(380px, 0.85fr);
          }

          .hero-player {
            min-height: 0;
          }
        }

        @media (max-width: 767px) {
          .hero-section {
            padding-top: 6rem;
            padding-bottom: 4rem;
          }

          .hero-content {
            gap: 2rem;
          }

          .hero-description {
            margin-bottom: 2rem;
          }

          .hero-actions {
            gap: 0.6rem;
          }

          .hero-cta {
            min-height: 44px;
            padding: 0.7rem 0.95rem;
            font-size: 0.76rem;
          }

          .hero-cta-ghost {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }

          .hero-player {
            min-height: 320px;
          }

          .hero-stats {
            margin-top: 2rem;
            gap: 1.75rem 2.5rem;
          }

          .hero-scroll {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .hero-section {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .hero-title {
            font-size: 2.15rem;
          }

          .hero-role {
            font-size: 0.88rem;
          }

          .vinyl-stage {
            width: 220px;
            height: 220px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-animate {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .hero-cursor,
          .hero-scroll-line {
            animation: none;
          }

          .hero-cta,
          .player-button {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}