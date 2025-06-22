import { Router } from "express";
import validate from "../../middelwares/validation";
import { localRegisterRequestSchema, loginRequestSchema } from "./DTO/Request";
import { businessRegister, clientRegister, login } from "./Account.controller";

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

export default router;
