import { Router } from "express";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { paginationQueryParams } from "../../core/dtos/pagination.dto";
import validate from "../../middelwares/validation";
import {
  getAllBusiness,
  getAllBusinessCategories,
  getBusinessById,
  completeBusinessProfile,
  updateBusinessCategories,
} from "./Business.controller";
import z from "zod";
import { getBusinessFiltersRequestSchema } from "./DTO/Request/getBusinessFilters.request.dto";
import { updateBusinessSchema } from "./DTO/Request/updateBusiness.request.dto";
import { updateBusinessCategoriesSchema } from "./DTO/Request/updateBusinessCategories.request.dto";
import { authorizeRoles } from "../../middelwares";

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
router.get("/:id", authenticateToken, getBusinessById);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["Owner"]),
  validate(updateBusinessSchema),
  completeBusinessProfile,
);

router.put(
  "/:id/categories",
  authenticateToken,
  authorizeRoles(["Owner"]),
  validate(updateBusinessCategoriesSchema),
  updateBusinessCategories,
);

export default router;
