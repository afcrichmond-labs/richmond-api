// Endpoints excluded from auto-redirect middleware
// Added after INC-2025-003: refresh endpoint was incorrectly redirecting
export const REDIRECT_EXCLUSIONS = [
  "/api/auth/refresh",
  "/api/auth/token",
  "/api/auth/logout",
  "/api/health",
  "/api/health/ready",
];

export function shouldSkipRedirect(path: string): boolean {
  return REDIRECT_EXCLUSIONS.some((exclusion) => path.startsWith(exclusion));
}
