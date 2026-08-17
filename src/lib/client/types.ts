export type ClientStatus = 'active' | 'paused' | 'completed';
export type TimelineStatus = 'completed' | 'active' | 'upcoming';

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
  status: ClientStatus | string;
  phase: string;
  progress: number;
  expected_launch: string;
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
  project: ProjectRecord;
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
