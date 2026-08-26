import { supabase } from './supabase';

import { isDemoProjectCode } from './auth';

import type {
  ClientPortalData,
  ProjectHoursRecord,
  ProjectRecord,
  TimelineRecord,
} from './types';

import {
  DEMO_PROJECT_CODE,
  normalizeProjectCategory,
} from './types';

const fallbackProject: ProjectRecord = {
  id: 'demo-project-id',
  client_id: 'demo-client-id',
  project_code: DEMO_PROJECT_CODE,
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

function isDemoFallbackAllowed(
  projectCode: string,
): boolean {
  return (
    import.meta.env.DEV &&
    import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !==
      'false' &&
    isDemoProjectCode(projectCode)
  );
}

function getFallbackIfAllowed(
  projectCode: string,
): ClientPortalData | null {
  return isDemoFallbackAllowed(projectCode)
    ? fallbackPortalData
    : null;
}

async function fetchProjectByCode(
  projectCode: string,
): Promise<ProjectRecord | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_code', projectCode)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const project = data as ProjectRecord;

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

    category: normalizeProjectCategory(
      project.category,
    ),

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
        : projectCode,
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

async function fetchTimeline(
  projectId: string,
): Promise<TimelineRecord[] | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('project_timeline')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', {
      ascending: true,
    });

  if (error) {
    return null;
  }

  return mapTimeline(data ?? []);
}

async function fetchHours(
  projectId: string,
): Promise<ProjectHoursRecord | null> {
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from('project_hours')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  return (
    (data as ProjectHoursRecord | null) ??
    null
  );
}

function createDefaultHours(
  projectId: string,
): ProjectHoursRecord {
  return {
    id: crypto.randomUUID(),
    project_id: projectId,
    hours_allocated: 0,
    hours_used: 0,
  };
}

export async function fetchPortalDataByProjectCode(
  projectCode: string,
): Promise<ClientPortalData | null> {
  const normalized = projectCode
    .trim()
    .toUpperCase();

  if (!normalized) {
    return null;
  }

  if (!supabase) {
    return getFallbackIfAllowed(normalized);
  }

  const project = await fetchProjectByCode(
    normalized,
  );

  if (!project) {
    return getFallbackIfAllowed(normalized);
  }

  const [timeline, hours] = await Promise.all([
    fetchTimeline(project.id),
    fetchHours(project.id),
  ]);

  if (!timeline) {
    return getFallbackIfAllowed(normalized);
  }

  return {
    project,
    timeline,
    hours:
      hours ?? createDefaultHours(project.id),
  };
}

export function getFallbackPortalData(): ClientPortalData {
  return fallbackPortalData;
}