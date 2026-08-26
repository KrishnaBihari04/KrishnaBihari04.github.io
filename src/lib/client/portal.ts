import type {
  ClientPortalData,
  ProjectHoursRecord,
  ProjectRecord,
  TimelineRecord,
} from './types';

const fallbackProject: ProjectRecord = {
  id: 'demo-project-id',
  client_id: 'demo-client-id',
  project_code: 'PROJECT-2026-X7K9',
  name: 'Website Redesign',
  description:
    'A sanitized project demonstration showing progress, milestones, and delivery status.',
  type: 'Web Application',
  category: 'web-development',
  status: 'In Development',
  phase: 'Development',
  progress: 68,
  expected_launch: '',
  images: [],
  live_demo_url: null,
};

const fallbackPortalData: ClientPortalData = {
  project: fallbackProject,

  timeline: [
    {
      id: 'tl-1',
      project_id: 'demo-project-id',
      title: 'Discovery',
      description:
        'Project discovery, requirements and initial direction.',
      status: 'completed',
      date: '',
      order: 1,
    },
    {
      id: 'tl-2',
      project_id: 'demo-project-id',
      title: 'Design',
      description:
        'Visual direction, layout and interface design.',
      status: 'completed',
      date: '',
      order: 2,
    },
    {
      id: 'tl-3',
      project_id: 'demo-project-id',
      title: 'Development',
      description:
        'Implementation of the application and interactive experience.',
      status: 'active',
      date: '',
      order: 3,
    },
    {
      id: 'tl-4',
      project_id: 'demo-project-id',
      title: 'Testing',
      description:
        'Final testing, refinement and responsive QA.',
      status: 'upcoming',
      date: '',
      order: 4,
    },
    {
      id: 'tl-5',
      project_id: 'demo-project-id',
      title: 'Launch',
      description:
        'Production deployment and final delivery.',
      status: 'upcoming',
      date: '',
      order: 5,
    },
  ],

  hours: {
    id: 'hours-1',
    project_id: 'demo-project-id',
    hours_allocated: 0,
    hours_used: 0,
  },
};

function getFallbackPortalData(): ClientPortalData | null {
  const demoEnabled =
    import.meta.env.DEV &&
    import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !== 'false';

  return demoEnabled ? fallbackPortalData : null;
}

function normalizeProject(
  project: ProjectRecord,
): ProjectRecord {
  return {
    ...project,

    name:
      typeof project.name === 'string' &&
      project.name.trim().length > 0
        ? project.name.trim()
        : 'Project',

    description:
      typeof project.description === 'string'
        ? project.description.trim()
        : '',

    type:
      typeof project.type === 'string' &&
      project.type.trim().length > 0
        ? project.type.trim()
        : 'Project',

    status:
      typeof project.status === 'string' &&
      project.status.trim().length > 0
        ? project.status.trim()
        : 'Active',

    phase:
      typeof project.phase === 'string' &&
      project.phase.trim().length > 0
        ? project.phase.trim()
        : 'Planning',

    progress: Math.min(
      Math.max(
        typeof project.progress === 'number'
          ? project.progress
          : 0,
        0,
      ),
      100,
    ),

    expected_launch:
      typeof project.expected_launch === 'string'
        ? project.expected_launch.trim()
        : '',

    images: Array.isArray(project.images)
      ? project.images.filter(
          (image): image is string =>
            typeof image === 'string' &&
            image.trim().length > 0,
        )
      : [],

    live_demo_url:
      typeof project.live_demo_url === 'string' &&
      project.live_demo_url.trim().length > 0
        ? project.live_demo_url.trim()
        : null,

    project_code:
      typeof project.project_code === 'string'
        ? project.project_code.trim().toUpperCase()
        : '',
  };
}

function mapTimeline(
  timelineData: Array<{
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: TimelineRecord['status'];
    timeline_date: string | null;
    sort_order: number;
  }>,
): TimelineRecord[] {
  return timelineData.map((item) => ({
    id: item.id,
    project_id: item.project_id,
    title: item.title,
    description: item.description ?? '',
    status: item.status,
    date: item.timeline_date ?? '',
    order: item.sort_order,
  }));
}

function normalizePortalData(
  data: ClientPortalData,
): ClientPortalData {
  return {
    project: normalizeProject(data.project),

    timeline: mapTimeline(
      data.timeline.map((item) => ({
        id: item.id,
        project_id: item.project_id,
        title: item.title,
        description: item.description,
        status: item.status,
        timeline_date: item.date,
        sort_order: item.order,
      })),
    ),

    hours: {
      id: data.hours.id,
      project_id: data.hours.project_id,
      hours_allocated:
        typeof data.hours.hours_allocated === 'number'
          ? Math.max(data.hours.hours_allocated, 0)
          : 0,
      hours_used:
        typeof data.hours.hours_used === 'number'
          ? Math.max(data.hours.hours_used, 0)
          : 0,
      updated_at: data.hours.updated_at,
    },
  };
}

/**
 * Loads the authenticated project's workspace.
 *
 * Authorization is NOT handled in the browser.
 * The API route reads the signed httpOnly project session
 * and determines which project may be returned.
 */
export async function fetchPortalDataByProjectSession(): Promise<ClientPortalData | null> {
  try {
    const response = await fetch(
      '/api/client/project',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return null;
      }

      throw new Error(
        `Project workspace request failed with status ${response.status}.`,
      );
    }

    const data =
      (await response.json()) as Partial<ClientPortalData>;

    if (
      !data?.project ||
      !Array.isArray(data.timeline) ||
      !data.hours
    ) {
      throw new Error(
        'Invalid project workspace response.',
      );
    }

    return normalizePortalData(
      data as ClientPortalData,
    );
  } catch {
    return getFallbackPortalData();
  }
}

/**
 * Temporary fallback helper used by local development
 * and components that need demo data.
 */
export function getFallbackPortalDataSafe(): ClientPortalData | null {
  return getFallbackPortalData();
}