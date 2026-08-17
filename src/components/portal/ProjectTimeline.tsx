type TimelineItem = {
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  date: string;
};

type ProjectTimelineProps = {
  items: TimelineItem[];
};

const statusStyles: Record<'completed' | 'active' | 'upcoming', { dot: string; ring: string; label: string }> = {
  completed: {
    dot: 'var(--forest-bright)',
    ring: 'rgba(74, 124, 106, 0.22)',
    label: 'Completed',
  },
  active: {
    dot: 'var(--sand-light)',
    ring: 'rgba(200, 184, 154, 0.22)',
    label: 'In progress',
  },
  upcoming: {
    dot: 'rgba(255,255,255,0.2)',
    ring: 'rgba(255,255,255,0.05)',
    label: 'Upcoming',
  },
};

export default function ProjectTimeline({ items }: ProjectTimelineProps) {
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
        Timeline
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map((item, index) => {
          const style = statusStyles[item.status];
          const isActive = item.status === 'active';

          return (
            <div
              key={item.title}
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '20px minmax(0, 1fr) auto',
                gap: '0.9rem',
                alignItems: 'start',
                paddingBottom: index === items.length - 1 ? 0 : '0.6rem',
                borderBottom:
                  index === items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: style.dot,
                  boxShadow: `0 0 0 6px ${style.ring}`,
                  marginTop: '0.25rem',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              />

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.3rem',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.02rem',
                      color: isActive ? 'var(--soft-white)' : 'var(--off-white)',
                    }}
                  >
                    {item.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--sand-light)' : 'var(--muted-light)',
                    }}
                  >
                    {style.label}
                  </span>
                </div>

                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--muted-light)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  paddingTop: '0.2rem',
                }}
              >
                {item.date}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
