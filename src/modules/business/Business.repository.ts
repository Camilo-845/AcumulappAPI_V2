import prisma from "@config/db/prismaClient";
import { IBusiness, ICreateBusinessData } from "./Business.model";
import {
  Business,
  Locations,
  Plans,
  BusinessCategories,
  Categories,
  Prisma,
} from "@prisma/client";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";
import { ILocation } from "../location/Location.model";

// Define el tipo extendido para incluir las relaciones
type PrismaBusinessWithRelations = Business & {
  Locations?: (Locations & { Locations?: Locations | null }) | null;
  Plans?: Plans | null;
  BusinessCategories?: (BusinessCategories & {
    Categories: Categories;
  })[];
};

interface BusinessPaginationParams {
  limit: number;
  offset: number;
}

// --- MAPPER FUNCTIONS ---

const mapPrismaLocationToDomain = (
  prismaLocation: Locations & { Locations?: Locations | null },
): ILocation => {
  const location: ILocation = {
    id: prismaLocation.id,
    name: prismaLocation.name,
    idFather: prismaLocation.idFather,
    idLocationType: prismaLocation.idLocationType,
  };

  // Mapeo recursivo para el padre
  if (prismaLocation.Locations) {
    location.father = mapPrismaLocationToDomain(prismaLocation.Locations);
  }

  return location;
};

const mapPrismaBusinessToDomain = (
  prismaBusiness: PrismaBusinessWithRelations,
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
    location: prismaBusiness.Locations
      ? mapPrismaLocationToDomain(prismaBusiness.Locations)
      : null,
    plan: prismaBusiness.Plans
      ? { id: prismaBusiness.Plans.id, name: prismaBusiness.Plans.name }
      : null,
    categories: prismaBusiness.BusinessCategories?.map(
      (bc: BusinessCategories & { Categories: Categories }) => ({
        id: bc.Categories.id,
        name: bc.Categories.name,
      }),
    ),
  };
};

// --- REPOSITORY CLASS ---

export class BusinessRepository {
  async findById(id: number): Promise<IBusiness | null> {
    const business = await prisma.business.findUnique({ where: { id } });
    return business ? mapPrismaBusinessToDomain(business) : null;
  }

  async findByIdWithRelations(id: number): Promise<IBusiness | null> {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        Plans: true,
        BusinessCategories: {
          include: {
            Categories: true,
          },
        },
        Locations: {
          include: {
            Locations: true, // Incluir el padre de la ubicación
          },
        },
      },
    });

    return business ? mapPrismaBusinessToDomain(business) : null;
  }

  async create(data: ICreateBusinessData): Promise<IBusiness> {
    const createData: Prisma.BusinessCreateInput = {
      name: data.name,
      email: data.email,
      logoImage: data.logoImage,
      address: data.address,
      fullInformation: data.fullInformation ?? false,
      Plans: {
        connect: { id: data.idPlan ?? 1 },
      },
    };

    if (data.idLocation) {
      createData.Locations = {
        connect: { id: data.idLocation },
      };
    }

    const newBusiness = await prisma.business.create({ data: createData });
    return mapPrismaBusinessToDomain(newBusiness);
  }

  async delete(id: number): Promise<IBusiness> {
    const deletedBusiness = await prisma.business.delete({ where: { id } });
    return mapPrismaBusinessToDomain(deletedBusiness);
  }

  async findAllBusiness(
    paginationParams: BusinessPaginationParams,
    filters: GetBusinessFiltersRequestDTO,
  ): Promise<{ business: IBusiness[]; total: number }> {
    const { limit, offset } = paginationParams;
    const { name, category } = filters;

    const whereClause: Prisma.BusinessWhereInput = {
      fullInformation: true,
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(category && {
        BusinessCategories: { some: { idCategory: category } },
      }),
    };

    const [businesses, total] = await prisma.$transaction([
      prisma.business.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { name: "asc" },
        include: {
          BusinessCategories: { include: { Categories: true } },
          Locations: true,
        },
      }),
      prisma.business.count({ where: whereClause }),
    ]);

    return {
      business: businesses.map(mapPrismaBusinessToDomain),
      total,
    };
  }
}

