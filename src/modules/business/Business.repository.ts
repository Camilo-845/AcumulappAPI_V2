import prisma from "../../config/db/prismaClient"; // Asegúrate de que esta ruta sea correcta
import { IBusiness, ICreateBusinessData } from "./Business.model";
import Prisma from "@prisma/client";

// Define el tipo exacto de Prisma para el modelo Business
// Asegúrate de que 'Business' (PascalCase) coincida con tu 'model' en schema.prisma
type PrismaBusinessType = Prisma.Business;

const mapPrismaBusinessToDomain = (
  prismaBusiness: PrismaBusinessType,
): IBusiness => {
  return {
    id: prismaBusiness.id,
    name: prismaBusiness.name,
    email: prismaBusiness.email,
    idLocation: prismaBusiness.idLocation,
    logoImage: prismaBusiness.logoImage,
    address: prismaBusiness.address,
    idPlan: prismaBusiness.idPlan,
    fullInformation: prismaBusiness.fullInformation,
  };
};

export class BusinessRepository {
  async findById(id: number): Promise<IBusiness | null> {
    const business = await prisma.business.findUnique({
      where: { id },
    });
    return business ? mapPrismaBusinessToDomain(business) : null;
  }

  async findByIdWithRelations(id: number): Promise<IBusiness | null> {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        Locations: true, // Incluye el objeto completo de la ubicación
        Plans: true, // Incluye el objeto completo del plan
        // Agrega otras relaciones aquí si las necesitas (ej. Cards, BusinessCategories, etc.)
      },
    });

    if (!business) {
      return null;
    }

    // Mapea el resultado de Prisma a tu dominio IBusiness, incluyendo las relaciones
    return {
      id: business.id,
      name: business.name,
      email: business.email,
      idLocation: business.idLocation,
      logoImage: business.logoImage,
      address: business.address,
      idPlan: business.idPlan,
      fullInformation: business.fullInformation,
      // Mapeo de relaciones. Asegúrate de tener un mapPrismaLocationToDomain y mapPrismaPlanToDomain
      location: business.Locations
        ? {
            id: business.Locations.id,
            name: business.Locations.name,
            idFather: business.Locations.idFather,
            idLocationType: business.Locations.idLocationType,
          }
        : null,
      plan: business.Plans
        ? {
            id: business.Plans.id,
            name: business.Plans.name,
          }
        : null,
      // Mapea otras relaciones si las incluiste en la consulta
    } as IBusiness; // Cast aquí para simplificar el ejemplo, idealmente un mapeador dedicado
  }

  async create(data: ICreateBusinessData): Promise<IBusiness> {
    const newBusiness = await prisma.business.create({
      data: {
        name: data.name,
        email: data.email,
        logoImage: data.logoImage,
        address: data.address,
        fullInformation: data.fullInformation ?? false,
        idPlan: data.idPlan ?? 1,
        ...(data.idLocation && {
          Location: {
            connect: { id: data.idLocation },
          },
        }),
      },
    });
    return mapPrismaBusinessToDomain(newBusiness);
  }

  // async update(
  //   id: number,
  //   data: IUpdateBusinessData,
  // ): Promise<IBusiness | null> {
  //   const updatedBusiness = await prisma.business.update({
  //     where: { id },
  //     data: {
  //       name: data.name,
  //       email: data.email,
  //       idLocation: data.idLocation,
  //       logoImage: data.logoImage,
  //       address: data.address,
  //       idPlan: data.idPlan,
  //       fullInformation: data.fullInformation,
  //       // Si idLocation se actualiza, podrías necesitar 'connect' aquí
  //       ...(data.idLocation !== undefined &&
  //         data.idLocation !== null && {
  //           Location: {
  //             connect: { id: data.idLocation },
  //           },
  //         }),
  //       // Si idLocation se establece a null, podrías necesitar 'disconnect' o 'set'
  //       // ...(data.idLocation === null && { Location: { disconnect: true } }),
  //     },
  //   });
  //   return mapPrismaBusinessToDomain(updatedBusiness);
  // }

  async delete(id: number): Promise<IBusiness> {
    const deletedBusiness = await prisma.business.delete({
      where: { id },
    });
    return mapPrismaBusinessToDomain(deletedBusiness);
  }
}
