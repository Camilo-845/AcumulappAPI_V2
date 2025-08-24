import { Router } from "express";
import { createRating } from "./Rating.controller";
import { createRatingRequestSchema } from "./DTO/Request/createRating.request.dto";
import validate from "../../middelwares/validation";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { authorizeRoles } from "../../middelwares";

const router = Router();

router.post(
  "/",
  authenticateToken,
  validate(createRatingRequestSchema),
  createRating
);

export default router;
