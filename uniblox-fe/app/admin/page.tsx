// app/admin/page.tsx
"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { getAdminStats } from "../lib/api";
import { shouldShowInitialSkeleton } from "../lib/navigationState";
import { AdminStats, DiscountCode } from "../lib/types";

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSkeleton] = useState(() => shouldShowInitialSkeleton());
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            const data = await getAdminStats();
            setStats(data);
            setLoading(false);
        };
        loadStats();
    }, []);

    const handleCopyCode = async (code: string) => {
        setCopiedCode(code);

        try {
            await navigator.clipboard.writeText(code);
        } catch {
            console.log("Failed to copy code to clipboard");
        }
    };

    const getCodeStatus = (code: DiscountCode) => {
        if (code.used) return "used";
        return code.issuedAtOrderNumber === (stats?.orderCount ?? 0) + 1 ? "unused" : "expired";
    };

    if (loading && showSkeleton) {
        return (
            <>
                <Navbar />
                <Loader variant="admin" />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-4xl px-5 py-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                        Admin
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-white">Dashboard</h2>
                    <p className="mt-2 text-slate-400">
                        Track sales, discounts, and issued promo codes.
                    </p>
                </div>

                {!loading && (
                <section className="rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <p className="text-sm text-slate-400">Items Sold</p>
                            <p className="mt-2 text-2xl font-bold text-white">{stats?.orderCount ?? 0}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <p className="text-sm text-slate-400">Purchase Amount</p>
                            <p className="mt-2 text-2xl font-bold text-white">₹{stats?.totalPurchaseAmount ?? 0}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <p className="text-sm text-slate-400">Discount Given</p>
                            <p className="mt-2 text-2xl font-bold text-white">₹{stats?.totalDiscountAmount ?? 0}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="mb-3 font-semibold text-white">Discount Codes</h3>
                        {stats?.issuedDiscountCodes?.length ? (
                            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                                {stats.issuedDiscountCodes.map((c: DiscountCode, i: number) => {
                                    const status = getCodeStatus(c);
                                    const canCopy = status === "unused";

                                    return (
                                        <li
                                            key={i}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3"
                                        >
                                            {canCopy ? (
                                                <button
                                                    type="button"
                                                    title="Click to copy"
                                                    onClick={() => handleCopyCode(c.code)}
                                                    className="group relative font-mono text-blue-100 hover:text-white"
                                                >
                                                    {c.code}
                                                    <span className="pointer-events-none absolute -top-8 left-0 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-xs font-sans text-slate-200 opacity-0 shadow-lg transition group-hover:opacity-100">
                                                        {copiedCode === c.code ? "Copied" : "Click to copy"}
                                                    </span>
                                                </button>
                                            ) : (
                                                <span className="font-mono text-blue-100">{c.code}</span>
                                            )}
                                            <span className="text-slate-300">{c.percentage}%</span>
                                            <span className={
                                                status === "used"
                                                    ? "text-amber-300"
                                                    : status === "unused"
                                                        ? "text-emerald-300"
                                                        : "text-slate-500"
                                            }>
                                                {status}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="rounded-2xl border border-white/10 bg-white/3 p-4 text-sm text-slate-400">
                                No discount codes generated yet.
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <Link
                            href="/discounts/generate"
                            className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:bg-blue-400"
                        >
                            Generate Discount Code
                        </Link>
                    </div>
                </section>
                )}
            </main>
        </>
    );
}
