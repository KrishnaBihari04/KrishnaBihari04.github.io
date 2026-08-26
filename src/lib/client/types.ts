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

  // Primary project identifier used by the portal.
  project_code: string;

  name: string;
  description: string;
  type: string;
  category: ProjectCategory;
  status: ClientStatus | string;
  phase: string;
  progress: number;
  expected_launch: string;
  live_demo_url?: string | null;

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
  /*
   * Temporary backwards compatibility.
   * Phase 3 will remove the client-level dependency
   * from the portal entirely.
   */
  client: ClientRecord;

  /*
   * Current primary project.
   * Phase 3 will make this the canonical project workspace.
   */
  project: ProjectRecord;

  /*
   * Kept temporarily for compatibility with the
   * existing scalable project structure.
   */
  projects: ProjectRecord[];

  timeline: TimelineRecord[];
  hours: ProjectHoursRecord;
};

/*
 * Temporary legacy client session.
 * This will be replaced by ProjectSession in auth.ts.
 */
export type ClientSession = {
  clientCode: string;
  clientId: string;
  company: string;
  expiresAt: number;
};

/*
 * New project-first portal session.
 *
 * This is the session model Phase 3 will use:
 *
 * PROJECT-2026-X7K9
 *       ↓
 * projectId
 *       ↓
 * secure session
 */
export type ProjectSession = {
  projectCode: string;
  projectId: string;
  expiresAt: number;
};

export const DEMO_CLIENT_CODE = 'DEMO-2026';

export const DEMO_PROJECT_CODE = 'PROJECT-2026-X7K9';

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