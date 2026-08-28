import type { ProjectSession } from './types';

const PROJECT_SESSION_KEY =
'project_portal_session';

export function getProjectSession(): ProjectSession | null {
if (typeof window === 'undefined') {
return null;
}

try {
const raw =
window.sessionStorage.getItem(
PROJECT_SESSION_KEY,
);


if (!raw) {
  return null;
}

const parsed =
  JSON.parse(raw) as Partial<ProjectSession>;

if (
  !parsed.projectCode ||
  !parsed.projectId ||
  !parsed.expiresAt
) {
  window.sessionStorage.removeItem(
    PROJECT_SESSION_KEY,
  );
  return null;
}

if (parsed.expiresAt <= Date.now()) {
  window.sessionStorage.removeItem(
    PROJECT_SESSION_KEY,
  );
  return null;
}

return {
  projectCode: parsed.projectCode
    .trim()
    .toUpperCase(),
  projectId: parsed.projectId,
  expiresAt: parsed.expiresAt,
};


} catch {
window.sessionStorage.removeItem(
PROJECT_SESSION_KEY,
);


return null;


}
}

export function saveProjectSession(
session: ProjectSession,
): void {
if (typeof window === 'undefined') {
return;
}

window.sessionStorage.setItem(
PROJECT_SESSION_KEY,
JSON.stringify({
projectCode: session.projectCode
.trim()
.toUpperCase(),
projectId: session.projectId,
expiresAt: session.expiresAt,
}),
);
}

export function clearProjectSession(): void {
if (typeof window === 'undefined') {
return;
}

window.sessionStorage.removeItem(
PROJECT_SESSION_KEY,
);
}
