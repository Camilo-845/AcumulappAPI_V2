import { Router } from "express";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import validate from "../../middelwares/validation";
import {
  getAllBusiness,
  getAllBusinessCategories,
} from "./Business.controller";
import z from "zod";
import { getBusinessFiltersRequestSchema } from "./DTO/Request/getBusinessFilters.request.dto";

const router = Router();

const businessListRouteSchema = z.object({
  query: paginationQueryParams,
});

router.get(
  "/",
  authenticateToken,
  validate(getBusinessFiltersRequestSchema),
  validate(businessListRouteSchema),
  getAllBusiness,
);

router.get("/categories", authenticateToken, getAllBusinessCategories);

export default router;
