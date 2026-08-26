import {
  DEMO_PROJECT_CODE,
  type ProjectSession,
} from './types';

const PROJECT_SESSION_KEY =
  'project_portal_session';

/**
 * Returns the current project-based portal session.
 *
 * Session data is stored only in sessionStorage and expires
 * automatically when the configured expiration timestamp is reached.
 */
export function getProjectSession(): ProjectSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(
      PROJECT_SESSION_KEY,
    );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<ProjectSession>;

    if (
      !parsed?.projectCode ||
      !parsed?.projectId ||
      !parsed?.expiresAt
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(
        PROJECT_SESSION_KEY,
      );

      return null;
    }

    return {
      projectCode: parsed.projectCode,
      projectId: parsed.projectId,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

/**
 * Saves a project-based portal session.
 */
export function saveProjectSession(
  session: ProjectSession,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    PROJECT_SESSION_KEY,
    JSON.stringify(session),
  );
}

/**
 * Clears the current project portal session.
 */
export function clearProjectSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(
    PROJECT_SESSION_KEY,
  );
}

/**
 * Checks whether the development-only demo project code
 * is allowed.
 */
export function isDemoProjectCode(
  value: string,
): boolean {
  const normalized = value.trim().toUpperCase();

  const demoEnabled =
    import.meta.env.DEV &&
    import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !==
      'false';

  return (
    demoEnabled &&
    normalized === DEMO_PROJECT_CODE
  );
}

/*
 * ---------------------------------------------------------
 * Temporary backwards compatibility
 * ---------------------------------------------------------
 *
 * These aliases allow the rest of the portal to migrate
 * incrementally without breaking the application.
 *
 * They should be removed once ClientLogin and
 * ClientDashboard have fully migrated to project sessions.
 */

export type LegacyClientSession = ProjectSession;

export function getClientSession(): ProjectSession | null {
  return getProjectSession();
}

export function saveClientSession(
  session: ProjectSession,
): void {
  saveProjectSession(session);
}

export function clearClientSession(): void {
  clearProjectSession();
}

export function isDemoClientCode(
  value: string,
): boolean {
  return isDemoProjectCode(value);
}