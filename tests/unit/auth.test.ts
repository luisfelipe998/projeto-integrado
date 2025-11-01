import { Request, Response, NextFunction } from 'express';

// Set environment variables before importing the middleware
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'password123';

import { basicAuthMiddleware, AuthenticatedRequest } from '../../src/middleware/auth';

describe('basicAuthMiddleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('authentication scenarios', () => {
    it('should return 401 when authorization header is missing', () => {
      mockRequest.headers = {};

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Authentication required. Please provide Basic authentication credentials.',
          code: 'AUTHENTICATION_REQUIRED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Basic', () => {
      mockRequest.headers = {
        authorization: 'Bearer token123'
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Authentication required. Please provide Basic authentication credentials.',
          code: 'AUTHENTICATION_REQUIRED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when authorization header format is invalid', () => {
      mockRequest.headers = {
        authorization: 'Basic invalid-base64!'
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when credentials are incorrect', () => {
      // Base64 encode "wronguser:wrongpass"
      const wrongCredentials = Buffer.from('wronguser:wrongpass').toString('base64');
      mockRequest.headers = {
        authorization: `Basic ${wrongCredentials}`
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when username is correct but password is wrong', () => {
      // Base64 encode "admin:wrongpass"
      const wrongCredentials = Buffer.from('admin:wrongpass').toString('base64');
      mockRequest.headers = {
        authorization: `Basic ${wrongCredentials}`
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when password is correct but username is wrong', () => {
      // Base64 encode "wronguser:password123"
      const wrongCredentials = Buffer.from('wronguser:password123').toString('base64');
      mockRequest.headers = {
        authorization: `Basic ${wrongCredentials}`
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() and set user when credentials are correct', () => {
      // Base64 encode "admin:password123"
      const correctCredentials = Buffer.from('admin:password123').toString('base64');
      mockRequest.headers = {
        authorization: `Basic ${correctCredentials}`
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.user).toEqual({
        username: 'admin',
        isAdmin: true
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle empty credentials', () => {
      // Base64 encode ":"
      const emptyCredentials = Buffer.from(':').toString('base64');
      mockRequest.headers = {
        authorization: `Basic ${emptyCredentials}`
      };

      basicAuthMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Access denied. Only admin users can access this endpoint.',
          code: 'ACCESS_DENIED'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
