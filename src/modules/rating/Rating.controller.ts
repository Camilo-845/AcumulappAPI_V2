import { Request, Response } from "express";
import { ApiError, asyncHandler } from "../../core";
import { RatingService } from "./Rating.service";
import { CreateRatingRequestDTO } from "./DTO/Request/createRating.request.dto";
import { StatusCodes } from "http-status-codes";

const ratingService = new RatingService();

export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    const ratingData: CreateRatingRequestDTO = req.body;
    if (!req.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const clientId = req.user.id;

    const createdRating = await ratingService.create(ratingData, clientId);
    return res.status(StatusCodes.CREATED).json(createdRating);
  },
);
