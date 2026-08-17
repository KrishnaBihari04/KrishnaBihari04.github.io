import { supabase } from './supabase';
import { isDemoClientCode } from './auth';
import type { ClientPortalData, ClientRecord, ProjectHoursRecord, ProjectRecord, TimelineRecord } from './types';
import { DEMO_CLIENT_CODE } from './types';

const fallbackPortalData: ClientPortalData = {
  client: {
    id: 'demo-client-id',
    name: 'Mila',
    company: 'WrapMotion',
    client_code: DEMO_CLIENT_CODE,
  },
  project: {
    id: 'demo-project-id',
    client_id: 'demo-client-id',
    name: 'Website Redesign',
    description: 'A strategic redesign focused on premium positioning, stronger conversion flow, and a clearer product narrative across the full client journey.',
    type: 'Website Development',
    status: 'In Development',
    phase: 'Development',
    progress: 68,
    expected_launch: 'September 2026',
  },
  timeline: [
    { id: 'tl-1', project_id: 'demo-project-id', title: 'Discovery', description: 'Research, positioning, and requirements alignment.', status: 'completed', date: 'Mar 2026', order: 1 },
    { id: 'tl-2', project_id: 'demo-project-id', title: 'Design', description: 'Wireframes, visual direction, and UX refinement.', status: 'completed', date: 'Apr 2026', order: 2 },
    { id: 'tl-3', project_id: 'demo-project-id', title: 'Development', description: 'Build and integration of the upcoming client experience.', status: 'active', date: 'Current phase', order: 3 },
    { id: 'tl-4', project_id: 'demo-project-id', title: 'Testing', description: 'QA, performance checks, and final polish.', status: 'upcoming', date: 'Jul 2026', order: 4 },
    { id: 'tl-5', project_id: 'demo-project-id', title: 'Launch', description: 'Deployment, final review, and handoff.', status: 'upcoming', date: 'Sep 2026', order: 5 },
  ],
  hours: {
    id: 'hours-1',
    project_id: 'demo-project-id',
    hours_allocated: 32,
    hours_used: 21,
  },
};

export async function fetchPortalDataByClientCode(clientCode: string): Promise<ClientPortalData | null> {
  const normalized = clientCode.trim().toUpperCase();
  if (!normalized) return null;

  if (isDemoClientCode(normalized)) {
    return fallbackPortalData;
  }

  if (!supabase) {
    return null;
  }

  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('client_code', normalized)
    .maybeSingle();

  if (clientError || !clientData) {
    return null;
  }

  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientData.id)
    .maybeSingle();

  if (projectError || !projectData) {
    return null;
  }

  const [{ data: timelineData }, { data: hoursData }] = await Promise.all([
    supabase
      .from('project_timeline')
      .select('*')
      .eq('project_id', projectData.id)
      .order('order', { ascending: true }),
    supabase
      .from('project_hours')
      .select('*')
      .eq('project_id', projectData.id)
      .maybeSingle(),
  ]);

  return {
    client: clientData as ClientRecord,
    project: projectData as ProjectRecord,
    timeline: (timelineData ?? []) as TimelineRecord[],
    hours: (hoursData ?? {
      id: crypto.randomUUID(),
      project_id: projectData.id,
      hours_allocated: 0,
      hours_used: 0,
    }) as ProjectHoursRecord,
  };
}

export function getFallbackPortalData(): ClientPortalData {
  return fallbackPortalData;
}
