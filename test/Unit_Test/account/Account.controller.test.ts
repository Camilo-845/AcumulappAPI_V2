
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { login, clientRegister, businessRegister, getAccountDetailsById, getAccountDetailsByEmail } from '@/modules/account/Account.controller';
import { AccountService } from '@/modules/account/Account.service';

jest.mock('@/modules/account/Account.service');

describe('Account Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
    };
    req = {
      body: {},
      validatedData: { query: {}, params: {} },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };
      const userType = 'client';
      const authResponse = { token: 'fake-token', account: { id: 1, email: 'test@example.com', fullName: 'Test User', userType: 'client' } };

      req.body = loginData;
      req.validatedData!.query = { userType };

      (AccountService.prototype.login as jest.Mock).mockResolvedValue(authResponse);

      await login(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(authResponse);
    });
  });

  describe('clientRegister', () => {
    it('should return a token and user data on successful client registration', async () => {
      const registerData = { email: 'test@example.com', password: 'password', fullName: 'Test User' };
      const authResponse = { token: 'fake-token', account: { id: 1, email: 'test@example.com', fullName: 'Test User', userType: 'client' } };

      req.body = registerData;

      (AccountService.prototype.registerClient as jest.Mock).mockResolvedValue(authResponse);

      await clientRegister(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(authResponse);
    });
  });

  describe('businessRegister', () => {
    it('should return a token and user data on successful business registration', async () => {
      const registerData = { email: 'test@example.com', password: 'password', fullName: 'Test User' };
      const authResponse = { token: 'fake-token', account: { id: 1, email: 'test@example.com', fullName: 'Test User', userType: 'collaborator', collaboratorDetails: [] } };

      req.body = registerData;

      (AccountService.prototype.registerBusiness as jest.Mock).mockResolvedValue(authResponse);

      await businessRegister(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(authResponse);
    });
  });

  describe('getAccountDetailsById', () => {
    it('should return account details when a valid ID is provided', async () => {
      const accountDetails = { id: 1, email: 'test@example.com', fullName: 'Test User' };
      req.validatedData!.params = { id: 1 };

      (AccountService.prototype.getAccountById as jest.Mock).mockResolvedValue(accountDetails);

      await getAccountDetailsById(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(accountDetails);
    });
  });

  describe('getAccountDetailsByEmail', () => {
    it('should return account details when a valid email is provided', async () => {
      const accountDetails = { id: 1, email: 'test@example.com', fullName: 'Test User' };
      req.validatedData!.params = { email: 'test@example.com' };

      (AccountService.prototype.getAccountByEmail as jest.Mock).mockResolvedValue(accountDetails);

      await getAccountDetailsByEmail(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(accountDetails);
    });
  });
});
