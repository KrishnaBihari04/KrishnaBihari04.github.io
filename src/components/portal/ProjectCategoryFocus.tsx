import type { ProjectCategory } from '../../lib/client/types';
import { PROJECT_CATEGORY_CONFIG } from './projectCategoryConfig';

type ProjectCategoryFocusProps = {
  readonly category: ProjectCategory;
};

export default function ProjectCategoryFocus({
  category,
}: ProjectCategoryFocusProps) {
  const config = PROJECT_CATEGORY_CONFIG[category];

  return (
    <section
      data-reveal
      style={{
        border: '1px solid var(--border-mid)',
        borderRadius: '18px',
        background: 'rgba(10, 10, 10, 0.78)',
        padding: '1.5rem',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.14)',
      }}
    >
      <div
        style={{
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            marginBottom: '0.4rem',
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--sand)',
          }}
        >
          Project focus
        </div>

        <h3
          style={{
            margin: 0,
            color: 'var(--soft-white)',
            fontSize: '1.15rem',
            fontWeight: 500,
          }}
        >
          {config.label}
        </h3>

        <p
          style={{
            marginTop: '0.65rem',
            marginBottom: 0,
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: '65ch',
          }}
        >
          {config.description}
        </p>
      </div>

      <div className="project-category-focus__grid">
        {config.focusAreas.map((area) => (
          <div
            key={area}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border:
                '1px solid rgba(255,255,255,0.05)',
              background:
                'rgba(255,255,255,0.018)',
              color: 'var(--soft-white)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
            }}
          >
            {area}
          </div>
        ))}
      </div>

      <style>{`
        .project-category-focus__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }

        @media (max-width: 640px) {
          .project-category-focus__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}