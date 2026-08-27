import type { ProjectRecord } from '../../lib/client/types';

import ProjectGallery from './ProjectGallery';

type DemoWorkspaceProps = {
  readonly project: ProjectRecord;
};

const isValidUrl = (
  value?: string | null,
): value is string => {
  if (!value?.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
};

export default function DemoWorkspace({
  project,
}: DemoWorkspaceProps) {
  const projectCode =
    project.project_code?.trim() || 'Project';

  const projectName =
    project.name?.trim() || 'Demo Project';

  const projectDescription =
    project.description?.trim() ||
    'A project preview is currently available.';

  const images = Array.isArray(project.images)
    ? project.images.filter(
        (image): image is string =>
          typeof image === 'string' &&
          image.trim().length > 0,
      )
    : [];

  const liveDemoUrl = isValidUrl(
    project.live_demo_url,
  )
    ? project.live_demo_url.trim()
    : null;

  return (
    <section
      className="demo-workspace"
      data-reveal
    >
      <style>{`
        .demo-workspace {
          position: relative;
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--border-mid);
          border-radius: 20px;
          background: rgba(10, 10, 10, 0.78);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.16);
        }

        .demo-workspace__glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              110% 100% at 0% 0%,
              rgba(200, 184, 154, 0.09),
              transparent 58%
            );
        }

        .demo-workspace__content {
          position: relative;
          z-index: 1;
          padding: clamp(1.2rem, 3vw, 2rem);
        }

        .demo-workspace__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .demo-workspace__identity {
          min-width: 0;
          flex: 1 1 280px;
        }

        .demo-workspace__eyebrow {
          margin: 0 0 0.55rem;
          color: var(--sand);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .demo-workspace__title {
          margin: 0;
          color: var(--soft-white);
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          line-height: 1.08;
          overflow-wrap: anywhere;
        }

        .demo-workspace__code {
          margin-top: 0.5rem;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          overflow-wrap: anywhere;
        }

        .demo-workspace__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(200, 184, 154, 0.18);
          border-radius: 999px;
          background: rgba(200, 184, 154, 0.06);
          color: var(--sand-light);
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .demo-workspace__badge-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--sand-light);
          box-shadow:
            0 0 0 4px rgba(200, 184, 154, 0.08);
        }

        .demo-workspace__description {
          max-width: 72ch;
          margin: 0 0 1.5rem;
          color: var(--muted);
          font-size: 0.98rem;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .demo-workspace__actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
        }

        .demo-workspace__action {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .demo-workspace__section {
          margin-top: 1.5rem;
        }

        .demo-workspace__section-label {
          margin-bottom: 0.8rem;
          color: var(--muted-light);
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .demo-workspace__preview {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
        }

        .demo-workspace__preview img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 640px;
          object-fit: cover;
        }

        .demo-workspace__empty {
          display: grid;
          place-items: center;
          min-height: 240px;
          padding: 2rem;
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.015);
          color: var(--muted);
          text-align: center;
          line-height: 1.7;
        }

        .demo-workspace__gallery {
          margin-top: 1.5rem;
        }

        @media (max-width: 640px) {
          .demo-workspace__content {
            padding: 1rem;
          }

          .demo-workspace__header {
            gap: 0.8rem;
          }

          .demo-workspace__badge {
            width: 100%;
            justify-content: center;
          }

          .demo-workspace__actions {
            width: 100%;
          }

          .demo-workspace__action {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .demo-workspace *,
          .demo-workspace *::before,
          .demo-workspace *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="demo-workspace__glow" />

      <div className="demo-workspace__content">
        <div className="demo-workspace__header">
          <div className="demo-workspace__identity">
            <p className="demo-workspace__eyebrow">
              Demo workspace
            </p>

            <h1 className="demo-workspace__title">
              {projectName}
            </h1>

            <div className="demo-workspace__code">
              {projectCode}
            </div>
          </div>

          <div className="demo-workspace__badge">
            <span
              className="demo-workspace__badge-dot"
              aria-hidden="true"
            />

            Demo
          </div>
        </div>

        <p className="demo-workspace__description">
          {projectDescription}
        </p>

        {liveDemoUrl && (
          <div className="demo-workspace__actions">
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary demo-workspace__action"
              aria-label={`Open live demo for ${projectName}`}
            >
              View Live Demo

              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        )}

        <div className="demo-workspace__section">
          <div className="demo-workspace__section-label">
            Project preview
          </div>

          {images.length > 0 ? (
            <div className="demo-workspace__preview">
              <img
                src={images[0]}
                alt={`${projectName} preview`}
                loading="eager"
              />
            </div>
          ) : (
            <div className="demo-workspace__empty">
              No project preview is available yet.
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="demo-workspace__gallery">
            <ProjectGallery
              images={images}
              projectName={projectName}
            />
          </div>
        )}
      </div>
    </section>
  );
}