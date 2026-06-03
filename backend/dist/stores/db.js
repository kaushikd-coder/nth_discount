"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalDiscountAmount = exports.totalPurchaseAmount = exports.itemsPurchasedCount = exports.orderCount = exports.discountCodes = exports.orders = exports.carts = exports.products = exports.NTH_ORDER = void 0;
exports.round2 = round2;
exports.findProduct = findProduct;
exports.getResCart = getResCart;
exports.generateDiscount = generateDiscount;
exports.getActiveUnusedCode = getActiveUnusedCode;
exports.isEligibleToGenerateCode = isEligibleToGenerateCode;
exports.updateStats = updateStats;
exports.stats = stats;
exports.NTH_ORDER = 3;
exports.products = [
    { id: "p1", name: "T-Shirt", price: 25 },
    { id: "p2", name: "Jeans", price: 60 },
    { id: "p3", name: "Sneakers", price: 120 },
];
exports.carts = new Map();
exports.orders = [];
exports.discountCodes = [];
exports.orderCount = 0;
exports.itemsPurchasedCount = 0;
exports.totalPurchaseAmount = 0;
exports.totalDiscountAmount = 0;
function round2(n) {
    return Math.round(n * 100) / 100;
}
function findProduct(id) {
    return exports.products.find((p) => p.id === id);
}
function getResCart(userId) {
    //  Initialize cart if user is shopping for the first time 
    if (!exports.carts.has(userId)) {
        exports.carts.set(userId, { userId, items: [], updatedAt: Date.now() });
    }
    return exports.carts.get(userId);
}
function generateDiscount(percentage = 10) {
    const nextOrder = exports.orderCount + 1;
    const code = `SAVE${percentage}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
    const newCode = {
        code,
        percentage,
        used: false,
        issuedAtOrderNumber: nextOrder,
    };
    exports.discountCodes.push(newCode);
    return newCode;
}
function getActiveUnusedCode() {
    const nextOrder = exports.orderCount + 1;
    return exports.discountCodes.find((c) => !c.used && c.issuedAtOrderNumber === nextOrder);
}
function isEligibleToGenerateCode() {
    // Admin can issue one coupon for an upcoming Nth checkout.
    const nextOrder = exports.orderCount + 1;
    return nextOrder % exports.NTH_ORDER === 0 && !getActiveUnusedCode();
}
function updateStats(items, total, discount) {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    exports.itemsPurchasedCount += itemCount;
    exports.totalPurchaseAmount += total;
    exports.totalDiscountAmount += discount;
    exports.orderCount++;
}
function stats() {
    return {
        orderCount: exports.orderCount,
        nthRule: exports.NTH_ORDER,
        itemsPurchasedCount: exports.itemsPurchasedCount,
        totalPurchaseAmount: exports.totalPurchaseAmount,
        totalDiscountAmount: exports.totalDiscountAmount,
        issuedDiscountCodes: exports.discountCodes,
        activeDiscountCodes: exports.discountCodes.filter((c) => !c.used && c.issuedAtOrderNumber === exports.orderCount + 1),
    };
}
