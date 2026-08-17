export type TimelineStatus = 'completed' | 'active' | 'upcoming';

export type ClientProfile = {
  name: string;
  company: string;
  initials: string;
  projectName: string;
  projectStatus: string;
  clientCode: string;
};

export type ProjectSummary = {
  name: string;
  client: string;
  type: string;
  status: string;
  phase: string;
  progress: number;
  expectedLaunch: string;
  description: string;
};

export type TimelineItem = {
  title: string;
  description: string;
  status: TimelineStatus;
  date: string;
};

export type ProjectHours = {
  used: number;
  allocated: number;
  remaining: number;
};

export const DEMO_CLIENT_CODE = 'DEMO-2026';

export const mockClient: ClientProfile = {
  name: 'Mila',
  company: 'WrapMotion',
  initials: 'WM',
  projectName: 'Website Redesign',
  projectStatus: 'In Development',
  clientCode: DEMO_CLIENT_CODE,
};

export const mockProject: ProjectSummary = {
  name: 'Website Redesign',
  client: 'WrapMotion',
  type: 'Website Development',
  status: 'In Development',
  phase: 'Development',
  progress: 68,
  expectedLaunch: 'September 2026',
  description:
    'A strategic redesign focused on premium positioning, stronger conversion flow, and a clearer product narrative across the full client journey.',
};

export const mockTimeline: TimelineItem[] = [
  {
    title: 'Discovery',
    description: 'Research, positioning, and requirements alignment.',
    status: 'completed',
    date: 'Mar 2026',
  },
  {
    title: 'Design',
    description: 'Wireframes, visual direction, and UX refinement.',
    status: 'completed',
    date: 'Apr 2026',
  },
  {
    title: 'Development',
    description: 'Build and integration of the upcoming client experience.',
    status: 'active',
    date: 'Current phase',
  },
  {
    title: 'Testing',
    description: 'QA, performance checks, and final polish.',
    status: 'upcoming',
    date: 'Jul 2026',
  },
  {
    title: 'Launch',
    description: 'Deployment, final review, and handoff.',
    status: 'upcoming',
    date: 'Sep 2026',
  },
];

export const mockHours: ProjectHours = {
  used: 21,
  allocated: 32,
  remaining: 11,
};
