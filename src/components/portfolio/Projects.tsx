import { useState } from 'react';

type ProjectStatus = 'done' | 'in-progress';
type FilterValue = 'all' | ProjectStatus;

type Project = {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  outcome: string;
  architecture: string[];
  stack: string[];
  link: string;
  accent: string;
  live?: string;
  status: ProjectStatus;
  images: string[];
};

const projects: Project[] = [
  {
    id: '01',
    category: 'Full-Stack Web App',
    title: 'Budget Buddy',
    tagline: 'Personal finance manager with a premium dashboard, smart categorisation, and a full reporting engine.',
    description:
      'End-to-end finance platform built with Symfony 6 and Chart.js. Handles transaction management, budget categorisation, role-based user and admin access, and rich data visualisation — all delivered through a clean, premium interface. Designed with real users in mind: fast, secure, and intuitive.',
    outcome: 'Full production deployment with secure authentication, real-time reporting, and granular admin controls.',
    architecture: ['Symfony 6', 'Twig', 'Doctrine ORM', 'Chart.js', 'MySQL', 'REST API', 'Role-based access control'],
    stack: ['Symfony', 'PHP', 'Twig', 'Chart.js', 'MySQL', 'Doctrine ORM'],
    link: 'https://github.com/kasbihari/Budget-Buddy',
    accent: 'var(--sand-light)',
    status: 'done',
    images: [
      '/projects/budgetbuddy-1.png',
      '/projects/budgetbuddy-2.png',
      '/projects/budgetbuddy-3.png',
    ],
  },
  {
    id: '02',
    category: 'Full-Stack Data Platform',
    title: 'SDG Dashboard',
    tagline: 'Real-time UN Sustainable Development Goals tracker with live KPI visualisation and an AI-powered insights engine.',
    description:
      'Comprehensive data platform built with Next.js 14 and TypeScript. Tracks live SDG KPIs through interactive charts, integrates an OpenAI-powered chatbot for contextual analysis, includes full user authentication, and supports CSV data export — all backed by MySQL with Prisma ORM. Built to demonstrate how AI can make complex data accessible and actionable.',
    outcome: 'Complete full-stack system: authentication, AI chatbot, live KPI tracking, and a full data export pipeline.',
    architecture: ['Next.js 14', 'TypeScript', 'Prisma ORM', 'MySQL', 'OpenAI API', 'NextAuth', 'Recharts'],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'MySQL', 'OpenAI API', 'NextAuth'],
    link: 'https://github.com/kasbihari/SDG-Dashboard',
    accent: 'var(--forest-bright)',
    status: 'done',
    images: [
      '/projects/sdg-1.png',
      '/projects/sdg-2.png',
      '/projects/sdg-3.png',
    ],
  },
  {
    id: '03',
    category: 'AI Voice & Outreach Automation',
    title: 'OutreachBot',
    tagline: 'AI-driven outbound call and SMS automation — personalised at scale, powered by dynamic conversation scripts.',
    description:
      'Node.js and React platform that ingests contact lists from CSV and XLS files and triggers personalised outbound calls and SMS messages via MessageBird. Integrates OpenAI to generate dynamic, context-aware conversation scripts per contact. Tracks delivery rates and response metrics through a live reporting dashboard. Built to demonstrate real-world AI automation applied to sales and outreach workflows.',
    outcome: 'Automated multi-channel outreach pipeline with AI-generated scripts and delivery reporting — active development.',
    architecture: ['Node.js', 'React', 'MessageBird API', 'OpenAI API', 'CSV/XLS parsing', 'REST API'],
    stack: ['Node.js', 'React', 'MessageBird', 'OpenAI API', 'TypeScript'],
    link: 'https://github.com/kasbihari',
    accent: 'var(--muted-light)',
    status: 'in-progress',
    images: [
      '/projects/outreach-1.png',
      '/projects/outreach-2.png',
      '/projects/outreach-3.png',
    ],
  },
];

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Shipped', value: 'done' },
  { label: 'In Progress', value: 'in-progress' },
];

