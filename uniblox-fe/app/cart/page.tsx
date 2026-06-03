"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getAdminStats, getCart, checkout } from "../lib/api";
import { CART_USER_ID, dispatchCartUpdated } from "../lib/cartEvents";
import { shouldShowInitialSkeleton } from "../lib/navigationState";
import { Cart, CartLineItem, CheckoutResult, DiscountCode } from "../lib/types";

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSkeleton] = useState(() => shouldShowInitialSkeleton());
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<CheckoutResult | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [availableCodes, setAvailableCodes] = useState<DiscountCode[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // NEW: discount code state + invalid flag
    const [discountCode, setDiscountCode] = useState<string>("");
    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const [data, stats] = await Promise.all([
                    getCart(CART_USER_ID),
                    getAdminStats(),
                ]);
                setCart(data);
                setAvailableCodes(stats.activeDiscountCodes ?? []);
                dispatchCartUpdated(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    const handleApplyCode = async (code: string) => {
        setDiscountCode(code);
        setInvalidCode(false);
        if (apiError && isDiscountError(apiError)) setApiError(null);
        setCopiedCode(code);

        try {
            await navigator.clipboard.writeText(code);
        } catch {
            // The code is still applied to the input if clipboard access is blocked.
        }
    };

    const totalAmount = useMemo(
        () =>
            cart?.items?.reduce(
                (sum: number, item: CartLineItem) => sum + (item.unitPrice || 0) * item.qty,
                0
            ) ?? 0,
        [cart]
    );

    // Utility: detect if API error is discount-related
    const isDiscountError = (msg?: string | null) => {
        if (!msg) return false;
        const m = msg.toLowerCase();
        return m.includes("invalid discount code") || m.includes("code already used");
    };

    const handlePayNow = async () => {
        try {
            setProcessing(true);
            setApiError(null);
            setResult(null);
            setInvalidCode(false);

            const code = discountCode.trim() || undefined;
            const data = await checkout({ userId: CART_USER_ID, discountCode: code });

            if (data?.error) {
                setApiError(data.error);
                if (isDiscountError(data.error)) {
                    setInvalidCode(true);
                }
                return;
            }

            setResult(data);
            // clear cart in UI after checkout success
            const emptyCart = { userId: CART_USER_ID, items: [], updatedAt: Date.now() };
            setCart(emptyCart);
            dispatchCartUpdated(emptyCart);
            setAvailableCodes((codes) => codes.filter((code) => code.code !== data.order?.discountCode));
            // clear code on success
            setDiscountCode("");
            setCopiedCode(null);
        } catch {
            setApiError("Checkout failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading && showSkeleton) {
        return (
            <>
                <Navbar />
                <Loader variant="cart" />
            </>
        );
    }

    const cartItems = cart?.items ?? [];
    const hasCartItems = cartItems.length > 0;
    const disabled = processing || !hasCartItems;

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-4xl px-5 py-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                        Checkout
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-white">Your Cart</h2>
                    <p className="mt-2 text-slate-400">
                        Review your items and apply an optional discount code.
                    </p>
                </div>

                {loading ? null : !hasCartItems ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-8 text-center text-slate-300 shadow-2xl shadow-black/20">
                        Your cart is empty.
                    </div>
                ) : (
                    <section className="rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                        <ul className="space-y-3">
                            {cartItems.map((item: CartLineItem) => (
                                <li
                                    key={item.productId}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-3"
                                >
                                    <span className="font-medium text-white">
                                        {item.name} <span className="text-slate-400">x {item.qty}</span>
                                    </span>
                                    <span className="font-semibold text-blue-100">
                                        ₹{item.unitPrice ? item.unitPrice * item.qty : 0}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-5 flex items-center justify-between rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 font-semibold">
                            <span>Total:</span>
                            <span className="text-xl text-white">₹{totalAmount}</span>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="discount"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Discount code (optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="discount"
                                    type="text"
                                    inputMode="text"
                                    autoComplete="off"
                                    value={discountCode}
                                    onChange={(e) => {
                                        setDiscountCode(e.target.value.toUpperCase());
                                        if (invalidCode) setInvalidCode(false);
                                        if (apiError && isDiscountError(apiError)) setApiError(null);
                                    }}
                                    placeholder="e.g. SAVE10"
                                    className={[
                                        "w-full rounded-2xl border bg-slate-950/30 px-4 py-3 text-white outline-none",
                                        "placeholder:text-slate-500",
                                        invalidCode
                                            ? "border-red-500/70 focus:ring-2 focus:ring-red-500/40"
                                            : "border-white/10 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30",
                                    ].join(" ")}
                                />
                                {discountCode && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDiscountCode("");
                                            setInvalidCode(false);
                                            if (apiError && isDiscountError(apiError)) setApiError(null);
                                        }}
                                        className="shrink-0 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/10"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            {invalidCode && (
                                <p className="mt-1 text-xs text-red-400">
                                    The discount code is invalid or already used.
                                </p>
                            )}
                            {availableCodes.length > 0 && (
                                <div className="mt-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3">
                                    <p className="text-xs font-medium text-blue-100">
                                        Available coupon{availableCodes.length > 1 ? "s" : ""}. Click a code to copy and apply it.
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {availableCodes.map((code) => (
                                            <button
                                                key={code.code}
                                                type="button"
                                                title="Click to copy and apply"
                                                onClick={() => handleApplyCode(code.code)}
                                                className="rounded-full border border-blue-300/30 bg-slate-950/30 px-3 py-1.5 text-sm font-semibold text-blue-100 hover:bg-blue-500/20"
                                            >
                                                <span className="font-mono">{code.code}</span>
                                                <span className="ml-2 text-blue-200">{code.percentage}% off</span>
                                                {copiedCode === code.code && (
                                                    <span className="ml-2 text-emerald-300">copied</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handlePayNow}
                            disabled={disabled}
                            className="mt-6 w-full rounded-2xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? "Processing..." : "Pay Now"}
                        </button>
                    </section>
                )}

                {apiError && !invalidCode && (
                    <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                        {apiError}
                    </div>
                )}

                {result?.order &&
                    (() => {
                        const { subtotal, discountAmount, total, discountCode } = result.order;
                        const pct =
                            subtotal > 0 ? Math.round((discountAmount / subtotal) * 100) : 0;

                        return (
                            <div className="mt-5 space-y-2 rounded-3xl border border-white/10 bg-slate-800/70 p-5 text-sm shadow-xl shadow-black/20">
                                {discountCode && (
                                    <p className="text-xs text-slate-400">Code used: {discountCode}</p>
                                )}
                                <p>Subtotal: ₹{subtotal}</p>
                                <p>
                                    Discount: ₹{discountAmount} {discountAmount ? `(${pct}%)` : ""}
                                </p>
                                <p className="font-medium">Total: ₹{total}</p>
                                <p className="mt-2 font-semibold text-emerald-300">
                                    Checkout Successful!
                                </p>
                            </div>
                        );
                    })()}
            </main>
        </>
    );
}
