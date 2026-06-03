import { Request, Response } from "express";
import {
    findProduct,
    getResCart,
    discountCodes,
    orderCount,
    orders,
    updateStats,
    round2,
    NTH_ORDER,
    DiscountCode,
    Order,
    carts,
} from "../stores/db";
import { randomUUID } from "crypto";

export function checkout(req: Request, res: Response) {
    const { userId, discountCode } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const cart = getResCart(userId);
    if (!cart.items.length) return res.status(400).json({ error: "Cart is empty" });

    // Calculate cart total and validate products
    let subtotal = 0;
    for (const item of cart.items) {
        const product = findProduct(item.productId);
        if (!product) return res.status(400).json({ error: `Invalid product ${item.productId}` });
        subtotal += product.price * item.qty;
    }
    subtotal = round2(subtotal);

    // Track order sequence for special discount eligibility
    const willBeOrderNumber = orderCount + 1;
    const isNthOrder = willBeOrderNumber % NTH_ORDER === 0;

    // Process discount application
    let appliedDiscount = 0;
    let codeUsed: DiscountCode | undefined;

    if (discountCode) {
        const code = discountCodes.find((c) => c.code === discountCode);
        if (!code) return res.status(400).json({ error: "Invalid discount code" });
        if (code.used) return res.status(400).json({ error: "Code already used" });
        if (code.issuedAtOrderNumber !== willBeOrderNumber) {
            return res.status(400).json({ error: "Discount code is not valid for this checkout" });
        }
        if (code.percentage < 1 || code.percentage > 50) {
            return res.status(400).json({ error: "Invalid discount code" });
        }

        appliedDiscount = round2(subtotal * (code.percentage / 100));
        code.used = true;
        codeUsed = code;
    }

    // Calculate final order amount
    const total = round2(subtotal - appliedDiscount);

    // Create order record
    const order: Order = {
        id: randomUUID(),
        userId,
        items: cart.items,
        subtotal,
        discountCode: codeUsed?.code,
        discountAmount: appliedDiscount,
        total,
        createdAt: Date.now(),
    };
    orders.push(order);

    // Update analytics and clear user cart
    updateStats(cart.items, total, appliedDiscount);
    carts.set(userId, { userId, items: [], updatedAt: Date.now() });

    return res.json({
        message: codeUsed
            ? `Order placed! ${codeUsed.percentage}% discount applied with your code.`
            : isNthOrder
                ? "Order placed successfully. Admin can now generate a discount code."
                : "Order placed successfully.",
        order,
    });
}


