import { Request, Response, NextFunction } from "express";
import { extractTenantFromJWT } from "../services/auth/jwt";

/**
 * Middleware to extract tenant context from JWT and attach to request.
 * All downstream database queries will be scoped to this tenant.
 */
export function tenantContext(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(); // Unauthenticated routes don't need tenant context
  }

  try {
    const { tenant_id } = extractTenantFromJWT(token);
    req.tenantId = tenant_id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid tenant context" });
  }
}
