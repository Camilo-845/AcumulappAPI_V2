import { Router } from "express";
import exampleRoutes from "./example.routes";

const router = Router();

// Montamos las rutas de ejemplo bajo el prefijo /example
router.use("/example", exampleRoutes);

// Aquí montarías otras rutas de la v1
// router.use('/products', productRoutes);

export default router;
