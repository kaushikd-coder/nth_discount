import { AdminStats, Cart, CheckoutResult, DiscountCode, Product } from "./types";

const BASE_URL = "http://localhost:5000/api";

export const getProducts = async (): Promise<{ products?: Product[] } | Product[]> => {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
};

// export const addToCart = async (item: { id: number; quantity: number }) => {
//     const res = await fetch(`${BASE_URL}/cart/add`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(item),
//     });
//     return res.json();
// };


export async function addToCart(params: { userId: string; productId: string; qty: number, price?: number }): Promise<Cart> {
    const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to add to cart");
    return res.json();
}


export const getCart = async (userId: string): Promise<Cart> => {
    const res = await fetch(`${BASE_URL}/cart?userId=${encodeURIComponent(userId)}`);
    return res.json();
};

export const checkout = async (data: { discountCode?: string, userId: string }): Promise<CheckoutResult> => {
    const res = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const getAdminStats = async (): Promise<AdminStats> => {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
};


export async function generateAdminDiscount(percentage: number): Promise<{ code: DiscountCode }> {
    const res = await fetch(`${BASE_URL}/admin/discounts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percentage }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = (data && (data.error || data.message)) || "Something went wrong";
        throw new Error(msg);
    }
    return data;
}