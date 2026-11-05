/**
 * Multi-tenant authorization and security boundaries
 */

export class AuthorizationError extends Error {
  constructor(message = "Unauthorized: Access denied to this resource.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Asserts that the authenticated session user owns the target resource.
 * Throws AuthorizationError if there is a mismatch.
 */
export function assertOwnership(
  resourceOwnerId: string | null | undefined,
  sessionUserId: string | null | undefined,
  resourceName = "Resource"
): void {
  if (!sessionUserId) {
    throw new AuthorizationError("Unauthenticated: No active user session.");
  }

  if (!resourceOwnerId || resourceOwnerId !== sessionUserId) {
    console.warn(
      `[SECURITY AUDIT] Multi-tenant access violation blocked! User "${sessionUserId}" attempted unauthorized access to ${resourceName} owned by "${resourceOwnerId}".`
    );
    throw new AuthorizationError(
      `Forbidden: You do not have permission to view, edit or delete this ${resourceName}.`
    );
  }
}
