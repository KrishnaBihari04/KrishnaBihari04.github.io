import type { ProjectCategory } from '../../lib/client/types';

export type ProjectCategoryConfig = {
  readonly label: string;
  readonly description: string;
  readonly stages: readonly string[];
  readonly focusAreas: readonly string[];
};

export const DEFAULT_PROJECT_CATEGORY_CONFIG: ProjectCategoryConfig = {
  label: 'Project',
  description:
    'Project workspace information and delivery progress.',
  stages: [
    'Planning',
    'Design',
    'Development',
    'Testing',
    'Launch',
  ],
  focusAreas: [
    'Project direction',
    'Development',
    'Quality assurance',
    'Delivery',
  ],
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

  'web-redesign': {
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

  demo: {
    label: 'Demo Workspace',
    description:
      'A demonstration project workspace used for testing, preview, and portal development.',
    stages: [
      'Discovery',
      'Design',
      'Development',
      'Testing',
      'Launch',
    ],
    focusAreas: [
      'Workspace preview',
      'Portal functionality',
      'Project progress',
      'Client experience',
    ],
  },
};

function normalizeCategoryKey(
  category?: string | null,
): ProjectCategory | null {
  if (!category?.trim()) {
    return null;
  }

  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');

  switch (normalized) {
    case 'web-development':
    case 'webdevelopment':
    case 'website-development':
    case 'website':
    case 'web-application':
      return 'web-development';

    case 'web-redesign':
    case 'redesign':
    case 'website-redesign':
    case 'web-redesign-project':
      return 'web-redesign';

    case 'saas':
    case 'saas-platform':
      return 'saas';

    case 'ai-tool':
    case 'aitool':
    case 'ai-application':
    case 'ai-product':
      return 'ai-tool';

    case 'ai-automation':
    case 'aiautomation':
    case 'automation':
    case 'ai-workflow':
      return 'ai-automation';

    case 'demo':
    case 'demo-workspace':
      return 'demo';

    default:
      return null;
  }
}

export function getProjectCategoryConfig(
  category?: string | null,
): ProjectCategoryConfig {
  const normalizedCategory =
    normalizeCategoryKey(category);

  if (!normalizedCategory) {
    return DEFAULT_PROJECT_CATEGORY_CONFIG;
  }

  return (
    PROJECT_CATEGORY_CONFIG[normalizedCategory] ??
    DEFAULT_PROJECT_CATEGORY_CONFIG
  );
}