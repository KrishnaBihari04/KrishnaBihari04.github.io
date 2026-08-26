import type { APIRoute } from 'astro';

import {
  DEMO_PROJECT_CODE,
} from '../../../lib/client/types';

import {
  supabaseAdmin,
} from '../../../lib/server/supabase-admin';

import {
  createProjectPortalSession,
  setProjectPortalSessionCookie,
} from '../../../lib/server/session';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      error: 'Method not allowed.',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

const demoProjectData = {
  id: 'demo-project-id',
  project_code: DEMO_PROJECT_CODE,
};

export const POST: APIRoute = async ({
  request,
  cookies,
}) => {
  try {
    const body = await request.json();

    const rawCode =
      typeof body?.projectCode === 'string'
        ? body.projectCode
        : '';

    const normalized = rawCode
      .trim()
      .toUpperCase();

    if (!normalized) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project code is required.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const demoEnabled =
      import.meta.env.DEV &&
      import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !==
        'false';

    /*
     * Development-only demo access.
     *
     * No client information is exposed or stored.
     */
    if (
      demoEnabled &&
      normalized === DEMO_PROJECT_CODE
    ) {
      const session =
        createProjectPortalSession(
          demoProjectData.id,
          demoProjectData.project_code,
        );

      setProjectPortalSessionCookie(
        cookies,
        session,
      );

      return new Response(
        JSON.stringify({
          success: true,
          project: demoProjectData,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Portal is not configured for production access.',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const {
      data: projectData,
      error: projectError,
    } = await supabaseAdmin
      .from('projects')
      .select('id, project_code')
      .eq('project_code', normalized)
      .maybeSingle();

    if (projectError || !projectData) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'That project code is invalid.',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const projectCode =
      typeof projectData.project_code === 'string'
        ? projectData.project_code
            .trim()
            .toUpperCase()
        : normalized;

    const session =
      createProjectPortalSession(
        projectData.id,
        projectCode,
      );

    setProjectPortalSessionCookie(
      cookies,
      session,
    );

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          id: projectData.id,
          project_code: projectCode,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          'Unable to validate the project code.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};