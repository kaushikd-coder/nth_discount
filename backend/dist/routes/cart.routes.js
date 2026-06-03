"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
router.post("/add", cart_controller_1.addToCart);
router.get("/", cart_controller_1.getCart);
exports.default = router;
