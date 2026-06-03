"use client";
import { Product } from "../lib/types";


interface ProductCardProps {
    product: Product;
    onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <article className="group flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-800/70 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur hover:-translate-y-1 hover:border-blue-400/40">
            <div>
                <div className="mb-5 flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 ring-1 ring-white/10">
                    <span className="text-4xl font-black text-white/15">
                        {product.name.slice(0, 1)}
                    </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">Premium store item</p>
                    </div>
                    <p className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-200">
                        ₹{product.price}
                    </p>
                </div>
            </div>

            <button
                onClick={onAddToCart}
                className="mt-6 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Add to Cart
            </button>
        </article>
    );
}
