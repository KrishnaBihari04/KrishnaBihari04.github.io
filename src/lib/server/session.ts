import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';

export type ClientPortalSession = {
  clientId: string;
  clientCode: string;
  company: string;
  expiresAt: number;
};

const SESSION_COOKIE_NAME = 'client_portal_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getSessionSecret(): string {
  const devFallback = 'local-dev-client-session-secret';
  const configuredSecret = import.meta.env.CLIENT_SESSION_SECRET;

  if (configuredSecret && configuredSecret.length > 0) {
    return configuredSecret;
  }

  if (import.meta.env.DEV) {
    return devFallback;
  }

  throw new Error('CLIENT_SESSION_SECRET is required in production.');
}

function serializeSession(session: ClientPortalSession): string {
  return JSON.stringify({
    clientId: session.clientId,
    clientCode: session.clientCode,
    company: session.company,
    expiresAt: session.expiresAt,
  });
}

export function createClientPortalSession(clientId: string, clientCode: string, company: string): ClientPortalSession {
  return {
    clientId,
    clientCode: clientCode.trim().toUpperCase(),
    company,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

export function signSessionPayload(session: ClientPortalSession): string {
  const payload = serializeSession(session);
  const signature = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signature}`;
}

export function verifySessionPayload(rawValue: string): ClientPortalSession | null {
  if (!rawValue.includes('.')) return null;

  const [payloadB64, signature] = rawValue.split('.');
  if (!payloadB64 || !signature) return null;
  if (signature.length !== 64) return null;

  const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
  const expectedSignature = crypto.createHmac('sha256', getSessionSecret()).update(payloadJson).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const parsed = JSON.parse(payloadJson) as ClientPortalSession;
    if (!parsed.clientId || !parsed.clientCode || !parsed.expiresAt) return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return {
      clientId: parsed.clientId,
      clientCode: parsed.clientCode.trim().toUpperCase(),
      company: parsed.company ?? 'Client',
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function setClientPortalSessionCookie(cookies: AstroCookies, session: ClientPortalSession): void {
  cookies.set(SESSION_COOKIE_NAME, signSessionPayload(session), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000)),
  });
}

export function clearClientPortalSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getClientPortalSession(cookies: AstroCookies): ClientPortalSession | null {
  const raw = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifySessionPayload(raw);
}

export type AdminSession = {
  email: string;
  role: 'admin';
  expiresAt: number;
};

const ADMIN_SESSION_COOKIE_NAME = 'admin_workspace_session';
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getAdminSessionSecret(): string {
  const configuredSecret = import.meta.env.ADMIN_SESSION_SECRET ?? import.meta.env.CLIENT_SESSION_SECRET;
  if (configuredSecret && configuredSecret.length > 0) {
    return configuredSecret;
  }

  if (import.meta.env.DEV) {
    return 'local-dev-admin-session-secret';
  }

  throw new Error('ADMIN_SESSION_SECRET is required in production.');
}

function serializeAdminSession(session: AdminSession): string {
  return JSON.stringify({
    email: session.email,
    role: session.role,
    expiresAt: session.expiresAt,
  });
}

export function createAdminSession(email: string): AdminSession {
  return {
    email: email.trim().toLowerCase(),
    role: 'admin',
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
  };
}

export function signAdminSessionPayload(session: AdminSession): string {
  const payload = serializeAdminSession(session);
  const signature = crypto.createHmac('sha256', getAdminSessionSecret()).update(payload).digest('hex');
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signature}`;
}

export function verifyAdminSessionPayload(rawValue: string): AdminSession | null {
  if (!rawValue.includes('.')) return null;

  const [payloadB64, signature] = rawValue.split('.');
  if (!payloadB64 || !signature) return null;
  if (signature.length !== 64) return null;

  try {
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', getAdminSessionSecret()).update(payloadJson).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const parsed = JSON.parse(payloadJson) as AdminSession;
    if (!parsed.email || parsed.role !== 'admin' || !parsed.expiresAt) return null;
    if (parsed.expiresAt <= Date.now()) return null;

    return {
      email: parsed.email.trim().toLowerCase(),
      role: 'admin',
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(cookies: AstroCookies, session: AdminSession): void {
  cookies.set(ADMIN_SESSION_COOKIE_NAME, signAdminSessionPayload(session), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000)),
  });
}

export function clearAdminSessionCookie(cookies: AstroCookies): void {
  cookies.delete(ADMIN_SESSION_COOKIE_NAME, { path: '/' });
}

export function getAdminSession(cookies: AstroCookies): AdminSession | null {
  const raw = cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifyAdminSessionPayload(raw);
}
