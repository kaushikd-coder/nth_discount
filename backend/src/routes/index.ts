import { Router } from "express";
import cartRoutes from "./cart.routes";
import adminRoutes from "./admin.routes";
import checkoutRoutes from "./checkout.routes";
import productRoutes from "./product.routes";

const router = Router();

router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);

router.get("/", (_req, res) => {
    res.json({ message: "API base route active" });
});

export default router;
