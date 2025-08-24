import prisma from "../../config/db/prismaClient";
import { IBusiness, ICreateBusinessData } from "./Business.model";
import {
  Business,
  BusinessCategories,
  Categories,
  Prisma,
} from "@prisma/client";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";

// Define el tipo extendido para incluir las relaciones
type PrismaBusinessWithRelations = Business & {
  BusinessCategories?: (BusinessCategories & {
    Categories: Categories;
  })[];
};

interface BusinessPaginationParams {
  limit: number;
  offset: number;
}

// --- MAPPER FUNCTIONS ---

const mapPrismaBusinessToDomain = (
  prismaBusiness: PrismaBusinessWithRelations,
): IBusiness => {
  return {
    id: prismaBusiness.id,
    name: prismaBusiness.name,
    email: prismaBusiness.email,
    logoImage: prismaBusiness.logoImage,
    address: prismaBusiness.address,
    fullInformation: prismaBusiness.fullInformation,
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
        BusinessCategories: {
          include: {
            Categories: true,
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
    };

    const newBusiness = await prisma.business.create({ data: createData });
    return mapPrismaBusinessToDomain(newBusiness);
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      idLocation?: number;
      logoImage?: string;
      address?: string;
    },
  ): Promise<IBusiness | null> {
    const updateData: Prisma.BusinessUpdateInput = {
      fullInformation: true, // Siempre se marca como true al actualizar el perfil
    };

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.logoImage) updateData.logoImage = data.logoImage;
    if (data.address) updateData.address = data.address;

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: updateData,
      include: {
        BusinessCategories: { include: { Categories: true } },
      },
    });

    return updatedBusiness ? mapPrismaBusinessToDomain(updatedBusiness) : null;
  }

  async updateBusinessCategories(
    businessId: number,
    categoryIds: number[],
  ): Promise<void> {
    await prisma.businessCategories.deleteMany({
      where: { idBusiness: businessId },
    });

    if (categoryIds.length > 0) {
      const categoryConnects = categoryIds.map((catId) => ({
        idBusiness: businessId,
        idCategory: catId,
      }));
      await prisma.businessCategories.createMany({ data: categoryConnects });
    }
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
