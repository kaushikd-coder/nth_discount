import { Cart } from "./types";

export const CART_USER_ID = "guest-001";

const CART_UPDATED_EVENT = "uniblox-cart-updated";

export function getCartQuantity(cart: Cart | null | undefined) {
    return cart?.items.reduce((total, item) => total + item.qty, 0) ?? 0;
}

export function dispatchCartUpdated(cart: Cart) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent<number>(CART_UPDATED_EVENT, {
            detail: getCartQuantity(cart),
        })
    );
}

export function subscribeToCartUpdates(callback: (quantity: number) => void) {
    if (typeof window === "undefined") return () => undefined;

    const handleCartUpdated = (event: Event) => {
        callback((event as CustomEvent<number>).detail ?? 0);
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
}
