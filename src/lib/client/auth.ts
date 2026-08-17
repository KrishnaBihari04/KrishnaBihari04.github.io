import { DEMO_CLIENT_CODE, type ClientSession } from './types';

const CLIENT_SESSION_KEY = 'client_portal_session';

export function getClientSession(): ClientSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(CLIENT_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ClientSession & { expiresAt?: number };
    if (!parsed?.clientCode || !parsed?.clientId || !parsed?.expiresAt) return null;

    if (parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(CLIENT_SESSION_KEY);
      return null;
    }

    return {
      clientCode: parsed.clientCode,
      clientId: parsed.clientId,
      company: parsed.company ?? 'Client',
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function saveClientSession(session: ClientSession): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
}

export function clearClientSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(CLIENT_SESSION_KEY);
}

export function isDemoClientCode(value: string): boolean {
  const normalized = value.trim().toUpperCase();
  const demoEnabled = import.meta.env.DEV && import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !== 'false';
  return demoEnabled && normalized === DEMO_CLIENT_CODE;
}
