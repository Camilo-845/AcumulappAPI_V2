import prisma from "../../config/db/prismaClient"; // Asegúrate de que la ruta sea correcta
import { ICard, ICreateCardData, IUpdateCardData } from "./Card.model";
import Prisma from "@prisma/client";

type PrismaCardType = Prisma.Cards;

interface cardPaginationParams {
  limit: number;
  offset: number;
}

const mapPrismaCardToDomain = (primaCard: PrismaCardType): ICard => {
  return {
    id: primaCard.id,
    idBusiness: primaCard.idBusiness,
    expiration: Number(primaCard.expiration),
    maxStamp: primaCard.maxStamp,
    description: primaCard.description,
    restrictions: primaCard.restrictions,
    reward: primaCard.reward,
  };
};

export class CardRepository {
  async findById(id: number): Promise<ICard | null> {
    const card = await prisma.cards.findUnique({ where: { id } });
    return card ? mapPrismaCardToDomain(card) : null;
  }

  async create(data: ICreateCardData): Promise<ICard> {
    const newCard = await prisma.cards.create({
      data: {
        idBusiness: data.idBusiness,
        expiration: data.expiration,
        maxStamp: data.maxStamp,
        description: data.description,
      },
    });
    return mapPrismaCardToDomain(newCard);
  }

  async update(id: number, data: IUpdateCardData): Promise<ICard | null> {
    const updatedCard = await prisma.cards.update({
      where: { id },
      data: {
        idBusiness: data.idBusiness,
        expiration: data.expiration,
        maxStamp: data.maxStamp,
        description: data.description,
      },
    });
    return mapPrismaCardToDomain(updatedCard);
  }

  async findAllCards(
    paginationParams: cardPaginationParams,
  ): Promise<{ cards: ICard[]; total: number }> {
    const { limit, offset } = paginationParams;

    const [cards, total] = await prisma.$transaction([
      prisma.cards.findMany({
        take: limit,
        skip: offset,
      }),
      prisma.cards.count(),
    ]);
    return {
      cards: cards.map(mapPrismaCardToDomain),
      total,
    };
  }

  async filAllCardsByBusiness(
    paginationParams: cardPaginationParams,
    businessId: number,
  ) {
    const { limit, offset } = paginationParams;

    const [cards, total] = await prisma.$transaction([
      prisma.cards.findMany({
        where: {
          idBusiness: businessId,
        },
        take: limit,
        skip: offset,
      }),
      prisma.cards.count({ where: { idBusiness: businessId } }),
    ]);
    return {
      cards: cards.map(mapPrismaCardToDomain),
      total,
    };
  }
}
