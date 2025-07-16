import { Router } from "express";
import validate from "../../middelwares/validation";
import { localRegisterRequestSchema, loginRequestSchema } from "./DTO/Request";
import {
  businessRegister,
  clientRegister,
  getAccountDetailsByEmail,
  getAccountDetailsById,
  login,
} from "./Account.controller";
import { authenticateToken } from "../../middelwares/auth.middleware";
import {
  getDetailsByEmailSchema,
  getDetailsByIdSchema,
} from "./DTO/Request/account.request.dto";

const router = Router();

router.post("/login", validate(loginRequestSchema), login);
router.post(
  "/register/client",
  validate(localRegisterRequestSchema),
  clientRegister,
);
router.post(
  "/register/business",
  validate(localRegisterRequestSchema),
  businessRegister,
);
router.get(
  "/email/:email",
  authenticateToken,
  validate(getDetailsByEmailSchema),
  getAccountDetailsByEmail,
);
router.get(
  "/:id",
  authenticateToken,
  validate(getDetailsByIdSchema),
  getAccountDetailsById,
);
export default router;
