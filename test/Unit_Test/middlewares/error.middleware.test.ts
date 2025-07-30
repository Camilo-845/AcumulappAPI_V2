
import { Request, Response, NextFunction } from 'express';
import errorHandler from '@/middelwares/error.middleware';
import { ApiError } from '@/core';
import { StatusCodes } from 'http-status-codes';

describe('Error Handler Middleware', () => {
  let err: ApiError;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
    };
    req = {};
    next = jest.fn();
  });

  it('should handle ApiError and send a formatted response', () => {
    err = new ApiError(StatusCodes.BAD_REQUEST, 'Test Error', []);
    errorHandler(err, req as Request, res as Response, next);
    expect(statusMock).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Test Error',
      details: [],
    });
  });

  it('should handle generic errors and send a 500 response', () => {
    err = new Error('Generic Error') as ApiError;
    errorHandler(err, req as Request, res as Response, next);
    expect(statusMock).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
