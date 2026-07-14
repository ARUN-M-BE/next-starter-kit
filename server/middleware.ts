// Standalone Express/Node backend middleware templates

import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  sessionToken?: string;
  user?: any;
}

/**
 * Express middleware to validate session token cookies.
 * Mirroring cookie-session checks in Next.js middleware.
 */
export function validateSessionMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.session_token) {
    token = req.cookies.session_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Missing session token credentials"
    });
  }

  // Bind token to request context
  req.sessionToken = token;
  
  // Here developer would validate session in database:
  // const user = await db.session.findUnique({ where: { token } });
  // if (!user) return res.status(401).json({ error: "Invalid token" });
  // req.user = user;

  next();
}

/**
 * Standard CORS configuration middleware for standalone servers.
 */
export function corsHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
}
