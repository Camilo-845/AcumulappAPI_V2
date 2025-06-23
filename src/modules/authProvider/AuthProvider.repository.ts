import prisma from "../../config/db/prismaClient"; // Asegúrate de que esta ruta sea correcta
import Prisma from "@prisma/client";
import { IAuthProvider } from "./AuthProvider.model";

// Define el tipo exacto de Prisma para AuthProviders
// Asegúrate de que el nombre 'AuthProviders' coincida con tu 'model' en schema.prisma (PascalCase)
type PrismaAuthProviderType = Prisma.AuthProviders;

/**
 * Mapea un objeto AuthProviders de Prisma a tu interfaz de dominio IAuthProvider.
 */
const mapPrismaAuthProviderToDomain = (
  prismaAuthProvider: PrismaAuthProviderType,
): IAuthProvider => {
  return {
    id: prismaAuthProvider.id,
    name: prismaAuthProvider.name,
  };
};

export class AuthProviderRepository {
  async findById(id: number): Promise<IAuthProvider | null> {
    const authProvider = await prisma.authProviders.findUnique({
      where: { id },
    });
    return authProvider ? mapPrismaAuthProviderToDomain(authProvider) : null;
  }

  async findByName(name: string): Promise<IAuthProvider | null> {
    const authProvider = await prisma.authProviders.findUnique({
      where: { name },
    });
    return authProvider ? mapPrismaAuthProviderToDomain(authProvider) : null;
  }
}
