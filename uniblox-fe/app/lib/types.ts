export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Discount {
    code: string;
    percent: number;
}

export interface CartLineItem {
    productId: string;
    name?: string;
    qty: number;
    unitPrice?: number;
}

export interface Cart {
    userId: string;
    items: CartLineItem[];
    updatedAt?: number;
}

export interface DiscountCode {
    code: string;
    percentage: number;
    used: boolean;
    issuedAtOrderNumber: number;
}

export interface AdminStats {
    orderCount: number;
    totalPurchaseAmount: number;
    totalDiscountAmount: number;
    issuedDiscountCodes: DiscountCode[];
    activeDiscountCodes: DiscountCode[];
}

export interface CheckoutOrder {
    subtotal: number;
    discountAmount: number;
    total: number;
    discountCode?: string;
}

export interface CheckoutResult {
    error?: string;
    order?: CheckoutOrder;
}
