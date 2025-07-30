
import { CardService } from '@/modules/card/Card.service';
import { CardRepository } from '@/modules/card/Card.repository';
import { CardStateRepository } from '@/modules/cardState/CardState.repository';

jest.mock('@/modules/card/Card.repository');
jest.mock('@/modules/cardState/CardState.repository');

describe('CardService', () => {
  let cardService: CardService;

  beforeEach(() => {
    cardService = new CardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const cardData = { idBusiness: 1, name: 'New Card', expiration: 30, maxStamp: 10, description: '', restrictions: '', reward: '' };
      const createdCard = { id: 1, ...cardData };

      (CardRepository.prototype.create as jest.Mock).mockResolvedValue(createdCard);

      const result = await cardService.create(cardData);

      expect(result).toEqual(createdCard);
    });
  });

  describe('getAllCards', () => {
    it('should return a paginated list of cards', async () => {
      const paginationParams = { page: 1, size: 10 };
      const cardList = { cards: [], total: 0 };

      (CardRepository.prototype.findAllCards as jest.Mock).mockResolvedValue(cardList);

      const result = await cardService.getAllCards(paginationParams);

      expect(result.data).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
    });
  });

  describe('getAllCardsByBusiness', () => {
    it('should return a paginated list of cards for a specific business', async () => {
      const paginationParams = { page: 1, size: 10 };
      const businessId = 1;
      const cardList = { cards: [], total: 0 };

      (CardRepository.prototype.filAllCardsByBusiness as jest.Mock).mockResolvedValue(cardList);

      const result = await cardService.getAllCardsByBusiness(paginationParams, businessId);

      expect(result.data).toEqual([]);
      expect(result.pagination.total_items).toBe(0);
    });
  });

  describe('getAllCardStates', () => {
    it('should return a list of all card states', async () => {
      const cardStates = [{ id: 1, name: 'Active' }];
      (CardStateRepository.prototype.findAll as jest.Mock).mockResolvedValue(cardStates);

      const result = await cardService.getAllCardStates();

      expect(result).toEqual(cardStates);
    });
  });
});
