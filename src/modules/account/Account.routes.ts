import { Router } from "express";
import validate from "../../middelwares/validation";
import {
  getDetailsByEmail,
  localRegisterRequestSchema,
  loginRequestSchema,
} from "./DTO/Request";
import {
  businessRegister,
  clientRegister,
  getAccountDetailsByEmail,
  getAccountDetailsById,
  login,
} from "./Account.controller";
import { authenticateToken } from "../../middelwares/auth.middleware";

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
router.get("/:id", authenticateToken, getAccountDetailsById);
router.get(
  "/email",
  authenticateToken,
  validate(getDetailsByEmail),
  getAccountDetailsByEmail,
);
export default router;
