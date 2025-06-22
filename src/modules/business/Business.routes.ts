import { Router } from "express";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import validate from "../../middelwares/validation";
import { getAllBusiness } from "./Business.controller";
import z from "zod";

const router = Router();

const businessListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.get(
  "/",
  authenticateToken,
  validate(businessListRouteSchema),
  getAllBusiness,
);

export default router;
