import { Router } from "express";
import { addToCart, getCart } from "../controllers/cart.controller";

const router = Router();

router.post("/add", addToCart);
router.get("/", getCart);

export default router;
