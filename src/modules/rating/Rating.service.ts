import { Ratings } from "@prisma/client";
import { RatingRepository } from "./Rating.repository";
import { CreateRatingRequestDTO } from "./DTO/Request/createRating.request.dto";
import { ApiError } from "../../core";
import { StatusCodes } from "http-status-codes";

export class RatingService {
  private ratingRepository: RatingRepository;

  constructor() {
    this.ratingRepository = new RatingRepository();
  }

  public async create(
    ratingData: CreateRatingRequestDTO,
    clientId: number,
  ): Promise<Ratings> {
    const newRating = await this.ratingRepository.create(ratingData, clientId);
    return newRating;
  }
}
