import { SubscriptionRepository } from "./Subscription.repository";
import { ApiError } from "../../core";
import { StatusCodes } from "http-status-codes";

export class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }

  public async isBusinessSubscriptionActive(businessId: number): Promise<boolean> {
    const activeSubscription = await this.subscriptionRepository.findActiveSubscriptionByBusinessId(businessId);
    return !!activeSubscription;
  }
}
