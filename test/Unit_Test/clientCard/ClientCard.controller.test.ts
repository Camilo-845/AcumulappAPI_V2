
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createClientCard, getAllClientCardsByClient, getAllClientCardsByBusiness, findById, findByUniqueCode, activateCard, addStampToClientCard, markClientCardAsRedeemed } from '@/modules/clientCard/ClientCard.controller';
import { ClientCardService } from '@/modules/clientCard/ClientCard.service';

jest.mock('@/modules/clientCard/ClientCard.service');

describe('ClientCard Controller', () => {
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
      params: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createClientCard', () => {
    it('should create a new client card and return it', async () => {
      const clientCardData = { idClient: 1, idCard: 1 };
      const createdClientCard = { id: 1, ...clientCardData };
      req.body = clientCardData;

      (ClientCardService.prototype.createClientCard as jest.Mock).mockResolvedValue(createdClientCard);

      await createClientCard(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(createdClientCard);
    });
  });

  describe('getAllClientCardsByClient', () => {
    it('should return a paginated list of client cards for a specific client', async () => {
      const paginatedResponse = { data: [], pagination: {} };
      req.validatedData!.query = { idClient: 1, page: 1, size: 10 };

      (ClientCardService.prototype.getAllClientCardsByClientAndState as jest.Mock).mockResolvedValue(paginatedResponse);

      await getAllClientCardsByClient(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(paginatedResponse);
    });
  });

  describe('getAllClientCardsByBusiness', () => {
    it('should return a paginated list of client cards for a specific business', async () => {
      const paginatedResponse = { data: [], pagination: {} };
      req.validatedData!.query = { idBusiness: 1, page: 1, size: 10 };

      (ClientCardService.prototype.getAllClientCardsByBusinessAndState as jest.Mock).mockResolvedValue(paginatedResponse);

      await getAllClientCardsByBusiness(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(paginatedResponse);
    });
  });

  describe('findById', () => {
    it('should return a client card when a valid ID is provided', async () => {
      const clientCard = { id: 1, idClient: 1, idCard: 1 };
      req.params!.id = '1';

      (ClientCardService.prototype.findById as jest.Mock).mockResolvedValue(clientCard);

      await findById(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(clientCard);
    });
  });

  describe('findByUniqueCode', () => {
    it('should return a client card when a valid unique code is provided', async () => {
      const clientCard = { id: 1, idClient: 1, idCard: 1 };
      req.params!.uniqueCode = 'test-code';

      (ClientCardService.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(clientCard);

      await findByUniqueCode(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(clientCard);
    });
  });

  describe('activateCard', () => {
    it('should activate a client card and return it', async () => {
      const clientCard = { id: 1, idClient: 1, idCard: 1 };
      req.params!.uniqueCode = 'test-code';

      (ClientCardService.prototype.activateClientCard as jest.Mock).mockResolvedValue(clientCard);

      await activateCard(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(clientCard);
    });
  });

  describe('addStampToClientCard', () => {
    it('should add stamps to a client card and return it', async () => {
      const clientCard = { id: 1, idClient: 1, idCard: 1 };
      req.params!.uniqueCode = 'test-code';
      req.body = { stamps: 1 };

      (ClientCardService.prototype.addStampsToClientCard as jest.Mock).mockResolvedValue(clientCard);

      await addStampToClientCard(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(clientCard);
    });
  });

  describe('markClientCardAsRedeemed', () => {
    it('should mark a client card as redeemed and return it', async () => {
      const clientCard = { id: 1, idClient: 1, idCard: 1 };
      req.params!.uniqueCode = 'test-code';

      (ClientCardService.prototype.markAsRedeemed as jest.Mock).mockResolvedValue(clientCard);

      await markClientCardAsRedeemed(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(clientCard);
    });
  });
});
