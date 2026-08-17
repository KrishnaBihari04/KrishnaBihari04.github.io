import type { ProjectSummary } from './mockPortalData';

type ProjectOverviewProps = {
  project: ProjectSummary;
};

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section
      data-reveal
      style={{
        position: 'relative',
        border: '1px solid var(--border-mid)',
        background: 'rgba(10, 10, 10, 0.78)',
        borderRadius: '18px',
        padding: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 0% 0%, rgba(200, 184, 154, 0.08), transparent 58%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
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
                fontSize: 'clamp(1.6rem, 3vw, 2.3rem)',
                lineHeight: 1.1,
                color: 'var(--soft-white)',
              }}
            >
              {project.name}
            </h3>
          </div>

          <span
            style={{
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--sand-light)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {project.phase}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          {[
            { label: 'Client', value: project.client },
            { label: 'Project type', value: project.type },
            { label: 'Current status', value: project.status },
            { label: 'Expected launch', value: project.expectedLaunch },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)',
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
                  fontSize: '0.98rem',
                  color: 'var(--soft-white)',
                  lineHeight: 1.4,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
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
            }}
          >
            {project.progress}%
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)',
            overflow: 'hidden',
            marginBottom: '1.1rem',
          }}
        >
          <div
            style={{
              width: `${project.progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--forest-bright), var(--sand-light))',
              borderRadius: 'inherit',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.98rem',
            lineHeight: 1.8,
            maxWidth: '60ch',
          }}
        >
          {project.description}
        </p>
      </div>
    </section>
  );
}
