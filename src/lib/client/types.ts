export type ClientStatus =
  | 'active'
  | 'paused'
  | 'completed';

export type TimelineStatus =
  | 'completed'
  | 'active'
  | 'upcoming';

export type ProjectCategory =
  | 'web-development'
  | 'redesign'
  | 'saas'
  | 'ai-tool'
  | 'ai-automation';

export type ClientRecord = {
  id: string;
  name: string;
  company: string;
  client_code: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectRecord = {
  id: string;
  client_id: string;
  name: string;
  description: string;
  type: string;
  category: ProjectCategory;
  status: ClientStatus | string;
  phase: string;
  progress: number;
  expected_launch: string;

  // Client-visible project media.
  images: string[];

  created_at?: string;
  updated_at?: string;
};

export type TimelineRecord = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TimelineStatus;
  date: string;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProjectHoursRecord = {
  id: string;
  project_id: string;
  hours_allocated: number;
  hours_used: number;
  updated_at?: string;
};

export type ClientPortalData = {
  client: ClientRecord;

  // Backwards-compatible primary project.
  // Phase 3 will remove the need for this field.
  project: ProjectRecord;

  // New scalable project collection.
  projects: ProjectRecord[];

  timeline: TimelineRecord[];

  hours: ProjectHoursRecord;
};

export type ClientSession = {
  clientCode: string;
  clientId: string;
  company: string;
  expiresAt: number;
};

export const DEMO_CLIENT_CODE = 'DEMO-2026';

export function normalizeProjectCategory(
  value?: string | null,
): ProjectCategory {
  const normalized = value?.trim().toLowerCase();

  switch (normalized) {
    case 'web-development':
    case 'web development':
    case 'website development':
    case 'website':
    case 'web application':
      return 'web-development';

    case 'redesign':
    case 'website redesign':
    case 'web redesign':
      return 'redesign';

    case 'saas':
    case 'saas platform':
      return 'saas';

    case 'ai-tool':
    case 'ai tool':
    case 'ai application':
      return 'ai-tool';

    case 'ai-automation':
    case 'ai automation':
    case 'automation':
    case 'ai workflow':
      return 'ai-automation';

    default:
      return 'web-development';
  }
}