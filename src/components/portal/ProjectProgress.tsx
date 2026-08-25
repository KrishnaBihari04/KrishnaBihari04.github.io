type ProjectProgressProps = {
  readonly progress: number;
  readonly phase: string;
  readonly status: string;
};

type ProgressStage = {
  readonly key: string;
  readonly label: string;
};

const DEFAULT_STAGES: ProgressStage[] = [
  {
    key: 'discovery',
    label: 'Discovery',
  },
  {
    key: 'design',
    label: 'Design',
  },
  {
    key: 'development',
    label: 'Development',
  },
  {
    key: 'testing',
    label: 'Testing',
  },
  {
    key: 'launch',
    label: 'Launch',
  },
];

const normalizePhase = (phase: string) =>
  phase.trim().toLowerCase();

function getActiveStageIndex(
  phase: string,
): number {
  const normalized = normalizePhase(phase);

  const exactIndex = DEFAULT_STAGES.findIndex(
    (stage) =>
      stage.key === normalized ||
      stage.label.toLowerCase() === normalized,
  );

  if (exactIndex >= 0) {
    return exactIndex;
  }

  if (
    normalized.includes('discovery') ||
    normalized.includes('planning')
  ) {
    return 0;
  }

  if (normalized.includes('design')) {
    return 1;
  }

  if (
    normalized.includes('development') ||
    normalized.includes('build') ||
    normalized.includes('implementation')
  ) {
    return 2;
  }

  if (
    normalized.includes('test') ||
    normalized.includes('qa') ||
    normalized.includes('quality')
  ) {
    return 3;
  }

  if (
    normalized.includes('launch') ||
    normalized.includes('deployment') ||
    normalized.includes('deployed')
  ) {
    return 4;
  }

  return 0;
}

export default function ProjectProgress({
  progress,
  phase,
  status,
}: ProjectProgressProps) {
  const normalizedProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  const activeStageIndex = getActiveStageIndex(phase);

  const completedStages =
    normalizedProgress >= 100
      ? DEFAULT_STAGES.length
      : activeStageIndex;

  return (
    <section
      data-reveal
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-mid)',
        borderRadius: '18px',
        background: 'rgba(10, 10, 10, 0.78)',
        padding: '1.5rem',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.16)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 100% 0%, rgba(65, 105, 80, 0.10), transparent 58%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
              }}
            >
              Project progress
            </div>

            <div
              style={{
                fontSize: '1rem',
                color: 'var(--soft-white)',
              }}
            >
              Delivery progress
            </div>
          </div>

          <div
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1,
              color: 'var(--soft-white)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {normalizedProgress}%
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '10px',
            overflow: 'hidden',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: `${normalizedProgress}%`,
              height: '100%',
              borderRadius: 'inherit',
              background:
                'linear-gradient(90deg, var(--forest-bright), var(--sand-light))',
              transition:
                'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            border:
              '1px solid rgba(255,255,255,0.05)',
            background:
              'rgba(255,255,255,0.018)',
          }}
        >
          <div>
            <div
              style={{
                marginBottom: '0.25rem',
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted-light)',
              }}
            >
              Current phase
            </div>

            <div
              style={{
                color: 'var(--soft-white)',
                fontSize: '0.95rem',
              }}
            >
              {phase}
            </div>
          </div>

          <div
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: '999px',
              border:
                '1px solid rgba(200,184,154,0.15)',
              background:
                'rgba(200,184,154,0.05)',
              color: 'var(--sand-light)',
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {status}
          </div>
        </div>

        <div>
          <div
            style={{
              marginBottom: '0.8rem',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted-light)',
            }}
          >
            Delivery stages
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {DEFAULT_STAGES.map((stage, index) => {
              const isCompleted =
                normalizedProgress >= 100 ||
                index < activeStageIndex;

              const isActive =
                !isCompleted &&
                index === activeStageIndex;

              return (
                <div
                  key={stage.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      flex: '0 0 28px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '50%',
                      border: isCompleted
                        ? '1px solid var(--forest-bright)'
                        : isActive
                          ? '1px solid var(--sand-light)'
                          : '1px solid rgba(255,255,255,0.08)',
                      background: isCompleted
                        ? 'rgba(80,160,110,0.10)'
                        : isActive
                          ? 'rgba(200,184,154,0.08)'
                          : 'rgba(255,255,255,0.025)',
                      color: isCompleted
                        ? 'var(--forest-bright)'
                        : isActive
                          ? 'var(--sand-light)'
                          : 'var(--muted)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {isCompleted
                      ? '✓'
                      : index + 1}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <span
                      style={{
                        color: isCompleted || isActive
                          ? 'var(--soft-white)'
                          : 'var(--muted)',
                        fontSize: '0.88rem',
                      }}
                    >
                      {stage.label}
                    </span>

                    <span
                      style={{
                        fontSize: '0.58rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: isCompleted
                          ? 'var(--forest-bright)'
                          : isActive
                            ? 'var(--sand-light)'
                            : 'var(--muted)',
                      }}
                    >
                      {isCompleted
                        ? 'Complete'
                        : isActive
                          ? 'Current'
                          : 'Upcoming'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}