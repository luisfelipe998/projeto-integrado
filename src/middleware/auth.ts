import { Request, Response, NextFunction } from 'express';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export interface AuthenticatedRequest extends Request {
    user?: {
        username: string;
        isAdmin: boolean;
    };
}

export const basicAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({
      error: {
        message: 'Server authentication configuration is missing.',
        code: 'SERVER_AUTH_CONFIG_MISSING'
      }
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: {
        message: 'Authentication required. Please provide Basic authentication credentials.',
        code: 'AUTHENTICATION_REQUIRED'
      }
    });
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.user = {
        username: username,
        isAdmin: true
      };
      next();
    } else {
      return res.status(403).json({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
    }
  } catch {
    return res.status(401).json({
      error: {
        message: 'Invalid authentication credentials format.',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }
};
