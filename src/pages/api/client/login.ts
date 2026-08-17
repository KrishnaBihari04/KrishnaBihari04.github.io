import type { APIRoute } from 'astro';
import { DEMO_CLIENT_CODE } from '../../../lib/client/types';
import { supabaseAdmin } from '../../../lib/server/supabase-admin';
import { createClientPortalSession, setClientPortalSessionCookie } from '../../../lib/server/session';

export const GET: APIRoute = () => new Response(JSON.stringify({ error: 'Method not allowed.' }), {
  status: 405,
  headers: { 'Content-Type': 'application/json' },
});

const demoClientData = {
  id: 'demo-client-id',
  name: 'Mila',
  company: 'WrapMotion',
  client_code: DEMO_CLIENT_CODE,
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const rawCode = typeof body?.clientCode === 'string' ? body.clientCode : '';
    const normalized = rawCode.trim().toUpperCase();

    if (!normalized) {
      return new Response(JSON.stringify({ success: false, message: 'Client code is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const demoEnabled = import.meta.env.DEV && import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !== 'false';

    if (demoEnabled && normalized === DEMO_CLIENT_CODE) {
      const session = createClientPortalSession(demoClientData.id, demoClientData.client_code, demoClientData.company);
      setClientPortalSessionCookie(cookies, session);

      return new Response(JSON.stringify({ success: true, client: demoClientData, company: demoClientData.company }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseAdmin) {
      return new Response(JSON.stringify({ success: false, message: 'Portal is not configured for production access.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: clientData, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('client_code', normalized)
      .maybeSingle();

    if (clientError || !clientData) {
      return new Response(JSON.stringify({ success: false, message: 'That client code is invalid.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = createClientPortalSession(clientData.id, clientData.client_code, clientData.company);
    setClientPortalSessionCookie(cookies, session);

    return new Response(JSON.stringify({ success: true, client: clientData, company: clientData.company }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Unable to validate the client code.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
