import { Router } from "express";
import exampleRoutes from "./example.routes";
import accountRoutes from "../../../modules/account/Account.routes";
import businessRoutes from "../../../modules/business/Business.routes";

const router = Router();

// Montamos las rutas de ejemplo bajo el prefijo /example
router.use("/example", exampleRoutes);

// Aquí montarías otras rutas de la v1
router.use("/auth", accountRoutes);
router.use("/business", businessRoutes);

export default router;
