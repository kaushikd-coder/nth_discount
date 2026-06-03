"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_routes_1 = __importDefault(require("./cart.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const checkout_routes_1 = __importDefault(require("./checkout.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const router = (0, express_1.Router)();
router.use("/cart", cart_routes_1.default);
router.use("/checkout", checkout_routes_1.default);
router.use("/admin", admin_routes_1.default);
router.use("/products", product_routes_1.default);
router.get("/", (_req, res) => {
    res.json({ message: "API base route active" });
});
exports.default = router;
