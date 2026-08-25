import type { ProjectCategory } from '../../lib/client/types';

export type ProjectCategoryConfig = {
  readonly label: string;
  readonly description: string;
  readonly stages: readonly string[];
  readonly focusAreas: readonly string[];
};

export const PROJECT_CATEGORY_CONFIG: Record<
  ProjectCategory,
  ProjectCategoryConfig
> = {
  'web-development': {
    label: 'Web Development',
    description:
      'A custom digital experience built from the ground up.',
    stages: [
      'Discovery',
      'Design',
      'Development',
      'Testing',
      'Launch',
    ],
    focusAreas: [
      'Interface & experience',
      'Frontend development',
      'Backend & integrations',
      'Quality assurance',
    ],
  },

  redesign: {
    label: 'Web Redesign',
    description:
      'A redesigned digital experience focused on clarity, performance, and conversion.',
    stages: [
      'Audit',
      'Direction',
      'Redesign',
      'Development',
      'Launch',
    ],
    focusAreas: [
      'Current-site analysis',
      'Visual direction',
      'Experience redesign',
      'Performance & QA',
    ],
  },

  saas: {
    label: 'SaaS',
    description:
      'A software product developed around a scalable product experience.',
    stages: [
      'Product',
      'Design',
      'Development',
      'Testing',
      'Launch',
    ],
    focusAreas: [
      'Product experience',
      'Application development',
      'Data & infrastructure',
      'Testing & release',
    ],
  },

  'ai-tool': {
    label: 'AI Tool',
    description:
      'An intelligent software product built around AI-powered capabilities.',
    stages: [
      'Concept',
      'AI Integration',
      'Product',
      'Testing',
      'Release',
    ],
    focusAreas: [
      'AI functionality',
      'Product experience',
      'Model integration',
      'Evaluation & testing',
    ],
  },

  'ai-automation': {
    label: 'AI Automation',
    description:
      'An automated workflow designed to reduce manual work and improve operational efficiency.',
    stages: [
      'Workflow',
      'AI Agent',
      'Integrations',
      'Testing',
      'Deployment',
    ],
    focusAreas: [
      'Workflow design',
      'AI agent behaviour',
      'System integrations',
      'Monitoring & reliability',
    ],
  },
};