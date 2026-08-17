import type { APIRoute } from 'astro';
import { clearAdminSessionCookie } from '../../../lib/server/session';

export const POST: APIRoute = ({ cookies }) => {
  clearAdminSessionCookie(cookies);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
