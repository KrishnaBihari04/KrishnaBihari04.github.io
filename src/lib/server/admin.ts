import { supabaseAdmin } from './supabase-admin';

export type AdminDashboardSummary = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  totalHoursUsed: number;
};

const emptySummary: AdminDashboardSummary = {
  totalClients: 0,
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  averageProgress: 0,
  totalHoursUsed: 0,
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  if (!supabaseAdmin) {
    return emptySummary;
  }

  try {
    const [{ data: clients = [], error: clientsError }, { data: projects = [], error: projectsError }, { data: hours = [], error: hoursError }] = await Promise.all([
      supabaseAdmin.from('clients').select('id'),
      supabaseAdmin.from('projects').select('*'),
      supabaseAdmin.from('project_hours').select('hours_used'),
    ]);

    if (clientsError || projectsError || hoursError) {
      return emptySummary;
    }

    const projectCount = projects.length;
    const activeProjects = projects.filter((project) => {
      const status = String(project.status ?? '').toLowerCase();
      return status.includes('active') || status.includes('development') || status.includes('in progress');
    }).length;
    const completedProjects = projects.filter((project) => {
      const status = String(project.status ?? '').toLowerCase();
      return status.includes('complete') || status.includes('finished') || status.includes('closed');
    }).length;
    const averageProgress = projectCount > 0
      ? Math.round(projects.reduce((sum, project) => sum + Number(project.progress ?? 0), 0) / projectCount)
      : 0;
    const totalHoursUsed = hours.reduce((sum, row) => sum + Number(row.hours_used ?? 0), 0);

    return {
      totalClients: clients.length,
      totalProjects: projectCount,
      activeProjects,
      completedProjects,
      averageProgress,
      totalHoursUsed,
    };
  } catch {
    return emptySummary;
  }
}
