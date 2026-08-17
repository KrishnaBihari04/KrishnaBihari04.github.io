import type { ProjectHours as ProjectHoursType } from './mockPortalData';

type ProjectHoursProps = {
  hours: ProjectHoursType;
};

export default function ProjectHours({ hours }: ProjectHoursProps) {
  const usedPct = (hours.used / hours.allocated) * 100;

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
      <p
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--sand)',
          marginBottom: '1.25rem',
        }}
      >
        Hours overview
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.2rem',
        }}
      >
        {[
          { label: 'Hours used', value: `${hours.used}h` },
          { label: 'Allocated', value: `${hours.allocated}h` },
          { label: 'Remaining', value: `${hours.remaining}h` },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              padding: '0.8rem 0.8rem',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted-light)',
                marginBottom: '0.25rem',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: '1.2rem',
                color: 'var(--soft-white)',
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '12px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${usedPct}%`,
            height: '100%',
            borderRadius: 'inherit',
            background: 'linear-gradient(90deg, var(--sand-light), var(--forest-bright))',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </section>
  );
}
