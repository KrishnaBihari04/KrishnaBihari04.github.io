import type { APIRoute } from 'astro';
import { createAdminSession, setAdminSessionCookie } from '../../../lib/server/session';

const configuredEmail = (import.meta.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const configuredPassword = import.meta.env.ADMIN_PASSWORD ?? '';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const devFallbackAllowed = import.meta.env.DEV && (!configuredEmail || !configuredPassword);
    const isValidAdmin =
      (configuredEmail && configuredPassword && email === configuredEmail && password === configuredPassword) ||
      (devFallbackAllowed && email === 'admin@localhost' && password === 'admin');

    if (!isValidAdmin) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = createAdminSession(email);
    setAdminSessionCookie(cookies, session);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Unable to sign in.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
