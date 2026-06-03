"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.post("/discounts/generate", admin_controller_1.generateDiscountCode);
router.get("/stats", admin_controller_1.getStats);
exports.default = router;
