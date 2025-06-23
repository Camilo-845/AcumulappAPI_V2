import { Router } from "express";
import { z } from "zod";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import { authenticateToken } from "../../middelwares/auth.middleware";
import validate from "../../middelwares/validation";
import { createCard, getAllCards } from "./Card.controller";
import { createCardRequestSchema } from "./DTO/Request/createCard.request.dto";

const router = Router();

const cardListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.get("/", authenticateToken, validate(cardListRouteSchema), getAllCards);
router.get(
  "/business/:id",
  authenticateToken,
  validate(cardListRouteSchema),
  getAllCards,
);
router.post(
  "/",
  authenticateToken,
  validate(createCardRequestSchema),
  createCard,
);

export default router;
