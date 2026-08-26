import { getProjectCategoryConfig } from './projectCategoryConfig';
import type { ProjectCategory } from '../../lib/client/types';

type ProjectCategoryFocusProps = {
  readonly category: ProjectCategory;
};

export default function ProjectCategoryFocus({
  category,
}: ProjectCategoryFocusProps) {
  const config = getProjectCategoryConfig(category);

  return (
    <section
      data-reveal
      className="project-category-focus"
      style={{
        width: '100%',
        minWidth: 0,
        border: '1px solid var(--border-mid)',
        borderRadius: '18px',
        background: 'rgba(10, 10, 10, 0.78)',
        padding: 'clamp(1.1rem, 3vw, 1.5rem)',
        boxShadow:
          '0 20px 45px rgba(0, 0, 0, 0.14)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          marginBottom: '1.25rem',
          minWidth: 0,
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
            lineHeight: 1.3,
            fontWeight: 500,
            overflowWrap: 'anywhere',
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
            overflowWrap: 'anywhere',
          }}
        >
          {config.description}
        </p>
      </div>

      <div className="project-category-focus__grid">
        {config.focusAreas.map((area) => (
          <div
            key={area}
            className="project-category-focus__item"
          >
            {area}
          </div>
        ))}
      </div>

      <style>{`
        .project-category-focus__grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .project-category-focus__item {
          min-width: 0;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.018);
          color: var(--soft-white);
          font-size: 0.88rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .project-category-focus__grid {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }

          .project-category-focus__item {
            padding: 0.8rem 0.9rem;
          }
        }

        @media (max-width: 380px) {
          .project-category-focus {
            border-radius: 15px;
          }

          .project-category-focus__item {
            font-size: 0.84rem;
          }
        }
      `}</style>
    </section>
  );
}