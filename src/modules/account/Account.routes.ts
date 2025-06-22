import { Router } from "express";
import validate from "../../middelwares/validation";
import { loginRequestSchema } from "./DTO/Request";
import { login } from "./Account.controller";

const router = Router();

router.post("/login", validate(loginRequestSchema), login);

export default router;
