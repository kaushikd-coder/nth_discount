import { Request, Response } from "express";
import { products } from "../stores/db";

export function getProducts(_req: Request, res: Response) {
    res.json({ products });
}
