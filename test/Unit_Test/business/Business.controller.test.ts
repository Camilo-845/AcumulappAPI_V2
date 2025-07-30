
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllBusiness, getAllBusinessCategories, getBusinessById, completeBusinessProfile, updateBusinessCategories } from '@/modules/business/Business.controller';
import { BusinessService } from '@/modules/business/Business.service';

jest.mock('@/modules/business/Business.service');

describe('Business Controller', () => {
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
      validatedData: { query: {}, params: {}, body: {} },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBusiness', () => {
    it('should return a paginated list of businesses', async () => {
      const paginatedResponse = { data: [], pagination: {} };
      req.validatedData!.query = { page: 1, size: 10 };

      (BusinessService.prototype.getAllBusiness as jest.Mock).mockResolvedValue(paginatedResponse);

      await getAllBusiness(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(paginatedResponse);
    });
  });

  describe('getAllBusinessCategories', () => {
    it('should return a list of all business categories', async () => {
      const categories = [{ id: 1, name: 'Category 1' }];
      (BusinessService.prototype.getAllCategories as jest.Mock).mockResolvedValue(categories);

      await getAllBusinessCategories(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(categories);
    });
  });

  describe('getBusinessById', () => {
    it('should return a business when a valid ID is provided', async () => {
      const business = { id: 1, name: 'Test Business' };
      req.params = { id: '1' };

      (BusinessService.prototype.getBusinessById as jest.Mock).mockResolvedValue(business);

      await getBusinessById(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(business);
    });
  });

  describe('completeBusinessProfile', () => {
    it('should update and return the business profile', async () => {
      const updatedBusiness = { id: 1, name: 'Updated Business' };
      req.validatedData!.params = { id: 1 };
      req.validatedData!.body = { name: 'Updated Business' };

      (BusinessService.prototype.completeBusinessProfile as jest.Mock).mockResolvedValue(updatedBusiness);

      await completeBusinessProfile(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(updatedBusiness);
    });
  });

  describe('updateBusinessCategories', () => {
    it('should update business categories and return a success message', async () => {
      req.validatedData!.params = { id: 1 };
      req.validatedData!.body = { categories: [1, 2] };

      (BusinessService.prototype.updateBusinessCategories as jest.Mock).mockResolvedValue(undefined);

      await updateBusinessCategories(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Categorías actualizadas exitosamente.' });
    });
  });
});
