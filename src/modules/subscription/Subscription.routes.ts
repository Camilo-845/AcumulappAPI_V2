import { Router } from "express";
import { authenticateToken } from "../../middelwares/auth.middleware";
import validate from "../../middelwares/validation";
import { checkBusinessSubscription } from "./Subscription.controller";
import { checkSubscriptionRequestSchema } from "./DTO/Request";

const router = Router();

router.get(
  "/is-active/:businessId",
  authenticateToken,
  validate(checkSubscriptionRequestSchema),
  checkBusinessSubscription,
);

export default router;
