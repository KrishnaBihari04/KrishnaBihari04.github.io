import type { ProjectCategory } from '../../lib/client/types';

import { getProjectCategoryConfig } from './projectCategoryConfig';

type ProjectProgressProps = {
  readonly progress: number;
  readonly phase: string;
  readonly status: string;
  readonly category: ProjectCategory;
};

const normalizePhase = (phase: string) =>
  phase.trim().toLowerCase();

function getActiveStageIndex(
  stages: readonly string[],
  phase: string,
): number {
  const normalizedPhase = normalizePhase(phase);

  const exactIndex = stages.findIndex(
    (stage) =>
      normalizePhase(stage) === normalizedPhase,
  );

  if (exactIndex >= 0) {
    return exactIndex;
  }

  const keywordIndex = stages.findIndex((stage) => {
    const normalizedStage = normalizePhase(stage);

    return (
      normalizedPhase.includes(normalizedStage) ||
      normalizedStage.includes(normalizedPhase)
    );
  });

  if (keywordIndex >= 0) {
    return keywordIndex;
  }

  return 0;
}

export default function ProjectProgress({
  progress,
  phase,
  status,
  category,
}: ProjectProgressProps) {
  const normalizedProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  const categoryConfig =
    getProjectCategoryConfig(category);

  const stages = categoryConfig.stages;

  const activeStageIndex = getActiveStageIndex(
    stages,
    phase,
  );

  const currentPhase =
    phase?.trim() || 'Not specified';

  const currentStatus =
    status?.trim() || 'Status unavailable';

  return (
    <section
      data-reveal
      className="project-progress"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minWidth: 0,
        border: '1px solid var(--border-mid)',
        borderRadius: '18px',
        background: 'rgba(10, 10, 10, 0.78)',
        padding: 'clamp(1.1rem, 3vw, 1.5rem)',
        boxShadow:
          '0 20px 45px rgba(0, 0, 0, 0.16)',
      }}
    >
      <div
        aria-hidden="true"
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
          minWidth: 0,
        }}
      >
        <div
          className="project-progress__header"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
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
                color: 'var(--soft-white)',
                fontSize: '1rem',
                overflowWrap: 'anywhere',
              }}
            >
              {categoryConfig.label}
            </div>
          </div>

          <div
            style={{
              flex: '0 0 auto',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1,
              color: 'var(--soft-white)',
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
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
          className="project-progress__current"
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
          <div
            style={{
              minWidth: 0,
            }}
          >
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
                overflowWrap: 'anywhere',
              }}
            >
              {currentPhase}
            </div>
          </div>

          <div
            style={{
              flex: '0 0 auto',
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
            {currentStatus}
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
            {stages.map((stage, index) => {
              const isCompleted =
                normalizedProgress >= 100 ||
                index < activeStageIndex;

              const isActive =
                !isCompleted &&
                index === activeStageIndex;

              return (
                <div
                  key={stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    minWidth: 0,
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
                    className="project-progress__stage-content"
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
                        minWidth: 0,
                        color:
                          isCompleted || isActive
                            ? 'var(--soft-white)'
                            : 'var(--muted)',
                        fontSize: '0.88rem',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {stage}
                    </span>

                    <span
                      style={{
                        flex: '0 0 auto',
                        fontSize: '0.58rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: isCompleted
                          ? 'var(--forest-bright)'
                          : isActive
                            ? 'var(--sand-light)'
                            : 'var(--muted)',
                        whiteSpace: 'nowrap',
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

      <style>{`
        @media (max-width: 480px) {
          .project-progress__header {
            align-items: flex-end;
          }

          .project-progress__current {
            align-items: flex-start;
          }

          .project-progress__stage-content {
            align-items: flex-start !important;
            flex-direction: column;
            gap: 0.15rem !important;
          }
        }

        @media (max-width: 380px) {
          .project-progress {
            border-radius: 15px !important;
          }
        }
      `}</style>
    </section>
  );
}