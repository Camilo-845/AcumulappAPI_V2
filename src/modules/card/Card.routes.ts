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
} from "./Card.controller";
import { createCardRequestSchema } from "./DTO/Request/createCard.request.dto";
import { getDetailsByIdSchema } from "./DTO/Request/card.request.dto";
import { authorizeRoles } from "../../middelwares";

const router = Router();

const cardListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.get("/", authenticateToken, validate(cardListRouteSchema), getAllCards);
router.get("/states", authenticateToken, getAllCardStates);
router.get(
  "/business/:id",
  authenticateToken,
  validate(getDetailsByIdSchema),
  validate(cardListRouteSchema),
  getAllCardsByBusinessId,
);
router.post(
  "/",
  authenticateToken,
  validate(createCardRequestSchema),
  authorizeRoles(["Owner"]),
  createCard,
);

export default router;
