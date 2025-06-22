import prisma from "../../config/db/prismaClient";
import { IClient, ICreateClientData } from "./Client.model";
import Prisma from "@prisma/client";

type PrismaClient = Prisma.Clients;

const mapPrismaClientToDomain = (prismaClient: PrismaClient): IClient => {
  return {
    idAccount: prismaClient.idAccount,
  };
};

export class ClientRepository {
  async findByAccountId(idAccount: number): Promise<IClient | null> {
    const client = await prisma.clients.findUnique({
      where: { idAccount },
    });
    return client ? mapPrismaClientToDomain(client) : null;
  }

  async create(data: ICreateClientData): Promise<IClient> {
    const newClient = await prisma.clients.create({
      data: {
        idAccount: data.idAccount,
      },
    });
    return mapPrismaClientToDomain(newClient);
  }
}
