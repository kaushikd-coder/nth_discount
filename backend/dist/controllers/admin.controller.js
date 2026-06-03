"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDiscountCode = generateDiscountCode;
exports.getStats = getStats;
const db_1 = require("../stores/db");
function generateDiscountCode(req, res) {
    if ((0, db_1.getActiveUnusedCode)()) {
        return res.status(400).json({
            message: "You can generate only one discount code at a time. Use the current code at checkout before generating another.",
        });
    }
    if (!(0, db_1.isEligibleToGenerateCode)()) {
        return res.status(400).json({ message: "Not eligible yet to generate discount code." });
    }
    const percentage = Number(req.body?.percentage ?? 10);
    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 50) {
        return res.status(400).json({ message: "Discount percentage must be between 1 and 50." });
    }
    const code = (0, db_1.generateDiscount)(percentage);
    res.json({ message: "Discount code generated", code });
}
function getStats(_req, res) {
    res.json((0, db_1.stats)());
}
