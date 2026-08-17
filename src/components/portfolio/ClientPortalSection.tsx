export default function ClientPortalSection() {
  return (
    <section id="client-portal" className="section-padding">
      <div className="container-main">
        <div
          style={{
            border: '1px solid var(--border-mid)',
            background: 'rgba(10, 10, 10, 0.82)',
            borderRadius: '22px',
            padding: 'clamp(1.5rem, 3vw, 3rem)',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            alignItems: 'center',
            boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
          }}
        >
          <div>
            <p className="section-label">Client portal</p>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.04,
                color: 'var(--soft-white)',
                marginBottom: '1rem',
              }}
            >
              A private workspace for ongoing projects.
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                maxWidth: '54ch',
                lineHeight: 1.8,
                fontSize: '0.98rem',
                marginBottom: '1.75rem',
              }}
            >
              If we are already building together, this is where you can track progress,
              review timelines, and keep up with the project status in one focused place.
            </p>

            <a href="/client" className="btn-primary">
              Access client portal
            </a>
          </div>

          <div
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '18px',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--sand)',
                  }}
                >
                  Active project
                </div>
                <div
                  style={{
                    marginTop: '0.4rem',
                    color: 'var(--soft-white)',
                    fontSize: '1.15rem',
                  }}
                >
                  Website Redesign
                </div>
              </div>

              <span
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--sand-light)',
                  fontSize: '0.64rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                In development
              </span>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--muted-light)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                <span>Progress</span>
                <span>68%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '68%',
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--forest-bright), var(--sand-light))',
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.8rem',
              }}
            >
              {[
                ['Discovery', 'Completed'],
                ['Design', 'Completed'],
                ['Development', 'Current phase'],
                ['Launch', 'September 2026'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '0.8rem',
                    gap: '1rem',
                  }}
                >
                  <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{label}</span>
                  <span style={{ color: 'var(--soft-white)', fontSize: '0.88rem' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
