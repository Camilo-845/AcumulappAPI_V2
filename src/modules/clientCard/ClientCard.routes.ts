import { Router } from "express";
import { z } from "zod";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import { authenticateToken } from "../../middelwares/auth.middleware";
import validate from "../../middelwares/validation";
import { createClientCardRequestSchema } from "./DTO/Request/createClientCard.request.dto";
import {
  activateCard,
  addStampToClientCard,
  createClientCard,
  findById,
  findByUniqueCode,
  getAllClientCardsByBusiness,
  getAllClientCardsByClient,
  markClientCardAsRedeemed,
} from "./ClientCard.controller";
import {
  addStampRequestSchema,
  getClientCardByBusinessRequestSchema,
  getClientCardByClientRequestSchema,
} from "./DTO/Request/getClientCards.request.dto";

const router = Router();

const clientCardListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.post(
  "/",
  authenticateToken,
  validate(createClientCardRequestSchema),
  createClientCard,
);
router.get(
  "/client",
  authenticateToken,
  validate(getClientCardByClientRequestSchema),
  validate(clientCardListRouteSchema),
  getAllClientCardsByClient,
);
router.get(
  "/business",
  authenticateToken,
  validate(getClientCardByBusinessRequestSchema),
  validate(clientCardListRouteSchema),
  getAllClientCardsByBusiness,
);
router.get("/:id", authenticateToken, findById);
router.get("/unique-code/:uniqueCode", authenticateToken, findByUniqueCode);
router.post("/activate/:uniqueCode", authenticateToken, activateCard);
router.post(
  "/add-stamp/:uniqueCode",
  authenticateToken,
  validate(addStampRequestSchema),
  addStampToClientCard,
);
router.post(
  "/mark-as-redeemed/:uniqueCode",
  authenticateToken,
  markClientCardAsRedeemed,
);

export default router;
