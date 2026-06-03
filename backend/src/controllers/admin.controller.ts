import { Request, Response } from "express";
import {
    generateDiscount,
    getActiveUnusedCode,
    isEligibleToGenerateCode,
    stats,
} from "../stores/db";



export function generateDiscountCode(req: Request, res: Response) {
    if (getActiveUnusedCode()) {
        return res.status(400).json({
            message: "You can generate only one discount code at a time. Use the current code at checkout before generating another.",
        });
    }

    if (!isEligibleToGenerateCode()) {
        return res.status(400).json({ message: "Not eligible yet to generate discount code." });
    }

    const percentage = Number(req.body?.percentage ?? 10);
    if (!Number.isInteger(percentage) || percentage < 1 || percentage > 50) {
        return res.status(400).json({ message: "Discount percentage must be between 1 and 50." });
    }

    const code = generateDiscount(percentage);
    res.json({ message: "Discount code generated", code });
}


export function getStats(_req: Request, res: Response) {
    res.json(stats());
}
