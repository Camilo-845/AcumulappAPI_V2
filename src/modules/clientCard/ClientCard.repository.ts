import { Prisma } from "@prisma/client";
import {
  IClientCard,
  ICreateClientCardData,
  IUpdateClientCardData,
} from "./ClientCard.model";
import prisma from "../../config/db/prismaClient";
import { ICard } from "../card/Card.model";
import { ICardState } from "../cardState/CardState.model";

type PrismaClientCardWithDetails = Prisma.CardsClientsGetPayload<{
  include: { Cards: true; CardStates: true };
}>;

interface clientCardPaginationParams {
  limit: number;
  offset: number;
}

const mapPrismaClientCardToDomain = (
  pricamClientCard: PrismaClientCardWithDetails,
): IClientCard => {
  const { Cards, CardStates, ...rest } = pricamClientCard;

  const card: ICard | null = Cards
    ? {
        id: Cards.id,
        name: Cards.name,
        idBusiness: Cards.idBusiness,
        expiration: Number(Cards.expiration),
        maxStamp: Cards.maxStamp,
        description: Cards.description,
        restrictions: Cards.restrictions,
        reward: Cards.reward,
      }
    : null;

  const cardState: ICardState | null = CardStates
    ? {
        id: CardStates.id,
        name: CardStates.name,
      }
    : null;

  return {
    id: rest.id,
    idClient: rest.idClient,
    idCard: rest.idCard,
    idCardState: rest.idCardState,
    expirationDate: rest.expirationDate,
    currentStamps: rest.currentStamps,
    uniqueCode: rest.UniqueCode,
    card: card,
    cardState: cardState,
  };
};

export class ClientCardRepository {
  async findById(id: number): Promise<IClientCard | null> {
    const clientCards = await prisma.cardsClients.findUnique({
      where: { id },
      include: { Cards: true, CardStates: true },
    });
    return clientCards ? mapPrismaClientCardToDomain(clientCards) : null;
  }

  async findByUniqueCode(uniqueCode: string) {
    const clientCards = await prisma.cardsClients.findUnique({
      where: { UniqueCode: uniqueCode },
      include: { Cards: true, CardStates: true },
    });
    return clientCards ? mapPrismaClientCardToDomain(clientCards) : null;
  }

  async findByClientAndCardAndState(
    idClient: number,
    idCard: number,
    idCardState: number,
  ) {
    const clientCard = await prisma.cardsClients.findFirst({
      where: {
        idClient,
        idCard,
        idCardState,
      },
      include: { Cards: true, CardStates: true },
    });
    return clientCard ? mapPrismaClientCardToDomain(clientCard) : null;
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
        include: { Cards: true, CardStates: true },
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
        include: { Cards: true, CardStates: true },
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
      include: { Cards: true, CardStates: true },
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
      include: { Cards: true, CardStates: true },
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

  async getStatsByBusiness(businessId: number) {
    const stats = await prisma.cardsClients.findMany({
      where: {
        Cards: {
          idBusiness: businessId,
        },
      },
      select: {
        currentStamps: true,
        CardStates: {
          select: {
            name: true,
          },
        },
      },
    });
    return stats;
  }
}
