
import { AccountService } from '@/modules/account/Account.service';
import { AccountRepository } from '@/modules/account/Account.repository';
import { ClientRepository } from '@/modules/client/Client.repository';
import { CollaboratorRepository } from '@/modules/collaborator/Collaborator.repository';
import { AuthProviderRepository } from '@/modules/authProvider/AuthProvider.repository';
import { BusinessRepository } from '@/modules/business/Business.repository';
import { ApiError } from '@/core';
import { StatusCodes } from 'http-status-codes';
import * as passwordUtils from '@/utils/password';
import * as jwtUtils from '@/utils/jwt';

jest.mock('@/modules/account/Account.repository');
jest.mock('@/modules/client/Client.repository');
jest.mock('@/modules/collaborator/Collaborator.repository');
jest.mock('@/modules/authProvider/AuthProvider.repository');
jest.mock('@/modules/business/Business.repository');
jest.mock('@/utils/password');
jest.mock('@/utils/jwt');

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    accountService = new AccountService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw an error if account is not found', async () => {
      (AccountRepository.prototype.findByEmailWithPassword as jest.Mock).mockResolvedValue(null);
      await expect(accountService.login({ email: 'nonexistent@example.com', password: 'password' }, 'client')).rejects.toThrow(new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.'));
    });

    it('should throw an error for invalid password', async () => {
      const mockAccount = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      (AccountRepository.prototype.findByEmailWithPassword as jest.Mock).mockResolvedValue(mockAccount);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(accountService.login({ email: 'test@example.com', password: 'wrongpassword' }, 'client')).rejects.toThrow(new ApiError(StatusCodes.UNAUTHORIZED, 'Credenciales inválidas.'));
    });

    it('should return a token for a client', async () => {
      const mockAccount = { id: 1, email: 'test@example.com', password: 'hashedpassword', fullName: 'Test Client' };
      (AccountRepository.prototype.findByEmailWithPassword as jest.Mock).mockResolvedValue(mockAccount);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (ClientRepository.prototype.findByAccountId as jest.Mock).mockResolvedValue({ idAccount: 1 });
      (CollaboratorRepository.prototype.findByAccountIdWithBusinessAndRole as jest.Mock).mockResolvedValue([]);
      (jwtUtils.signJwt as jest.Mock).mockReturnValue('fake-token');

      const result = await accountService.login({ email: 'test@example.com', password: 'password' }, 'client');

      expect(result.token).toBe('fake-token');
      expect(result.account.userType).toBe('client');
    });
  });

  describe('registerClient', () => {
    it('should throw an error if account already exists', async () => {
      (AccountRepository.prototype.findByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'exists@example.com', fullName: 'Existing User', isActive: true, emailVerified: false, idAuthProvider: 1 });

      await expect(accountService.registerClient({ email: 'exists@example.com', password: 'password', fullName: 'Test' })).rejects.toThrow(new ApiError(StatusCodes.BAD_REQUEST, 'Ya existe una cuenta con este email.'));
    });

    it('should register a new client and return a token', async () => {
      const registerData = { email: 'new@example.com', password: 'password', fullName: 'New User' };
      const hashedPassword = 'hashedpassword';
      const mockProvider = { id: 1, name: 'local' };
      const newAccount = { id: 2, email: registerData.email, fullName: registerData.fullName, isActive: true, emailVerified: false, idAuthProvider: 1 };

      (AccountRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (AuthProviderRepository.prototype.findByName as jest.Mock).mockResolvedValue(mockProvider);
      (AccountRepository.prototype.create as jest.Mock).mockResolvedValue(newAccount);
      (ClientRepository.prototype.create as jest.Mock).mockResolvedValue({ idAccount: 2 });
      (jwtUtils.signJwt as jest.Mock).mockReturnValue('new-fake-token');

      const result = await accountService.registerClient(registerData);

      expect(result.token).toBe('new-fake-token');
      expect(result.account.email).toBe(registerData.email);
      expect(AccountRepository.prototype.create).toHaveBeenCalledWith(expect.objectContaining({ password: hashedPassword }));
    });
  });
});
