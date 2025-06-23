import prisma from "../../config/db/prismaClient"; // Asegúrate de que esta ruta sea correcta
import Prisma from "@prisma/client";
import { IBusinessCategory } from "./BusinessCategories.model";

type PrismaBusinessCategoryType = Prisma.Categories;

const mapPrismaBusinessCategoryToDomain = (
  prismaBusinessCategory: PrismaBusinessCategoryType,
) => {
  return {
    id: prismaBusinessCategory.id,
    name: prismaBusinessCategory.name,
  };
};

export class BusinessCategoriesRepository {
  async findById(id: number): Promise<IBusinessCategory | null> {
    const businessCategory = await prisma.categories.findUnique({
      where: { id },
    });
    return businessCategory
      ? mapPrismaBusinessCategoryToDomain(businessCategory)
      : null;
  }
  async findByName(name: string): Promise<IBusinessCategory | null> {
    const businessCategory = await prisma.categories.findUnique({
      where: { name },
    });
    return businessCategory
      ? mapPrismaBusinessCategoryToDomain(businessCategory)
      : null;
  }
}
