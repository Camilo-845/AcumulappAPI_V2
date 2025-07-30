
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import validate from '@/middelwares/validation';
import { ApiError } from '@/core';

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      validatedData: { body: {}, query: {}, params: {} },
    };
    res = {
      status: jest.fn(() => res as Response),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  const testSchema = z.object({
    body: z.object({
      name: z.string(),
    }),
  });

  it('should call next if data is valid', async () => {
    req.body = { name: 'Test' };
    await validate(testSchema)(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next with an ApiError if data is invalid', async () => {
    req.body = { name: 123 }; // Invalid data
    await validate(testSchema)(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });
});
