"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
const db_1 = require("../stores/db");
function getProducts(_req, res) {
    res.json({ products: db_1.products });
}
