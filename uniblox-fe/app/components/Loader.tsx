type LoaderProps = {
    variant?: "products" | "cart" | "admin";
};

function SkeletonBlock({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-2xl bg-slate-700/60 ${className}`} />;
}

function PageHeaderSkeleton() {
    return (
        <div className="mb-8">
            <SkeletonBlock className="h-4 w-28 rounded-full bg-blue-400/20" />
            <SkeletonBlock className="mt-3 h-9 w-56" />
            <SkeletonBlock className="mt-3 h-5 w-full max-w-md" />
        </div>
    );
}

function ProductSkeleton() {
    return (
        <section>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                    <SkeletonBlock className="h-4 w-40 rounded-full bg-blue-400/20" />
                    <SkeletonBlock className="mt-3 h-8 w-52" />
                </div>
                <SkeletonBlock className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                    <article
                        key={item}
                        className="min-h-56 rounded-3xl border border-white/10 bg-slate-800/70 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5"
                    >
                        <SkeletonBlock className="mb-5 h-24 w-full" />
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <SkeletonBlock className="h-5 w-28" />
                                <SkeletonBlock className="mt-3 h-4 w-36" />
                            </div>
                            <SkeletonBlock className="h-8 w-16 rounded-full bg-blue-400/20" />
                        </div>
                        <SkeletonBlock className="mt-6 h-12 w-full bg-blue-400/20" />
                    </article>
                ))}
            </div>
        </section>
    );
}

function CartSkeleton() {
    return (
        <main className="mx-auto max-w-4xl px-5 py-10">
            <PageHeaderSkeleton />
            <section className="rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                <div className="space-y-3">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-3"
                        >
                            <SkeletonBlock className="h-5 w-36" />
                            <SkeletonBlock className="h-5 w-16 bg-blue-400/20" />
                        </div>
                    ))}
                </div>
                <SkeletonBlock className="mt-5 h-14 w-full bg-blue-400/15" />
                <SkeletonBlock className="mt-5 h-5 w-40" />
                <SkeletonBlock className="mt-2 h-12 w-full" />
                <SkeletonBlock className="mt-6 h-12 w-full bg-emerald-400/20" />
            </section>
        </main>
    );
}

function AdminSkeleton() {
    return (
        <main className="mx-auto max-w-4xl px-5 py-10">
            <PageHeaderSkeleton />
            <section className="rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                <div className="grid gap-4 sm:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <SkeletonBlock className="h-4 w-28" />
                            <SkeletonBlock className="mt-3 h-8 w-20 bg-blue-400/20" />
                        </div>
                    ))}
                </div>
                <SkeletonBlock className="mt-6 h-6 w-40" />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[0, 1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3"
                        >
                            <SkeletonBlock className="h-5 w-28 bg-blue-400/20" />
                            <SkeletonBlock className="h-5 w-14" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function Loader({ variant = "products" }: LoaderProps) {
    if (variant === "cart") return <CartSkeleton />;
    if (variant === "admin") return <AdminSkeleton />;

    return <ProductSkeleton />;
}
