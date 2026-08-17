import { useEffect, useMemo, useState } from 'react';
import ProjectOverview from './ProjectOverview';
import ProjectProgress from './ProjectProgress';
import ProjectTimeline from './ProjectTimeline';
import ProjectHours from './ProjectHours';
import { clearClientSession, getClientSession } from '../../lib/client/auth';
import { fetchPortalDataByClientCode } from '../../lib/client/portal';
import type { ClientPortalData } from '../../lib/client/types';

export default function ClientDashboard() {
  const [portalData, setPortalData] = useState<ClientPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getClientSession();

    if (!session) {
      setLoading(false);
      setError('Your session expired. Please sign in again.');
      return;
    }

    const load = async () => {
      const data = await fetchPortalDataByClientCode(session.clientCode);

      if (!data) {
        setError('We could not load your project information at the moment.');
        setLoading(false);
        return;
      }

      setPortalData(data);
      setLoading(false);
    };

    void load();
  }, []);

  const initials = useMemo(() => {
    if (!portalData) return 'WM';
    const name = portalData.client.name || portalData.client.company || 'Client';
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'C';
  }, [portalData]);

  const handleLogout = async () => {
    clearClientSession();

    try {
      await fetch('/api/client/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore API errors; we still clear the local session to prevent access.
    }

    window.location.href = '/client';
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem 1.25rem' }}>
        <div style={{ width: '100%', maxWidth: '760px', border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.8)', padding: '2rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '1rem' }}>Loading</div>
          <div style={{ height: '12px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg, var(--forest-bright), var(--sand-light))' }} />
          </div>
          <div style={{ color: 'var(--muted)', lineHeight: 1.8 }}>Authenticating and loading your project workspace…</div>
        </div>
      </main>
    );
  }

  if (!portalData) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem 1.25rem' }}>
        <div style={{ width: '100%', maxWidth: '720px', border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.8)', padding: '2rem' }}>
          <div style={{ color: 'var(--soft-white)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Unable to open your workspace</div>
          <div style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{error || 'Something went wrong while loading this project.'}</div>
          <a href="/client" className="btn-secondary" style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Back to client login</a>
        </div>
      </main>
    );
  }

  const project = portalData.project;
  const hours = portalData.hours;

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
              {initials}
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
                {portalData.client.company}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: 'var(--soft-white)',
                  lineHeight: 1.1,
                }}
              >
                Welcome back, {portalData.client.name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
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
          <ProjectOverview project={{
            name: project.name,
            client: portalData.client.company,
            type: project.type,
            status: project.status,
            phase: project.phase,
            progress: project.progress,
            expectedLaunch: project.expected_launch,
            description: project.description,
          }} />
          <ProjectProgress
            progress={project.progress}
            phase={project.phase}
            status={project.status}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '1.25rem',
          }}
        >
          <ProjectTimeline items={portalData.timeline.map((item) => ({
            title: item.title,
            description: item.description,
            status: item.status,
            date: item.date,
          }))} />
          <ProjectHours hours={{
            used: hours.hours_used,
            allocated: hours.hours_allocated,
            remaining: Math.max(hours.hours_allocated - hours.hours_used, 0),
          }} />
        </div>
      </div>
    </main>
  );
}
