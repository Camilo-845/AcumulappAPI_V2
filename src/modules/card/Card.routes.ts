import { Router } from "express";
import { z } from "zod";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import { authenticateToken } from "../../middelwares/auth.middleware";
import validate from "../../middelwares/validation";
import {
  createCard,
  getAllCards,
  getAllCardsByBusinessId,
  getAllCardStates,
  updateCard,
} from "./Card.controller";
import { createCardRequestSchema } from "./DTO/Request/createCard.request.dto";
import { updateCardRequestSchema } from "./DTO/Request/updateCard.request.dto";
import {
  getDetailsByIdQuerySchema,
  getDetailsByIdSchema,
} from "./DTO/Request/card.request.dto";
import { authorizeRoles } from "../../middelwares";

const router = Router();

const cardListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.get("/", authenticateToken, validate(cardListRouteSchema), getAllCards);
router.get("/states", authenticateToken, getAllCardStates);

const getCardsByBusinessSchema = z.object({
  params: getDetailsByIdSchema.shape.params,
  query: getDetailsByIdQuerySchema.shape.query.extend(
    paginationQueryParams.shape,
  ),
});

router.get(
  "/business/:id",
  authenticateToken,
  validate(getCardsByBusinessSchema),
  getAllCardsByBusinessId,
);
router.post(
  "/",
  authenticateToken,
  validate(createCardRequestSchema),
  authorizeRoles(["Owner"]),
  createCard,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["Owner"]),
  validate(updateCardRequestSchema),
  updateCard,
);

export default router;
