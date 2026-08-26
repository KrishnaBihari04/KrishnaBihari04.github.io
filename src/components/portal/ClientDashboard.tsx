import { useEffect, useState } from "react";

import ProjectGallery from "./ProjectGallery";
import ProjectOverview from "./ProjectOverview";
import ProjectProgress from "./ProjectProgress";
import ProjectTimeline from "./ProjectTimeline";
import ProjectHours from "./ProjectHours";
import ProjectCategoryFocus from "./ProjectCategoryFocus";

import { clearProjectSession, getProjectSession } from "../../lib/client/auth";

import { fetchPortalDataByProjectCode } from "../../lib/client/portal";

import type { ClientPortalData } from "../../lib/client/types";

export default function ClientDashboard() {
  const [portalData, setPortalData] = useState<ClientPortalData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const session = getProjectSession();

    if (!session) {
      setLoading(false);
      setError("Your project session has expired. Please sign in again.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchPortalDataByProjectCode(session.projectCode);

        if (!data) {
          setError("We could not load this project workspace at the moment.");
          return;
        }

        setPortalData(data);
      } catch {
        setError("We could not load this project workspace at the moment.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [retryKey]);

  const handleLogout = async () => {
    clearProjectSession();

    try {
      await fetch("/api/client/logout", {
        method: "POST",
      });
    } catch {
      // Ignore API errors; local session is already cleared.
    }

    window.location.href = "/client";
  };

  const handleRetry = () => {
    setPortalData(null);
    setError("");
    setLoading(true);
    setRetryKey((value) => value + 1);
  };

  if (loading) {
    return (
      <>
        <style>{`
          .portal-loading {
            min-height: 100svh;
            display: grid;
            place-items: center;
            padding: 1rem;
          }

          .portal-loading-card {
            width: min(100%, 760px);
            padding: clamp(1.25rem, 4vw, 2rem);
            border: 1px solid var(--border-mid);
            border-radius: 18px;
            background: rgba(10, 10, 10, 0.8);
            box-shadow: 0 20px 55px rgba(0, 0, 0, 0.2);
          }

          .portal-loading-label {
            margin-bottom: 1rem;
            font-size: 0.68rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--sand);
          }

          .portal-loading-track {
            width: 100%;
            height: 10px;
            margin-bottom: 1rem;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.06);
          }

          .portal-loading-fill {
            width: 58%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(
              90deg,
              var(--forest-bright),
              var(--sand-light)
            );
            animation: portal-loading 1.4s ease-in-out infinite;
          }

          .portal-loading-copy {
            color: var(--muted);
            line-height: 1.8;
          }

          @keyframes portal-loading {
            0% {
              transform: translateX(-12%);
            }

            50% {
              transform: translateX(20%);
            }

            100% {
              transform: translateX(65%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .portal-loading-fill {
              animation: none;
            }
          }
        `}</style>

        <main className="portal-loading">
          <div className="portal-loading-card">
            <div className="portal-loading-label">Loading</div>

            <div className="portal-loading-track">
              <div className="portal-loading-fill" />
            </div>

            <div className="portal-loading-copy">
              Authenticating and loading your project workspace…
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!portalData) {
    return (
      <>
        <style>{`
          .portal-error {
            min-height: 100svh;
            display: grid;
            place-items: center;
            padding: 1rem;
          }

          .portal-error-card {
            width: min(100%, 720px);
            padding: clamp(1.25rem, 4vw, 2rem);
            border: 1px solid var(--border-mid);
            border-radius: 18px;
            background: rgba(10, 10, 10, 0.8);
            box-shadow: 0 20px 55px rgba(0, 0, 0, 0.2);
          }

          .portal-error-title {
            margin-bottom: 0.75rem;
            color: var(--soft-white);
            font-size: clamp(1.3rem, 3vw, 1.5rem);
            line-height: 1.25;
          }

          .portal-error-copy {
            color: var(--muted);
            line-height: 1.8;
          }

          .portal-error-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin-top: 1.25rem;
          }

          .portal-error-action {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          @media (max-width: 520px) {
            .portal-error-actions {
              flex-direction: column;
            }

            .portal-error-action {
              width: 100%;
            }
          }
        `}</style>

        <main className="portal-error">
          <div className="portal-error-card">
            <div className="portal-error-title">
              Unable to open project workspace
            </div>

            <div className="portal-error-copy">
              {error || "Something went wrong while loading this project."}
            </div>

            <div className="portal-error-actions">
              <button
                type="button"
                className="btn-secondary portal-error-action"
                onClick={handleRetry}
              >
                Try again
              </button>

              <a href="/client" className="btn-secondary portal-error-action">
                Back to project login
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  const project = portalData.project;
  const hours = portalData.hours;

  const projectImages = Array.isArray(project.images) ? project.images : [];

  const projectCode = project.project_code?.trim() || "Project";

  return (
    <>
      <style>{`
        .portal-dashboard {
          width: 100%;
          min-height: 100svh;
          padding:
            clamp(1rem, 3vw, 2rem)
            clamp(0.85rem, 3vw, 1.25rem)
            4rem;
        }

        .portal-dashboard__container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .portal-dashboard__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
          padding:
            clamp(1rem, 2.5vw, 1.2rem)
            clamp(1rem, 2.5vw, 1.25rem);
          border: 1px solid var(--border-mid);
          border-radius: 18px;
          background: rgba(10, 10, 10, 0.78);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14);
        }

        .portal-dashboard__identity {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .portal-dashboard__avatar {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid var(--border-mid);
          background: rgba(200, 184, 154, 0.08);
          color: var(--sand-light);
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.03em;
        }

        .portal-dashboard__identity-copy {
          min-width: 0;
        }

        .portal-dashboard__eyebrow {
          margin-bottom: 0.18rem;
          overflow: hidden;
          color: var(--sand);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .portal-dashboard__title {
          margin: 0;
          color: var(--soft-white);
          font-size: clamp(1.45rem, 4vw, 2.25rem);
          line-height: 1.08;
          overflow-wrap: anywhere;
        }

        .portal-dashboard__project-code {
          margin-top: 0.3rem;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          overflow-wrap: anywhere;
        }

        .portal-dashboard__logout {
          flex: 0 0 auto;
          min-height: 44px;
          min-width: 90px;
        }

        .portal-dashboard__primary-grid,
        .portal-dashboard__secondary-grid {
          display: grid;
          gap: 1.25rem;
        }

        .portal-dashboard__primary-grid {
          grid-template-columns:
            minmax(0, 1.4fr)
            minmax(260px, 0.9fr);
          margin-bottom: 1.25rem;
        }

        .portal-dashboard__secondary-grid {
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(260px, 0.8fr);
        }

        .portal-dashboard__gallery,
        .portal-dashboard__category-focus {
          margin-bottom: 1.25rem;
        }

        @media (max-width: 920px) {
          .portal-dashboard__primary-grid,
          .portal-dashboard__secondary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .portal-dashboard {
            padding-inline: 0.85rem;
            padding-bottom: 2.5rem;
          }

          .portal-dashboard__header {
            align-items: stretch;
            flex-direction: column;
            gap: 1rem;
          }

          .portal-dashboard__identity {
            width: 100%;
          }

          .portal-dashboard__logout {
            width: 100%;
          }

          .portal-dashboard__primary-grid,
          .portal-dashboard__secondary-grid {
            gap: 0.85rem;
          }

          .portal-dashboard__gallery,
          .portal-dashboard__category-focus {
            margin-bottom: 0.85rem;
          }
        }

        @media (max-width: 430px) {
          .portal-dashboard__avatar {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }

          .portal-dashboard__identity {
            gap: 0.7rem;
          }

          .portal-dashboard__eyebrow {
            font-size: 0.58rem;
          }

          .portal-dashboard__title {
            font-size: clamp(1.3rem, 7vw, 1.75rem);
          }

          .portal-dashboard__project-code {
            font-size: 0.6rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="portal-dashboard">
        <div className="portal-dashboard__container">
          <header data-reveal className="portal-dashboard__header">
            <div className="portal-dashboard__identity">
              <div className="portal-dashboard__avatar">PW</div>

              <div className="portal-dashboard__identity-copy">
                <div className="portal-dashboard__eyebrow">
                  Project workspace
                </div>

                <h1 className="portal-dashboard__title">{project.name}</h1>

                <div className="portal-dashboard__project-code">
                  {projectCode}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary portal-dashboard__logout"
              style={{
                background: "transparent",
                border: "1px solid var(--border-mid)",
                color: "var(--soft-white)",
              }}
            >
              Log out
            </button>
          </header>

          <div className="portal-dashboard__primary-grid">
            <ProjectOverview
              project={{
                name: project.name,
                category: project.category,
                type: project.type,
                status: project.status,
                phase: project.phase,
                progress: project.progress,
                expectedLaunch: project.expected_launch,
                description: project.description,
                liveDemoUrl: project.live_demo_url,
              }}
            />

            <ProjectProgress
              progress={project.progress}
              phase={project.phase}
              status={project.status}
              category={project.category}
            />
          </div>

          <div className="portal-dashboard__gallery">
            <ProjectGallery images={projectImages} projectName={project.name} />
          </div>

          <div className="portal-dashboard__category-focus">
            <ProjectCategoryFocus category={project.category} />
          </div>

          <div className="portal-dashboard__secondary-grid">
            <ProjectTimeline
              items={portalData.timeline.map((item) => ({
                title: item.title,
                description: item.description,
                status: item.status,
                date: item.date,
              }))}
            />

            <ProjectHours
              hours={{
                used: hours.hours_used,
                allocated: hours.hours_allocated,
                remaining: Math.max(
                  hours.hours_allocated - hours.hours_used,
                  0,
                ),
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
