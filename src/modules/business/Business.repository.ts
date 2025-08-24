import prisma from "../../config/db/prismaClient";
import { IBusiness, ICreateBusinessData, IBusinessLink } from "./Business.model";
import {
  Business,
  BusinessCategories,
  Categories,
  Prisma,
  BusinessLink,
  Links,
} from "@prisma/client";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";

// Define el tipo extendido para incluir las relaciones
type PrismaBusinessWithRelations = Business & {
  BusinessCategories?: (BusinessCategories & {
    Categories: Categories;
  })[];
  BusinessLink?: (BusinessLink & {
    Links: Links;
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
    description: prismaBusiness.description,
    email: prismaBusiness.email,
    logoImage: prismaBusiness.logoImage,
    bannerImage: prismaBusiness.bannerImage,
    address: prismaBusiness.address,
    fullInformation: prismaBusiness.fullInformation,
    rating_average: prismaBusiness.rating_average,
    rating_count: prismaBusiness.rating_count,
    location_latitude: prismaBusiness.location_latitude?.toNumber(),
    location_longitude: prismaBusiness.location_longitude?.toNumber(),
    createdAt: prismaBusiness.createdAt,
    categories: prismaBusiness.BusinessCategories?.map(
      (bc: BusinessCategories & { Categories: Categories }) => ({
        id: bc.Categories.id,
        name: bc.Categories.name,
      }),
    ),
    links: prismaBusiness.BusinessLink?.map(
      (bl: BusinessLink & { Links: Links }) => ({
        id: bl.Links.id,
        name: bl.Links.name,
        value: bl.value,
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
        BusinessLink: {
          include: {
            Links: true,
          },
        },
      },
    });

    return business ? mapPrismaBusinessToDomain(business) : null;
  }

  async create(data: ICreateBusinessData): Promise<IBusiness> {
    const createData: Prisma.BusinessCreateInput = {
      name: data.name,
      description: data.description,
      email: data.email,
      logoImage: data.logoImage,
      address: data.address,
    };

    if (data.bannerImage) {
      createData.bannerImage = data.bannerImage;
    }
    if (data.location_latitude) {
      createData.location_latitude = data.location_latitude;
    }
    if (data.location_longitude) {
      createData.location_longitude = data.location_longitude;
    }

    const newBusiness = await prisma.business.create({ data: createData });
    return mapPrismaBusinessToDomain(newBusiness);
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      email?: string;
      logoImage?: string;
      bannerImage?: string;
      address?: string;
      location_latitude?: number;
      location_longitude?: number;
    },
  ): Promise<IBusiness | null> {
    const updateData: Prisma.BusinessUpdateInput = {
      fullInformation: true, // Siempre se marca como true al actualizar el perfil
    };

    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.email) updateData.email = data.email;
    if (data.logoImage) updateData.logoImage = data.logoImage;
    if (data.bannerImage) updateData.bannerImage = data.bannerImage;
    if (data.address) updateData.address = data.address;
    if (data.location_latitude) updateData.location_latitude = data.location_latitude;
    if (data.location_longitude) updateData.location_longitude = data.location_longitude;

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

  async updateBusinessLinks(
    businessId: number,
    links: { idLink: number; value: string }[],
  ): Promise<void> {
    await prisma.businessLink.deleteMany({
      where: { idBusiness: businessId },
    });

    if (links.length > 0) {
      const linkConnects = links.map((link) => ({
        idBusiness: businessId,
        idLInk: link.idLink,
        value: link.value,
      }));
      await prisma.businessLink.createMany({ data: linkConnects });
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
          BusinessLink: { include: { Links: true } },
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
