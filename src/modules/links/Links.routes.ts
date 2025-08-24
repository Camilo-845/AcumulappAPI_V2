import { Router } from "express";
import { authenticateToken } from "../../middelwares/auth.middleware";
import { getAllLinks } from "./Links.controller";

const router = Router();

router.get("/", authenticateToken, getAllLinks);

export default router;
