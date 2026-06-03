"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { addToCart, getProducts } from "./lib/api";
import { CART_USER_ID, dispatchCartUpdated } from "./lib/cartEvents";
import { shouldShowInitialSkeleton } from "./lib/navigationState";
import { Product } from "./lib/types";
import Loader from "./components/Loader";
import ProductCard from "./components/ProductCard";

type ProductsResponse = {
  products?: Product[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton] = useState(() => shouldShowInitialSkeleton());

  // fetch product list from backend
  useEffect(() => {
    const loadProducts = async () => {
      const data: ProductsResponse | Product[] = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products ?? []);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // add item to cart
  // const handleAddToCart = async (id: number) => {
  //   await addToCart({ id, quantity: 1 });
  //   alert("Added to cart");
  // };
  const handleAddToCart = async (productId: string, price: number) => {
    const cart = await addToCart({ userId: CART_USER_ID, productId, qty: 1, price });
    dispatchCartUpdated(cart);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800/60 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5 sm:p-10">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Uniblox Deals
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Shop clean essentials with instant cart discounts.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Browse hand-picked products, add them to your cart, and apply discount codes during checkout.
            </p>
          </div>
        </section>

        {loading && showSkeleton ? (
          <Loader variant="products" />
        ) : loading ? null : products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-8 text-center text-slate-300">
            No products found.
          </div>
        ) : (
          <section>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Available Products
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">Featured collection</h3>
              </div>
              <p className="text-sm text-slate-400">{products.length} items ready to shop</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onAddToCart={() => handleAddToCart(String(item.id), item.price)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
