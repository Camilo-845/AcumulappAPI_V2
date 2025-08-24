import { PrismaClient, Ratings } from "@prisma/client";
import { CreateRatingRequestDTO } from "./DTO/Request/createRating.request.dto";
import prisma from "../../config/db/prismaClient";

export class RatingRepository {
  
  public async create(
    ratingData: CreateRatingRequestDTO,
    clientId: number
  ): Promise<Ratings> {
    return prisma.ratings.create({
      data: {
        idBusiness: ratingData.idBusiness,
        valoration: ratingData.valoration,
        idClient: clientId,
      },
    });
  }
}
