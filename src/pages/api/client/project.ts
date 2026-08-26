import type { APIRoute } from 'astro';

import {
  getProjectPortalSession,
} from '../../../lib/server/session';

import {
  supabaseAdmin,
} from '../../../lib/server/supabase-admin';

type ProjectRow = {
  id: string;
  client_id: string;
  project_code: string;
  name: string;
  description: string | null;
  type: string | null;
  category: string | null;
  status: string | null;
  phase: string | null;
  progress: number | null;
  expected_launch: string | null;
  live_demo_url: string | null;
  images: unknown;
  created_at?: string;
  updated_at?: string;
};

type TimelineRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status:
    | 'completed'
    | 'active'
    | 'upcoming';
  timeline_date: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

type HoursRow = {
  id: string;
  project_id: string;
  hours_allocated: number | null;
  hours_used: number | null;
  updated_at?: string;
};

function json(
  body: unknown,
  status = 200,
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
}

function normalizeImages(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (image): image is string =>
      typeof image === 'string' &&
      image.trim().length > 0,
  );
}

export const GET: APIRoute = async ({
  cookies,
}) => {
  const session =
    getProjectPortalSession(cookies);

  if (!session) {
    return json(
      {
        success: false,
        message:
          'Project session is invalid or expired.',
      },
      401,
    );
  }

  if (!supabaseAdmin) {
    return json(
      {
        success: false,
        message:
          'Portal is not configured for production access.',
      },
      503,
    );
  }

  try {
    /*
     * The project ID comes from the signed,
     * httpOnly server session.
     *
     * The project code must match the same session.
     * Both values are therefore server-controlled.
     */
    const {
      data: projectData,
      error: projectError,
    } = await supabaseAdmin
      .from('projects')
      .select(
        [
          'id',
          'client_id',
          'project_code',
          'name',
          'description',
          'type',
          'category',
          'status',
          'phase',
          'progress',
          'expected_launch',
          'live_demo_url',
          'images',
          'created_at',
          'updated_at',
        ].join(', '),
      )
      .eq('id', session.projectId)
      .eq(
        'project_code',
        session.projectCode,
      )
      .maybeSingle();

    if (projectError || !projectData) {
      return json(
        {
          success: false,
          message:
            'The requested project workspace could not be found.',
        },
        403,
      );
    }

    const project =
      projectData as unknown as ProjectRow;

    /*
     * Timeline and hours are also scoped to the
     * exact project authorized by the session.
     */
    const [
      timelineResult,
      hoursResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('project_timeline')
        .select(
          [
            'id',
            'project_id',
            'title',
            'description',
            'status',
            'timeline_date',
            'sort_order',
            'created_at',
            'updated_at',
          ].join(', '),
        )
        .eq(
          'project_id',
          project.id,
        )
        .order('sort_order', {
          ascending: true,
        }),

      supabaseAdmin
        .from('project_hours')
        .select(
          [
            'id',
            'project_id',
            'hours_allocated',
            'hours_used',
            'updated_at',
          ].join(', '),
        )
        .eq(
          'project_id',
          project.id,
        )
        .maybeSingle(),
    ]);

    if (timelineResult.error) {
      return json(
        {
          success: false,
          message:
            'Unable to load project timeline.',
        },
        500,
      );
    }

    if (hoursResult.error) {
      return json(
        {
          success: false,
          message:
            'Unable to load project hours.',
        },
        500,
      );
    }

    const timeline =
      (timelineResult.data ?? []) as unknown as TimelineRow[];

    const hours =
      hoursResult.data as unknown as HoursRow | null;

    const progress = Math.min(
      Math.max(
        typeof project.progress === 'number'
          ? project.progress
          : 0,
        0,
      ),
      100,
    );

    return json({
      success: true,

      project: {
        id: project.id,

        /*
         * Kept in the database response for compatibility,
         * but it is not exposed as client-facing identity.
         */
        client_id: project.client_id,

        project_code:
          project.project_code
            .trim()
            .toUpperCase(),

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

        category:
          typeof project.category === 'string'
            ? project.category
            : 'web-development',

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

        progress,

        expected_launch:
          typeof project.expected_launch === 'string'
            ? project.expected_launch.trim()
            : '',

        live_demo_url:
          typeof project.live_demo_url === 'string' &&
          project.live_demo_url.trim().length > 0
            ? project.live_demo_url.trim()
            : null,

        images: normalizeImages(
          project.images,
        ),

        created_at: project.created_at,
        updated_at: project.updated_at,
      },

      timeline: timeline.map((item) => ({
        id: item.id,
        project_id: item.project_id,
        title: item.title,
        description:
          item.description ?? '',
        status: item.status,
        date:
          item.timeline_date ?? '',
        order: item.sort_order,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),

      hours: {
        id:
          hours?.id ??
          `hours-${project.id}`,

        project_id: project.id,

        hours_allocated: Math.max(
          hours?.hours_allocated ?? 0,
          0,
        ),

        hours_used: Math.max(
          hours?.hours_used ?? 0,
          0,
        ),

        updated_at: hours?.updated_at,
      },
    });
  } catch {
    return json(
      {
        success: false,
        message:
          'Unable to load the project workspace.',
      },
      500,
    );
  }
};

export const POST: APIRoute = () =>
  json(
    {
      error: 'Method not allowed.',
    },
    405,
  );

export const PUT: APIRoute = () =>
  json(
    {
      error: 'Method not allowed.',
    },
    405,
  );

export const DELETE: APIRoute = () =>
  json(
    {
      error: 'Method not allowed.',
    },
    405,
  );