import { Router } from "express";
import { generateDiscountCode, getStats } from "../controllers/admin.controller";

const router = Router();

router.post("/discounts/generate", generateDiscountCode);
router.get("/stats", getStats);

export default router;
