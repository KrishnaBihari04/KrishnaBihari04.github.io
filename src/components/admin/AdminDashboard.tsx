type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      style={{
        border: '1px solid var(--border-mid)',
        borderRadius: '20px',
        padding: '1.2rem',
        background: 'rgba(10, 10, 10, 0.7)',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--sand)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '2.2rem',
          marginTop: '0.7rem',
          color: 'var(--soft-white)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                marginBottom: '0.5rem',
              }}
            >
              Developer access
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: 'var(--soft-white)',
              }}
            >
              Admin dashboard
            </h1>
          </div>

          <div
            style={{
              border: '1px solid var(--border-mid)',
              borderRadius: '999px',
              padding: '0.7rem 1rem',
              color: 'var(--muted-light)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            Phase 5 foundation
          </div>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard label="Clients" value="—" />
          <StatCard label="Projects" value="—" />
          <StatCard label="Active projects" value="—" />
          <StatCard label="Total hours" value="—" />
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '1rem',
          }}
        >
          <div
            style={{
              border: '1px solid var(--border-mid)',
              borderRadius: '22px',
              background: 'rgba(10, 10, 10, 0.7)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                marginBottom: '1rem',
              }}
            >
              Project overview
            </div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: 0 }}>
              This admin area is intentionally kept minimal as the Phase 5 foundation. The next steps will add authenticated developer access, client/project management, and the operational dashboard for delivery management.
            </p>
          </div>

          <div
            style={{
              border: '1px solid var(--border-mid)',
              borderRadius: '22px',
              background: 'rgba(10, 10, 10, 0.7)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                marginBottom: '1rem',
              }}
            >
              Planned modules
            </div>
            <ul style={{ color: 'var(--soft-white)', lineHeight: 1.9, margin: 0, paddingLeft: '1.1rem' }}>
              <li>Client overview</li>
              <li>Project board</li>
              <li>Timeline management</li>
              <li>Hours tracking</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
