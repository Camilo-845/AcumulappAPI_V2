
import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '@/middelwares/auth.middleware';
import * as jwtUtils from '@/utils/jwt';
import { ApiError } from '@/core';
import { StatusCodes } from 'http-status-codes';

jest.mock('@/utils/jwt');

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn(() => res as Response),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if token is valid', () => {
    req.headers!['authorization'] = 'Bearer valid-token';
    const decoded = { id: 1, email: 'test@example.com' };
    (jwtUtils.verifyJwt as jest.Mock).mockReturnValue(decoded);

    authenticateToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(decoded);
  });

  it('should return 401 if token is not provided', () => {
    authenticateToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new ApiError(StatusCodes.UNAUTHORIZED, 'Token no proporcionado.'));
  });

  it('should return 401 if token is invalid', () => {
    req.headers!['authorization'] = 'Bearer invalid-token';
    (jwtUtils.verifyJwt as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new ApiError(StatusCodes.UNAUTHORIZED, 'Token inválido.'));
  });
});
