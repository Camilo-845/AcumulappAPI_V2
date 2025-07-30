
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createCard, getAllCards, getAllCardsByBusinessId, getAllCardStates } from '@/modules/card/Card.controller';
import { CardService } from '@/modules/card/Card.service';

jest.mock('@/modules/card/Card.service');

describe('Card Controller', () => {
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

  describe('createCard', () => {
    it('should create a new card and return it', async () => {
      const cardData = { name: 'New Card' };
      const createdCard = { id: 1, ...cardData };
      req.body = cardData;

      (CardService.prototype.create as jest.Mock).mockResolvedValue(createdCard);

      await createCard(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(createdCard);
    });
  });

  describe('getAllCards', () => {
    it('should return a paginated list of cards', async () => {
      const paginatedResponse = { data: [], pagination: {} };
      req.validatedData!.query = { page: 1, size: 10 };

      (CardService.prototype.getAllCards as jest.Mock).mockResolvedValue(paginatedResponse);

      await getAllCards(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(paginatedResponse);
    });
  });

  describe('getAllCardsByBusinessId', () => {
    it('should return a paginated list of cards for a specific business', async () => {
      const paginatedResponse = { data: [], pagination: {} };
      req.validatedData!.params = { id: 1 };
      req.validatedData!.query = { page: 1, size: 10 };

      (CardService.prototype.getAllCardsByBusiness as jest.Mock).mockResolvedValue(paginatedResponse);

      await getAllCardsByBusinessId(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(paginatedResponse);
    });
  });

  describe('getAllCardStates', () => {
    it('should return a list of all card states', async () => {
      const cardStates = [{ id: 1, name: 'Active' }];
      (CardService.prototype.getAllCardStates as jest.Mock).mockResolvedValue(cardStates);

      await getAllCardStates(req as Request, res as Response, jest.fn());

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK);
      expect(jsonMock).toHaveBeenCalledWith(cardStates);
    });
  });
});
