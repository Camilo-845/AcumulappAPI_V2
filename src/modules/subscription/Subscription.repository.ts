import prisma from "../../config/db/prismaClient";
import { ISubscription } from "./Subscription.model";
import Prisma from "@prisma/client";

type PrismaSubscription = Prisma.Subscriptions;

const mapPrismaSubscriptionToDomain = (
  prismaSubscription: PrismaSubscription,
): ISubscription => {
  return {
    id: prismaSubscription.id,
    idBusiness: prismaSubscription.idBusiness,
    idPlan: prismaSubscription.idPlan,
    startDate: prismaSubscription.startDate,
    endDate: prismaSubscription.endDate,
    creationDate: prismaSubscription.creationDate,
  };
};

export class SubscriptionRepository {
  async findActiveSubscriptionByBusinessId(
    businessId: number,
  ): Promise<ISubscription | null> {
    const now = new Date();
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        idBusiness: businessId,
        OR: [
          {
            endDate: null, // Ongoing subscription
          },
          {
            endDate: {
              gte: now, // End date is in the future
            },
          },
        ],
      },
    });
    return subscription ? mapPrismaSubscriptionToDomain(subscription) : null;
  }
}