function StatusBadge({ status }: { status: ProjectStatus }) {
  const isDone = status === 'done';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.68rem',
        fontWeight: 500,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        padding: '0.2rem 0.55rem',
        borderRadius: '3px',
        border: `1px solid ${isDone ? 'rgba(100,200,130,0.25)' : 'rgba(200,160,80,0.25)'}`,
        color: isDone ? 'var(--forest-bright)' : '#c8a050',
        background: isDone ? 'rgba(100,200,130,0.06)' : 'rgba(200,160,80,0.06)',
      }}
    >
      <span
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: isDone ? 'var(--forest-bright)' : '#c8a050',
        }}
      />
      {isDone ? 'Shipped' : 'In Progress'}
    </span>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>('all');

  const [slideIndexes, setSlideIndexes] = useState<Record<string, number>>({});

  const filtered =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.status === filter);

  const nextSlide = (projectId: string, total: number) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % total,
    }));
  };

  const prevSlide = (projectId: string, total: number) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]:
        ((prev[projectId] || 0) - 1 + total) % total,
    }));
  };

  return (
    <section id="projects" className="section-padding">
      <div className="container-main">

        {/* Header */}
        <div
          style={{
            marginBottom: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p className="section-label">Selected Work</p>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 500,
                color: 'var(--soft-white)',
                lineHeight: 1.05,
              }}
            >
              Products I've{' '}
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontStyle: 'italic',
                  color: 'var(--sand-light)',
                }}
              >
                built & shipped.
              </span>
            </h2>
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {FILTERS.map(({ label, value }) => {
              const active = filter === value;

              return (
                <button
                  key={value}
                  onClick={() => {
                    setFilter(value);
                    setActiveProject(null);
                  }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    border: active
                      ? '1px solid rgba(255,255,255,0.16)'
                      : '1px solid rgba(255,255,255,0.06)',
                    background: active
                      ? 'rgba(255,255,255,0.08)'
                      : 'transparent',
                    color: active
                      ? 'var(--soft-white)'
                      : 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((project) => {
            const isOpen = activeProject === project.id;

            const currentSlide = slideIndexes[project.id] || 0;

            return (
              <div key={project.id}>
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                />

                <div
                  onClick={() =>
                    setActiveProject(
                      isOpen ? null : project.id
                    )
                  }
                  style={{
                    padding: '2rem 0',
                    cursor: 'pointer',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                  }}
                >
                  <div>

                    {/* Top */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: project.accent,
                          margin: 0,
                        }}
                      >
                        {project.category}
                      </p>

                      <StatusBadge status={project.status} />
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                        color: 'var(--soft-white)',
                        marginBottom: '0.4rem',
                        lineHeight: 1.1,
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    <p
                      style={{
                        color: 'var(--muted-light)',
                        maxWidth: '620px',
                        lineHeight: 1.7,
                      }}
                    >
                      {project.tagline}
                    </p>

                    {/* Expanded */}
                    <div
                      style={{
                        overflow: 'hidden',
                        maxHeight: isOpen ? '3000px' : '0',
                        opacity: isOpen ? 1 : 0,
                        transition:
                          'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <div style={{ paddingTop: '2rem' }}>

                        {/* SLIDESHOW */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            marginBottom: '2rem',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={project.images[currentSlide]}
                            alt={project.title}
                            style={{
                              width: '100%',
                              height: '520px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />

                          {/* Prev */}
                          <button
                            onClick={() =>
                              prevSlide(
                                project.id,
                                project.images.length
                              )
                            }
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '1rem',
                              transform: 'translateY(-50%)',
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(0,0,0,0.45)',
                              color: 'white',
                              cursor: 'pointer',
                              backdropFilter: 'blur(8px)',
                              fontSize: '1rem',
                            }}
                          >
                            ←
                          </button>

                          {/* Next */}
                          <button
                            onClick={() =>
                              nextSlide(
                                project.id,
                                project.images.length
                              )
                            }
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '1rem',
                              transform: 'translateY(-50%)',
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(0,0,0,0.45)',
                              color: 'white',
                              cursor: 'pointer',
                              backdropFilter: 'blur(8px)',
                              fontSize: '1rem',
                            }}
                          >
                            →
                          </button>

                          {/* Dots */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '1rem',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              gap: '0.5rem',
                            }}
                          >
                            {project.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  setSlideIndexes((prev) => ({
                                    ...prev,
                                    [project.id]: index,
                                  }))
                                }
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background:
                                    currentSlide === index
                                      ? 'white'
                                      : 'rgba(255,255,255,0.4)',
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            color: 'var(--muted-light)',
                            lineHeight: 1.8,
                            marginBottom: '1.5rem',
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Stack */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '2rem',
                          }}
                        >
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                padding: '0.3rem 0.7rem',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                color: 'var(--muted-light)',
                                fontFamily: 'JetBrains Mono, monospace',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Buttons */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.8rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="btn-secondary"
                          >
                            GitHub
                          </a>

                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="btn-primary"
                            >
                              Live Site
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plus Icon */}
                  <div
                    style={{
                      transform: isOpen
                        ? 'rotate(45deg)'
                        : 'rotate(0deg)',
                      transition: '0.3s',
                      color: 'var(--muted)',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
