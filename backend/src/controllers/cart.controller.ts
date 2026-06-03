import { Request, Response } from "express";
import { findProduct, getResCart } from "../stores/db";

export function addToCart(req: Request, res: Response) {
    const { userId, productId, qty } = req.body || {};

    if (!userId || !productId || typeof qty !== "number" || qty <= 0) {
        return res.status(400).json({ error: "userId, productId and qty are required" });
    }

    const product = findProduct(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // initialize user shopping cart 
    const cart: any = getResCart(userId);

    // Checked if product is still exist in the cart or not 
    const existing = cart.items.find((i: any) => i.productId === productId);

    if (existing) {
        //  Update quantity while preserving original price 
        existing.qty += qty;
        if (typeof existing.unitPrice !== "number") {
            existing.unitPrice = product.price;
        }
    } else {
        //  Add new product with current price snapshot
        cart.items.push({
            productId,
            qty,
            unitPrice: product.price,
            name: product.name,
        });
    }

    cart.updatedAt = Date.now();
    return res.json(cart);
}


export function getCart(req: Request, res: Response) {
    const userId = String(req.query.userId || "");
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const cart = getResCart(userId);
    res.json(cart);
}
