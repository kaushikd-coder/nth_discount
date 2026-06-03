"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = checkout;
const db_1 = require("../stores/db");
const crypto_1 = require("crypto");
function checkout(req, res) {
    const { userId, discountCode } = req.body || {};
    if (!userId)
        return res.status(400).json({ error: "userId is required" });
    const cart = (0, db_1.getResCart)(userId);
    if (!cart.items.length)
        return res.status(400).json({ error: "Cart is empty" });
    // Calculate cart total and validate products
    let subtotal = 0;
    for (const item of cart.items) {
        const product = (0, db_1.findProduct)(item.productId);
        if (!product)
            return res.status(400).json({ error: `Invalid product ${item.productId}` });
        subtotal += product.price * item.qty;
    }
    subtotal = (0, db_1.round2)(subtotal);
    // Track order sequence for special discount eligibility
    const willBeOrderNumber = db_1.orderCount + 1;
    const isNthOrder = willBeOrderNumber % db_1.NTH_ORDER === 0;
    // Process discount application
    let appliedDiscount = 0;
    let codeUsed;
    if (discountCode) {
        const code = db_1.discountCodes.find((c) => c.code === discountCode);
        if (!code)
            return res.status(400).json({ error: "Invalid discount code" });
        if (code.used)
            return res.status(400).json({ error: "Code already used" });
        if (code.issuedAtOrderNumber !== willBeOrderNumber) {
            return res.status(400).json({ error: "Discount code is not valid for this checkout" });
        }
        if (code.percentage < 1 || code.percentage > 50) {
            return res.status(400).json({ error: "Invalid discount code" });
        }
        appliedDiscount = (0, db_1.round2)(subtotal * (code.percentage / 100));
        code.used = true;
        codeUsed = code;
    }
    // Calculate final order amount
    const total = (0, db_1.round2)(subtotal - appliedDiscount);
    // Create order record
    const order = {
        id: (0, crypto_1.randomUUID)(),
        userId,
        items: cart.items,
        subtotal,
        discountCode: codeUsed?.code,
        discountAmount: appliedDiscount,
        total,
        createdAt: Date.now(),
    };
    db_1.orders.push(order);
    // Update analytics and clear user cart
    (0, db_1.updateStats)(cart.items, total, appliedDiscount);
    db_1.carts.set(userId, { userId, items: [], updatedAt: Date.now() });
    return res.json({
        message: codeUsed
            ? `Order placed! ${codeUsed.percentage}% discount applied with your code.`
            : isNthOrder
                ? "Order placed successfully. Admin can now generate a discount code."
                : "Order placed successfully.",
        order,
    });
}
