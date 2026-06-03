// app/discounts/generate/page.tsx
"use client";

import Loader from "@/app/components/Loader";
import Navbar from "@/app/components/Navbar";
import { generateAdminDiscount, getAdminStats } from "@/app/lib/api";
import { shouldShowInitialSkeleton } from "@/app/lib/navigationState";
import { AdminStats, DiscountCode } from "@/app/lib/types";
import { useEffect, useState } from "react";


export default function AdminPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastCode, setLastCode] = useState<DiscountCode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSkeleton] = useState(() => shouldShowInitialSkeleton());
    const [percentage, setPercentage] = useState("10");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const loadStats = async () => {
        setError(null);
        const data = await getAdminStats();
        setStats(data);
    };

    useEffect(() => {
        (async () => {
            try {
                await loadStats();
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleGenerate = async () => {
        try {
            setIsGenerating(true);
            setError(null);
            const discountPercent = Number(percentage);
            if (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 50) {
                setError("Enter a whole number between 1 and 50.");
                return;
            }

            const res = await generateAdminDiscount(discountPercent);
            setLastCode(res.code);
            await loadStats();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to generate code");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePercentageChange = (value: string) => {
        if (value === "") {
            setPercentage("");
            return;
        }

        const nextPercentage = Math.min(Number(value), 50);
        setPercentage(Number.isNaN(nextPercentage) ? "" : String(nextPercentage));
    };

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
                        Discounts
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-white">Generate Promo Code</h2>
                    <p className="mt-2 text-slate-400">
                        Create a discount code and monitor how issued codes are used.
                    </p>
                </div>

                {!loading && (
                <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">
                                Discount percentage
                            </span>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={percentage}
                                onChange={(event) => handlePercentageChange(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30 sm:w-56"
                            />
                        </label>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isGenerating ? "Generating..." : "Generate Discount Code"}
                        </button>

                        {lastCode && (
                            <button
                                type="button"
                                title="Click to copy"
                                onClick={() => handleCopyCode(lastCode.code)}
                                className="group relative rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 hover:bg-emerald-500/20"
                            >
                                New code: <b className="font-mono">{lastCode.code}</b> ({lastCode.percentage}%)
                                <span className="pointer-events-none absolute -top-8 left-0 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200 opacity-0 shadow-lg transition group-hover:opacity-100">
                                    {copiedCode === lastCode.code ? "Copied" : "Click to copy"}
                                </span>
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                            {error}
                        </p>
                    )}

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

                    <div>
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
                </section>
                )}
            </main>
        </>
    );
}
