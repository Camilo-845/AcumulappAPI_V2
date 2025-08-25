import { Request, Response } from "express";
import { asyncHandler } from "../../core";
import { SubscriptionService } from "./Subscription.service";
import { StatusCodes } from "http-status-codes";
import { CheckSubscriptionRequestDTO } from "./DTO/Request";

const subscriptionService = new SubscriptionService();

export const checkBusinessSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { businessId } = req.validatedData!.params as CheckSubscriptionRequestDTO;
    const isActive = await subscriptionService.isBusinessSubscriptionActive(businessId);
    return res.status(StatusCodes.OK).json({ isActive });
  },
);
