import { Router } from "express";
import validate from "../../middelwares/validation";
import { localRegisterRequestSchema, loginRequestSchema } from "./DTO/Request";
import { refreshTokenRequestSchema } from "./DTO/Request/refreshToken.request.dto";
import {
  businessRegister,
  clientRegister,
  clerkSignIn,
  getAccountDetailsByEmail,
  getAccountDetailsById,
  login,
  refreshToken,
  updateAccount,
} from "./Account.controller";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { updateAccountRequestSchema } from "./DTO/Request/updateAccount.request.dto";
import {
  getDetailsByEmailSchema,
  getDetailsByIdSchema,
  loginQuerySchema,
} from "./DTO/Request/account.request.dto";
import { clerkMiddleware } from "@clerk/express";

const router = Router();

router.post(
  "/login",
  validate(loginRequestSchema),
  validate(loginQuerySchema),
  login,
);
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

router.post("/refresh", validate(refreshTokenRequestSchema), refreshToken);

router.post("/clerk-signin", clerkMiddleware(), clerkSignIn);

router.put(
  "/:id",
  authenticateToken,
  validate(updateAccountRequestSchema),
  updateAccount,
);

export default router;
