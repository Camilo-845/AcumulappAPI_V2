import prisma from "../../config/db/prismaClient";
import { IAccount, ICreateAccountData } from "./Account.model";
import Prisma from "@prisma/client";

type PrismaAccount = Prisma.Accounts;

const mapPrismaAccountToDomain = (prismaAccount: PrismaAccount): IAccount => {
  return {
    id: prismaAccount.id,
    email: prismaAccount.email,
    fullName: prismaAccount.fullName,
    isActive: prismaAccount.isActive,
    emailVerified: prismaAccount.emailVerified,
    profileImageURL: prismaAccount.profileImageURL,
    idAuthProvider: prismaAccount.idAuthProvider,
    providerUserId: prismaAccount.providerUserId,
    refreshToken: prismaAccount.refreshToken,
  };
};

export class AccountRepository {
  async findById(id: number): Promise<IAccount | null> {
    const account = await prisma.accounts.findUnique({
      where: { id },
    });
    return account ? mapPrismaAccountToDomain(account) : null;
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    const account = await prisma.accounts.findUnique({
      where: { email },
    });
    return account ? mapPrismaAccountToDomain(account) : null;
  }

  async findByEmailWithPassword(email: string): Promise<PrismaAccount | null> {
    return prisma.accounts.findUnique({
      where: { email },
    });
  }

  async findByProviderUserId(providerUserId: string): Promise<IAccount | null> {
    const account = await prisma.accounts.findFirst({
      where: { providerUserId },
    });
    return account ? mapPrismaAccountToDomain(account) : null;
  }

  async create(data: ICreateAccountData): Promise<IAccount> {
    const newAccount = await prisma.accounts.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        idAuthProvider: data.idAuthProvider,
        providerUserId: data.providerUserId,
        isActive: true,
        emailVerified: false,
      },
    });
    return mapPrismaAccountToDomain(newAccount);
  }

  async update(
    id: number,
    data: Partial<ICreateAccountData>,
  ): Promise<IAccount> {
    const updatedAccount = await prisma.accounts.update({
      where: { id },
      data,
    });
    return mapPrismaAccountToDomain(updatedAccount);
  }
}
