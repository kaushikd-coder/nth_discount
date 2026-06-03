"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = addToCart;
exports.getCart = getCart;
const db_1 = require("../stores/db");
function addToCart(req, res) {
    const { userId, productId, qty } = req.body || {};
    if (!userId || !productId || typeof qty !== "number" || qty <= 0) {
        return res.status(400).json({ error: "userId, productId and qty are required" });
    }
    const product = (0, db_1.findProduct)(productId);
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    // initialize user shopping cart 
    const cart = (0, db_1.getResCart)(userId);
    // Checked if product is still exist in the cart or not 
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
        //  Update quantity while preserving original price 
        existing.qty += qty;
        if (typeof existing.unitPrice !== "number") {
            existing.unitPrice = product.price;
        }
    }
    else {
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
function getCart(req, res) {
    const userId = String(req.query.userId || "");
    if (!userId)
        return res.status(400).json({ error: "userId is required" });
    const cart = (0, db_1.getResCart)(userId);
    res.json(cart);
}
