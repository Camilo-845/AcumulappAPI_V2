import { Router } from "express";
import validate from "../../middelwares/validation";
import { clientRegisterRequestSchema, loginRequestSchema } from "./DTO/Request";
import { clientRegister, login } from "./Account.controller";

const router = Router();

router.post("/login", validate(loginRequestSchema), login);
router.post(
  "/register/client",
  validate(clientRegisterRequestSchema),
  clientRegister,
);

export default router;
