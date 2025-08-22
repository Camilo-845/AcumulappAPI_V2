
import { ClientCardService } from '@/modules/clientCard/ClientCard.service';
import { ClientCardRepository } from '@/modules/clientCard/ClientCard.repository';
import { CardRepository } from '@/modules/card/Card.repository';
import { ApiError } from '@/core';
import { StatusCodes } from 'http-status-codes';
import * as uniqueCodeUtils from '@/utils/uniqueCode';

jest.mock('@/modules/clientCard/ClientCard.repository');
jest.mock('@/modules/card/Card.repository');
jest.mock('@/utils/uniqueCode');

describe('ClientCardService', () => {
  let clientCardService: ClientCardService;

  beforeEach(() => {
    clientCardService = new ClientCardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createClientCard', () => {
    it('should create a new client card with a unique code', async () => {
      const data = { idClient: 1, idCard: 1 };
      const uniqueCode = 'test-code';
      const createdClientCard = { id: 1, ...data, uniqueCode };

      (uniqueCodeUtils.generateAlphanumericCode as jest.Mock).mockReturnValue(uniqueCode);
      (ClientCardRepository.prototype.existsByUniqueCode as jest.Mock).mockResolvedValue(false);
      (ClientCardRepository.prototype.create as jest.Mock).mockResolvedValue(createdClientCard);

      const result = await clientCardService.createClientCard(data);

      expect(result).toEqual(createdClientCard);
      expect(uniqueCodeUtils.generateAlphanumericCode).toHaveBeenCalled();
      expect(ClientCardRepository.prototype.existsByUniqueCode).toHaveBeenCalledWith(uniqueCode);
      expect(ClientCardRepository.prototype.create).toHaveBeenCalled();
    });

    it('should throw an error if a unique code cannot be generated', async () => {
      (uniqueCodeUtils.generateAlphanumericCode as jest.Mock).mockReturnValue('test-code');
      (ClientCardRepository.prototype.existsByUniqueCode as jest.Mock).mockResolvedValue(true);

      await expect(clientCardService.createClientCard({ idClient: 1, idCard: 1 })).rejects.toThrow(
        new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'No se pudo generar un código único para la tarjeta del cliente.')
      );
    });
  });

  describe('activateClientCard', () => {
    it('should throw an error if client card is not found', async () => {
      (ClientCardRepository.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(null);

      await expect(clientCardService.activateClientCard('nonexistent-code')).rejects.toThrow(
        new ApiError(StatusCodes.NOT_FOUND, 'Tarjeta de cliente no encontrada')
      );
    });

    it('should activate a client card', async () => {
      const clientCard = { id: 1, idCard: 1, uniqueCode: 'test-code' };
      const card = { id: 1, expiration: 60 };
      const updatedClientCard = { ...clientCard, idCardState: 1 };

      (ClientCardRepository.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(clientCard);
      (CardRepository.prototype.findById as jest.Mock).mockResolvedValue(card);
      (ClientCardRepository.prototype.update as jest.Mock).mockResolvedValue(updatedClientCard);

      const result = await clientCardService.activateClientCard('test-code');

      expect(result).toEqual(updatedClientCard);
      expect(ClientCardRepository.prototype.update).toHaveBeenCalledWith(clientCard.id, expect.any(Object));
    });
  });

  describe('addStampsToClientCard', () => {
    it('should add stamps to a client card', async () => {
      const clientCard = { id: 1, idCard: 1, currentStamps: 0, uniqueCode: 'test-code' };
      const card = { id: 1, maxStamp: 10 };
      const updatedClientCard = { ...clientCard, currentStamps: 1 };

      (ClientCardRepository.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(clientCard);
      (CardRepository.prototype.findById as jest.Mock).mockResolvedValue(card);
      (ClientCardRepository.prototype.update as jest.Mock).mockResolvedValue(updatedClientCard);

      const result = await clientCardService.addStampsToClientCard('test-code', 1);

      expect(result).toEqual(updatedClientCard);
    });

    it('should throw an error if stamps exceed max stamps', async () => {
      const clientCard = { id: 1, idCard: 1, currentStamps: 9, uniqueCode: 'test-code' };
      const card = { id: 1, maxStamp: 10 };

      (ClientCardRepository.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(clientCard);
      (CardRepository.prototype.findById as jest.Mock).mockResolvedValue(card);

      await expect(clientCardService.addStampsToClientCard('test-code', 2)).rejects.toThrow(
        new ApiError(StatusCodes.BAD_REQUEST, 'No puedes añadir más sellos del maximo que permite la tarjeta')
      );
    });
  });

  describe('markAsRedeemed', () => {
    it('should mark a client card as redeemed', async () => {
      const clientCard = { id: 1, uniqueCode: 'test-code', idCardState: 2 };
      const updatedClientCard = { ...clientCard, idCardState: 3, uniqueCode: null };

      (ClientCardRepository.prototype.findByUniqueCode as jest.Mock).mockResolvedValue(clientCard);
      (ClientCardRepository.prototype.update as jest.Mock).mockResolvedValue(updatedClientCard);

      const result = await clientCardService.markAsRedeemed('test-code');

      expect(result).toEqual(updatedClientCard);
    });
  });
});
