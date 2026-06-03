"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "../lib/api";
import { CART_USER_ID, getCartQuantity, subscribeToCartUpdates } from "../lib/cartEvents";
import { markClientRouteNavigation } from "../lib/navigationState";

export default function Navbar() {
    const path = usePathname();
    const [cartQuantity, setCartQuantity] = useState(0);
    const links = [
        { name: "Home", href: "/" },
        { name: "Cart", href: "/cart" },
        { name: "Admin", href: "/admin" },
    ];

    useEffect(() => {
        let mounted = true;

        getCart(CART_USER_ID)
            .then((cart) => {
                if (mounted) setCartQuantity(getCartQuantity(cart));
            })
            .catch(() => {
                if (mounted) setCartQuantity(0);
            });

        const unsubscribe = subscribeToCartUpdates(setCartQuantity);

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return (
        <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/15 text-xl ring-1 ring-blue-400/30">
                        🛒
                    </span>
                    <div>
                        <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                            Uniblox Store
                        </h1>
                        <p className="hidden text-xs text-slate-400 sm:block">
                            Smart discounts, simple shopping
                        </p>
                    </div>
                </Link>
                <ul className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-slate-300">
                    {links.map((link) => {
                        const active = path === link.href;

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => {
                                        if (!active) markClientRouteNavigation();
                                    }}
                                    className={`rounded-full px-3 py-1.5 font-medium ${active
                                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {link.name}
                                        {link.name === "Cart" && cartQuantity > 0 && (
                                            <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1.5 text-[11px] font-bold leading-none text-white ring-1 ring-white/20">
                                                {cartQuantity > 99 ? "99+" : cartQuantity}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
