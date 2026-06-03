import { randomUUID } from "crypto";

export type Product = { id: string; name: string; price: number };
export type CartItem = { productId: string; qty: number };
export type Cart = { userId: string; items: CartItem[]; updatedAt: number };
export type DiscountCode = {
    code: string;
    percentage: number;
    used: boolean;
    issuedAtOrderNumber: number;
};
export type Order = {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    total: number;
    createdAt: number;
};

export const NTH_ORDER = 3;

export const products: Product[] = [
    { id: "p1", name: "T-Shirt", price: 25 },
    { id: "p2", name: "Jeans", price: 60 },
    { id: "p3", name: "Sneakers", price: 120 },
];

export const carts = new Map<string, Cart>();
export const orders: Order[] = [];
export const discountCodes: DiscountCode[] = [];

export let orderCount = 0;
export let itemsPurchasedCount = 0;
export let totalPurchaseAmount = 0;
export let totalDiscountAmount = 0;

export function round2(n: number) {
    return Math.round(n * 100) / 100;
}

export function findProduct(id: string) {
    return products.find((p) => p.id === id);
}

export function getResCart(userId: string): Cart {
    //  Initialize cart if user is shopping for the first time 
    if (!carts.has(userId)) {
        carts.set(userId, { userId, items: [], updatedAt: Date.now() });
    }
    return carts.get(userId)!;
}

export function generateDiscount(percentage = 10) {
    const nextOrder = orderCount + 1;
    const code = `SAVE${percentage}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
    const newCode: DiscountCode = {
        code,
        percentage,
        used: false,
        issuedAtOrderNumber: nextOrder,
    };
    discountCodes.push(newCode);
    return newCode;
}

export function getActiveUnusedCode() {
    const nextOrder = orderCount + 1;
    return discountCodes.find((c) => !c.used && c.issuedAtOrderNumber === nextOrder);
}

export function isEligibleToGenerateCode() {
    // Admin can issue one coupon for an upcoming Nth checkout.
    const nextOrder = orderCount + 1;
    return nextOrder % NTH_ORDER === 0 && !getActiveUnusedCode();
}

export function updateStats(
    items: CartItem[],
    total: number,
    discount: number
) {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    itemsPurchasedCount += itemCount;
    totalPurchaseAmount += total;
    totalDiscountAmount += discount;
    orderCount++;
}

export function stats() {
    return {
        orderCount,
        nthRule: NTH_ORDER,
        itemsPurchasedCount,
        totalPurchaseAmount,
        totalDiscountAmount,
        issuedDiscountCodes: discountCodes,
        activeDiscountCodes: discountCodes.filter(
            (c) => !c.used && c.issuedAtOrderNumber === orderCount + 1
        ),
    };
}
