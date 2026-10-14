/**
 * @ptc/auth - Firebase token verification, session cookies, and scoped RBAC evaluation
 */

export interface AuthenticatedUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  status: 'invited' | 'active' | 'suspended' | 'disabled';
  effectiveRoles: string[];
  effectiveClientOrgId?: string;
  authzRevision: number;
}

export interface SessionCookiePayload {
  userId: string;
  firebaseUid: string;
  authzRevision: number;
  issuedAt: number;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = 'ptc_session';
