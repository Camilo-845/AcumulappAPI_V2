
import { Request, Response } from 'express';
import ExampleController from '@/api/v1/controllers/example.controller';

describe('ExampleController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    req = {};
    res = {
      status: statusMock,
    };
  });

  it('should return a 200 status and a message', () => {
    ExampleController.getExample(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Esta es una respuesta de ejemplo desde la API v1" });
  });
});
