import type { ProjectCategory } from '../../lib/client/types';

type ProjectOverviewItem = {
  readonly name: string;
  readonly client: string;
  readonly category: ProjectCategory;
  readonly type: string;
  readonly status: string;
  readonly phase: string;
  readonly progress: number;
  readonly expectedLaunch: string;
  readonly description: string;
  readonly liveDemoUrl?: string | null;
};

type ProjectOverviewProps = {
  readonly project: ProjectOverviewItem;
};

type CategoryConfig = {
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
};

const CATEGORY_CONFIG: Record<
  ProjectCategory,
  CategoryConfig
> = {
  'web-development': {
    label: 'Web Development',
    shortLabel: 'Web',
    description:
      'Custom website development and digital experiences.',
  },

  redesign: {
    label: 'Web Redesign',
    shortLabel: 'Redesign',
    description:
      'A visual and functional redesign of an existing website.',
  },

  saas: {
    label: 'SaaS',
    shortLabel: 'SaaS',
    description:
      'A software product built for ongoing use and scalability.',
  },

  'ai-tool': {
    label: 'AI Tool',
    shortLabel: 'AI Tool',
    description:
      'An AI-powered product or intelligent software experience.',
  },

  'ai-automation': {
    label: 'AI Automation',
    shortLabel: 'AI Automation',
    description:
      'An automated workflow designed to reduce manual processes.',
  },
};

const normalizeCategory = (
  category: ProjectCategory,
): ProjectCategory => {
  switch (category) {
    case 'web-development':
      return 'web-development';

    case 'redesign':
      return 'redesign';

    case 'saas':
      return 'saas';

    case 'ai-tool':
      return 'ai-tool';

    case 'ai-automation':
      return 'ai-automation';

    default:
      return 'web-development';
  }
};

export default function ProjectOverview({
  project,
}: ProjectOverviewProps) {
  const categoryKey = normalizeCategory(
    project.category,
  );

  const category = CATEGORY_CONFIG[categoryKey];

  const progress = Math.min(
    Math.max(project.progress, 0),
    100,
  );

  const expectedLaunch =
    project.expectedLaunch?.trim() || 'Not scheduled';

  const projectStatus =
    project.status?.trim() || 'Status unavailable';

  const projectPhase =
    project.phase?.trim() || 'Not specified';

  const projectDescription =
    project.description?.trim() ||
    'Project information is currently unavailable.';

  return (
    <section
      data-reveal
      className="project-overview"
      style={{
        position: 'relative',
        border: '1px solid var(--border-mid)',
        background: 'rgba(10, 10, 10, 0.78)',
        borderRadius: '18px',
        padding: 'clamp(1.1rem, 3vw, 1.5rem)',
        overflow: 'hidden',
        boxShadow:
          '0 20px 45px rgba(0, 0, 0, 0.18)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 0% 0%, rgba(200, 184, 154, 0.08), transparent 58%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="project-overview__header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: '1 1 260px',
            }}
          >
            <p
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                marginBottom: '0.75rem',
              }}
            >
              Project overview
            </p>

            <h3
              style={{
                margin: 0,
                fontSize:
                  'clamp(1.55rem, 3vw, 2.3rem)',
                lineHeight: 1.1,
                color: 'var(--soft-white)',
                overflowWrap: 'anywhere',
              }}
            >
              {project.name}
            </h3>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '999px',
              border:
                '1px solid rgba(200, 184, 154, 0.18)',
              background:
                'rgba(200, 184, 154, 0.06)',
              color: 'var(--sand-light)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '7px',
                height: '7px',
                flex: '0 0 7px',
                borderRadius: '50%',
                background: 'var(--sand-light)',
                boxShadow:
                  '0 0 0 4px rgba(200, 184, 154, 0.08)',
              }}
            />

            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {category.label}
            </span>
          </div>
        </div>

        <div className="project-overview__meta-grid">
          {[
            {
              label: 'Category',
              value: category.label,
            },
            {
              label: 'Current phase',
              value: projectPhase,
            },
            {
              label: 'Current status',
              value: projectStatus,
            },
            {
              label: 'Expected launch',
              value: expectedLaunch,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                minWidth: 0,
                border:
                  '1px solid rgba(255,255,255,0.05)',
                background:
                  'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.64rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-light)',
                  marginBottom: '0.35rem',
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontSize: '0.96rem',
                  color: 'var(--soft-white)',
                  lineHeight: 1.45,
                  overflowWrap: 'anywhere',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.95rem 1rem',
            borderRadius: '12px',
            border:
              '1px solid rgba(255,255,255,0.05)',
            background:
              'rgba(255,255,255,0.018)',
          }}
        >
          <div
            style={{
              fontSize: '0.64rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted-light)',
              marginBottom: '0.35rem',
            }}
          >
            Project category
          </div>

          <div
            style={{
              color: 'var(--soft-white)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            {category.description}
          </div>
        </div>

        <div
          className="project-overview__progress-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted-light)',
            }}
          >
            Overall progress
          </div>

          <div
            style={{
              fontSize: '1.5rem',
              color: 'var(--soft-white)',
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
            }}
          >
            {progress}%
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '999px',
            background:
              'rgba(255,255,255,0.05)',
            overflow: 'hidden',
            marginBottom: '1.1rem',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background:
                'linear-gradient(90deg, var(--forest-bright), var(--sand-light))',
              borderRadius: 'inherit',
              transition:
                'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            color: 'var(--muted)',
            fontSize: '0.98rem',
            lineHeight: 1.8,
            maxWidth: '60ch',
          }}
        >
          {projectDescription}
        </p>

        {project.liveDemoUrl && (
          <div
            className="project-overview__actions"
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minHeight: '44px',
              }}
            >
              View Live Demo
              <span
                aria-hidden="true"
                style={{
                  fontSize: '0.95rem',
                }}
              >
                ↗
              </span>
            </a>
          </div>
        )}
      </div>

      <style>{`
        .project-overview__meta-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .project-overview__actions a {
          text-decoration: none;
        }

        @media (max-width: 560px) {
          .project-overview__meta-grid {
            grid-template-columns: 1fr;
            gap: 0.7rem;
          }

          .project-overview__header {
            margin-bottom: 1.2rem !important;
          }

          .project-overview__progress-header {
            align-items: flex-end !important;
          }

          .project-overview__actions {
            width: 100%;
          }

          .project-overview__actions a {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .project-overview {
            border-radius: 15px !important;
          }
        }
      `}</style>
    </section>
  );
}