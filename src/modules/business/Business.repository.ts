import prisma from "../../config/db/prismaClient"; // Asegúrate de que esta ruta sea correcta
import { IBusiness, ICreateBusinessData } from "./Business.model";
import Prisma from "@prisma/client";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";

// Define el tipo exacto de Prisma para el modelo Business
// Asegúrate de que 'Business' (PascalCase) coincida con tu 'model' en schema.prisma
type PrismaBusinessType = Prisma.Business;

interface BusinessPaginationParams {
  limit: number;
  offset: number;
}

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
        BusinessCategories: {
          include: {
            Categories: true,
          },
        },
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

      categories: business.BusinessCategories
        ? business.BusinessCategories.map((el) => {
            return {
              id: el.Categories.id,
              name: el.Categories.name,
            };
          })
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

  async findAllBusiness(
    paginationParams: BusinessPaginationParams,
    filters: GetBusinessFiltersRequestDTO,
  ): Promise<{ business: IBusiness[]; total: number }> {
    const { limit, offset } = paginationParams;
    const { name, category } = filters;

    var [business, total] = await prisma.$transaction([
      prisma.business.findMany({
        where: {
          fullInformation: true,
          // Filtro por nombre (si se proporciona)
          ...(name && {
            name: {
              contains: name, // Busca nombres que contengan el string (case-insensitive)
              mode: "insensitive",
            },
          }),

          // Filtro por categoría (si se proporciona)
          ...(category && {
            BusinessCategories: {
              some: {
                // 'some' es para relaciones uno a muchos o muchos a muchos
                idCategory: category, // Busca negocios que tengan AL MENOS UNA categoría con ese ID
              },
            },
          }),
        },
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
        include: {
          BusinessCategories: {
            include: {
              Categories: true,
            },
          },
        },
      }),
      prisma.business.count({
        where: {
          fullInformation: true,
          // Filtro por nombre (si se proporciona)
          ...(name && {
            name: {
              contains: name, // Busca nombres que contengan el string (case-insensitive)
              mode: "insensitive",
            },
          }),

          // Filtro por categoría (si se proporciona)
          ...(category && {
            BusinessCategories: {
              some: {
                // 'some' es para relaciones uno a muchos o muchos a muchos
                idCategory: category, // Busca negocios que tengan AL MENOS UNA categoría con ese ID
              },
            },
          }),
        },
      }),
    ]);

    return {
      business: business.map((el) => {
        return {
          id: el.id,
          name: el.name,
          email: el.email,
          idLocation: el.idLocation,
          logoImage: el.logoImage,
          address: el.address,
          idPlan: el.idPlan,
          fullInformation: el.fullInformation,
          categories: el.BusinessCategories
            ? el.BusinessCategories.map((el) => {
                return {
                  id: el.Categories.id,
                  name: el.Categories.name,
                };
              })
            : null,
          // Mapea otras relaciones si las incluiste en la consulta
        }; // Cast aquí para simplificar el ejemplo, idealmente un mapeador dedicado
      }),
      total,
    };
  }
}
