import { Router } from "express";
import multer from "multer";
import { uploadImage } from "./Image.controller";
import { authenticateToken } from "@/middelwares/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", authenticateToken, upload.single("image"), uploadImage);

export default router;
