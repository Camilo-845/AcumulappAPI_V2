import Prisma from "@prisma/client";
import {
  IClientCard,
  ICreateClientCardData,
  IUpdateClientCardData,
} from "./ClientCard.model";
import prisma from "../../config/db/prismaClient";

type PrismaClientCards = Prisma.CardsClients;

interface clientCardPaginationParams {
  limit: number;
  offset: number;
}

const mapPrismaClientCardToDomain = (
  priscamClientCard: PrismaClientCards,
): IClientCard => {
  return {
    id: priscamClientCard.id,
    idClient: priscamClientCard.idClient,
    idCard: priscamClientCard.idCard,
    idCardState: priscamClientCard.idCardState,
    expirationDate: priscamClientCard.expirationDate,
    currentStamps: priscamClientCard.currentStamps,
    uniqueCode: priscamClientCard.UniqueCode,
  };
};

export class ClientCardRepository {
  async findById(id: number): Promise<IClientCard | null> {
    const clientCards = await prisma.cardsClients.findUnique({ where: { id } });
    return clientCards ? mapPrismaClientCardToDomain(clientCards) : null;
  }

  async findByUniqueCode(uniqueCode: string) {
    const clientCards = await prisma.cardsClients.findUnique({
      where: { UniqueCode: uniqueCode },
    });
    return clientCards ? mapPrismaClientCardToDomain(clientCards) : null;
  }

  async findAllByClientAndState(
    paginationParams: clientCardPaginationParams,
    clientId: number,
    stateId: number,
  ) {
    const { limit, offset } = paginationParams;

    const [clientCards, total] = await prisma.$transaction([
      prisma.cardsClients.findMany({
        skip: offset,
        take: limit,
        where: { idClient: clientId, idCardState: stateId },
      }),
      prisma.cardsClients.count({
        where: { idClient: clientId, idCardState: stateId },
      }),
    ]);
    return { clientCards: clientCards.map(mapPrismaClientCardToDomain), total };
  }

  async fidAllByBusinessAndState(
    paginationParams: clientCardPaginationParams,
    businessId: number,
    stateId: number,
  ) {
    const { limit, offset } = paginationParams;

    const [clientCards, total] = await prisma.$transaction([
      prisma.cardsClients.findMany({
        skip: offset,
        take: limit,
        where: { Cards: { idBusiness: businessId }, idCardState: stateId },
      }),
      prisma.cardsClients.count({
        where: { Cards: { idBusiness: businessId }, idCardState: stateId },
      }),
    ]);
    return { clientCards: clientCards.map(mapPrismaClientCardToDomain), total };
  }

  async create(data: ICreateClientCardData) {
    const newClientCard = await prisma.cardsClients.create({
      data: {
        idCard: data.idCard,
        idClient: data.idClient,
        idCardState: data.idCardState,
        expirationDate: data.expirationDate,
        UniqueCode: data.uniqueCode,
        currentStamps: data.currentStamps,
      },
    });

    return mapPrismaClientCardToDomain(newClientCard);
  }

  async update(id: number, data: IUpdateClientCardData) {
    const updatedClientCard = await prisma.cardsClients.update({
      where: { id },
      data: {
        idCard: data.idCard,
        idClient: data.idClient,
        idCardState: data.idCardState,
        expirationDate: data.expirationDate,
        UniqueCode: data.uniqueCode,
        currentStamps: data.currentStamps,
      },
    });
    return mapPrismaClientCardToDomain(updatedClientCard);
  }
  async existsByUniqueCode(code: string): Promise<boolean> {
    const count = await prisma.cardsClients.count({
      where: {
        UniqueCode: code,
      },
    });
    return count > 0;
  }
}
