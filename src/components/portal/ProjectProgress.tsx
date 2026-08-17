type ProjectProgressProps = {
  progress: number;
  phase: string;
  status: string;
};

export default function ProjectProgress({ progress, phase, status }: ProjectProgressProps) {
  return (
    <section
      data-reveal
      style={{
        border: '1px solid var(--border-mid)',
        background: 'rgba(10, 10, 10, 0.78)',
        borderRadius: '18px',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.4rem',
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
              marginBottom: '0.5rem',
            }}
          >
            Progress
          </p>
          <h3
            style={{
              fontSize: '1.5rem',
              color: 'var(--soft-white)',
            }}
          >
            {progress}% complete
          </h3>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '999px',
            padding: '0.45rem 0.8rem',
            color: 'var(--sand-light)',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--forest-bright)',
            }}
          />
          {status}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '16px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          marginBottom: '1.2rem',
        }}
      >
        <div
          data-progress-fill
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: 'inherit',
            background: 'linear-gradient(90deg, var(--forest-bright), var(--sand-light))',
            transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.8rem',
        }}
      >
        {[
          { label: 'Current phase', value: phase },
          { label: 'Completed', value: `${Math.round(progress)}%` },
          { label: 'Remaining', value: `${100 - progress}%` },
          { label: 'Milestone', value: 'Q3 delivery' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              padding: '0.8rem 0.85rem',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted-light)',
                marginBottom: '0.4rem',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                color: 'var(--soft-white)',
                fontSize: '0.95rem',
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
