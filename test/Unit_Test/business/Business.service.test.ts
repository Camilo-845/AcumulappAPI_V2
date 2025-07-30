
import { BusinessService } from '@/modules/business/Business.service';
import { BusinessRepository } from '@/modules/business/Business.repository';
import { BusinessCategoriesRepository } from '@/modules/businessCategories/BusinessCategories.repository';
import { ApiError } from '@/core';
import { StatusCodes } from 'http-status-codes';

jest.mock('@/modules/business/Business.repository');
jest.mock('@/modules/businessCategories/BusinessCategories.repository');

describe('BusinessService', () => {
  let businessService: BusinessService;

  beforeEach(() => {
    businessService = new BusinessService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBusiness', () => {
    it('should return a paginated list of businesses', async () => {
      const paginationParams = { page: 1, size: 10 };
      const filters = {};
      const businessList = { business: [], total: 0 };

      (BusinessRepository.prototype.findAllBusiness as jest.Mock).mockResolvedValue(businessList);

      const result = await businessService.getAllBusiness(paginationParams, filters);

      expect(result.data).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
    });
  });

  describe('getAllCategories', () => {
    it('should return a list of all business categories', async () => {
      const categories = [{ id: 1, name: 'Category 1' }];
      (BusinessCategoriesRepository.prototype.findAll as jest.Mock).mockResolvedValue(categories);

      const result = await businessService.getAllCategories();

      expect(result).toEqual(categories);
    });
  });

  describe('getBusinessById', () => {
    it('should return a business when a valid ID is provided', async () => {
      const business = { id: 1, name: 'Test Business' };
      (BusinessRepository.prototype.findByIdWithRelations as jest.Mock).mockResolvedValue(business);

      const result = await businessService.getBusinessById(1);

      expect(result).toEqual(business);
    });
  });

  describe('completeBusinessProfile', () => {
    it('should throw an error if business is not found', async () => {
      (BusinessRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      await expect(businessService.completeBusinessProfile(1, {})).rejects.toThrow(new ApiError(StatusCodes.NOT_FOUND, 'Negocio no encontrado.'));
    });

    it('should update and return the business profile', async () => {
      const existingBusiness = { id: 1, name: 'Old Name' };
      const updatedBusiness = { id: 1, name: 'New Name' };
      const updateData = { name: 'New Name' };

      (BusinessRepository.prototype.findById as jest.Mock).mockResolvedValue(existingBusiness);
      (BusinessRepository.prototype.update as jest.Mock).mockResolvedValue(updatedBusiness);

      const result = await businessService.completeBusinessProfile(1, updateData);

      expect(result).toEqual(updatedBusiness);
    });
  });

  describe('updateBusinessCategories', () => {
    it('should throw an error if business is not found', async () => {
      (BusinessRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      await expect(businessService.updateBusinessCategories(1, [])).rejects.toThrow(new ApiError(StatusCodes.NOT_FOUND, 'Negocio no encontrado.'));
    });

    it('should update business categories', async () => {
      const existingBusiness = { id: 1, name: 'Test Business' };
      (BusinessRepository.prototype.findById as jest.Mock).mockResolvedValue(existingBusiness);
      (BusinessRepository.prototype.updateBusinessCategories as jest.Mock).mockResolvedValue(undefined);

      await businessService.updateBusinessCategories(1, [1, 2]);

      expect(BusinessRepository.prototype.updateBusinessCategories).toHaveBeenCalledWith(1, [1, 2]);
    });
  });
});
