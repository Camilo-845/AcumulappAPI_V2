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
  updateBusinessLinks,
  getFavoriteBusiness,
  markBusinessAsFavorite,
  unmarkBusinessAsFavorite,
  isFavoriteBusiness,
} from "./Business.controller";
import z from "zod";
import { businessIdParamSchema } from "./DTO/Request/businessId.request.dto";
import { getBusinessFiltersRequestSchema } from "./DTO/Request/getBusinessFilters.request.dto";
import { updateBusinessSchema } from "./DTO/Request/updateBusiness.request.dto";
import { updateBusinessCategoriesSchema } from "./DTO/Request/updateBusinessCategories.request.dto";
import { updateBusinessLinksSchema } from "./DTO/Request/updateBusinessLinks.request.dto";
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

router.get(
  "/favorites",
  authenticateToken,
  validate(getBusinessFiltersRequestSchema),
  validate(businessListRouteSchema),
  getFavoriteBusiness,
);

router.post(
  "/mark-as-favorite/:businessId",
  authenticateToken,
  validate(businessIdParamSchema),
  markBusinessAsFavorite,
);

router.post(
  "/unmark-as-favorite/:businessId",
  authenticateToken,
  validate(businessIdParamSchema),
  unmarkBusinessAsFavorite,
);

router.get(
  "/is-favorite/:businessId",
  authenticateToken,
  validate(businessIdParamSchema),
  isFavoriteBusiness,
);

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

router.put(
  "/:id/links",
  authenticateToken,
  authorizeRoles(["Owner"]),
  validate(updateBusinessLinksSchema),
  updateBusinessLinks,
);

export default router;
