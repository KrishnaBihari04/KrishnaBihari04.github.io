import ProjectOverview from './ProjectOverview';
import ProjectProgress from './ProjectProgress';
import ProjectTimeline from './ProjectTimeline';
import ProjectHours from './ProjectHours';
import { mockClient, mockHours, mockProject, mockTimeline } from './mockPortalData';

export default function ClientDashboard() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem 1.25rem 4rem',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <header
          data-reveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            border: '1px solid var(--border-mid)',
            background: 'rgba(10, 10, 10, 0.78)',
            borderRadius: '18px',
            padding: '1.2rem 1.25rem',
            marginBottom: '1.6rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                background: 'rgba(200,184,154,0.08)',
                border: '1px solid var(--border-mid)',
                color: 'var(--sand-light)',
                fontWeight: 600,
              }}
            >
              {mockClient.initials}
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--sand)',
                  marginBottom: '0.18rem',
                }}
              >
                {mockClient.company}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: 'var(--soft-white)',
                  lineHeight: 1.1,
                }}
              >
                Welcome back, {mockClient.name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/client';
            }}
            className="btn-secondary"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-mid)',
              color: 'var(--soft-white)',
            }}
          >
            Log out
          </button>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.9fr',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <ProjectOverview project={mockProject} />
          <ProjectProgress
            progress={mockProject.progress}
            phase={mockProject.phase}
            status={mockProject.status}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '1.25rem',
          }}
        >
          <ProjectTimeline items={mockTimeline} />
          <ProjectHours hours={mockHours} />
        </div>
      </div>
    </main>
  );
}
