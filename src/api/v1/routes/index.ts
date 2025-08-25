import { Router } from "express";
import exampleRoutes from "./example.routes";
import accountRoutes from "../../../modules/account/Account.routes";
import businessRoutes from "../../../modules/business/Business.routes";
import cardRoutes from "../../../modules/card/Card.routes";
import clientCardRoutes from "../../../modules/clientCard/ClientCard.routes";
import imageRoutes from "../../../modules/image/Image.routes";
import ratingRoutes from "../../../modules/rating/Rating.routes";
import linksRoutes from "../../../modules/links/Links.routes";
import subscriptionRoutes from "../../../modules/subscription/Subscription.routes";

const router = Router();

// Montamos las rutas de ejemplo bajo el prefijo /example
router.use("/example", exampleRoutes);

// Aquí montarías otras rutas de la v1
router.use("/auth", accountRoutes);
router.use("/business", businessRoutes);
router.use("/card", cardRoutes);
router.use("/client-card", clientCardRoutes);
router.use("/image", imageRoutes);
router.use("/rating", ratingRoutes);
router.use("/links", linksRoutes);
router.use("/subscription", subscriptionRoutes);

export default router;
