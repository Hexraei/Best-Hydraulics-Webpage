"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatINR } from "@/lib/currency";
import { ProductForm } from "@/components/admin/product-form";
import type { AdminProduct, AdminQuote } from "@/components/admin/types";
import { emptyProduct } from "@/components/admin/types";

type Tab = "products" | "quotes";

export function AdminDashboard({
  initialProducts,
  quotes,
}: {
  initialProducts: AdminProduct[];
  quotes: AdminQuote[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return initialProducts;
    return initialProducts.filter((product) =>
      [product.name, product.category, product.partNumber ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [initialProducts, search]);

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const remove = async (product: AdminProduct) => {
    if (
      !window.confirm(
        `Delete "${product.name}"?\n\nThis removes it from the website permanently and cannot be undone.`,
      )
    ) {
      return;
    }

    setBusyId(product.id);
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setBusyId(null);

    if (response.ok) {
      setNotice(`"${product.name}" was deleted.`);
      router.refresh();
    } else {
      setNotice("Could not delete that product. Please try again.");
    }
  };

  if (editing) {
    return (
      <ProductForm
        product={editing}
        onDone={(message) => {
          setEditing(null);
          if (message) setNotice(message);
          router.refresh();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Best Hydraulics
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">My Products</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex h-12 items-center rounded-md border-2 border-slate-300 bg-white px-5 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              View website
            </Link>
            <button
              onClick={signOut}
              className="h-12 rounded-md border-2 border-slate-300 bg-white px-5 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4">
          <nav className="flex gap-1">
            {(
              [
                ["products", `Products (${initialProducts.length})`],
                ["quotes", `Enquiries (${quotes.length})`],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`-mb-px border-b-4 px-5 py-4 text-base font-bold transition-colors ${
                  tab === key
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4">
        {notice && (
          <div className="mt-5 flex items-start justify-between gap-4 rounded-md border-2 border-emerald-300 bg-emerald-50 p-4">
            <p className="text-base font-semibold text-emerald-800">{notice}</p>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss"
              className="text-xl leading-none text-emerald-700 hover:text-emerald-900"
            >
              ×
            </button>
          </div>
        )}

        {tab === "products" ? (
          <section className="mt-6 space-y-5">
            <button
              onClick={() => setEditing(emptyProduct())}
              className="h-16 w-full rounded-md bg-slate-900 text-lg font-bold text-white transition-colors hover:bg-slate-700"
            >
              + Add a New Product
            </button>

            {initialProducts.length > 0 && (
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your products..."
                className="h-14 w-full rounded-md border-2 border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-slate-900"
              />
            )}

            {initialProducts.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-xl font-bold text-slate-900">No products yet</p>
                <p className="mx-auto mt-2 max-w-md text-base text-slate-600">
                  Tap &ldquo;Add a New Product&rdquo; above to put your first product on the website.
                </p>
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Nothing found for &ldquo;{search}&rdquo;
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 h-12 rounded-md border-2 border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {visible.map((product) => {
                  const prices = product.variants.map((variant) => variant.price);
                  const from = prices.length ? Math.min(...prices) : 0;
                  const totalStock = product.variants.reduce(
                    (sum, variant) => sum + variant.stock,
                    0,
                  );

                  return (
                    <article
                      key={product.id}
                      className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-nowrap"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white p-2">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-slate-400">
                            No photo
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                        <p className="mt-0.5 text-base text-slate-600">
                          {product.category} · {formatINR(from)}
                          {product.variants.length > 1 ? " onwards" : ""}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                          {!product.published && (
                            <span className="rounded bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                              Hidden
                            </span>
                          )}
                          {totalStock === 0 && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                              Out of stock
                            </span>
                          )}
                          <span className="text-slate-500">
                            {product.variants.length} size
                            {product.variants.length === 1 ? "" : "s"}
                          </span>
                        </p>
                      </div>

                      <div className="flex w-full gap-2 sm:w-auto">
                        <button
                          onClick={() => setEditing(product)}
                          className="h-12 flex-1 rounded-md bg-slate-900 px-6 text-base font-semibold text-white hover:bg-slate-700 sm:flex-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(product)}
                          disabled={busyId === product.id}
                          className="h-12 flex-1 rounded-md border-2 border-slate-300 bg-white px-5 text-base font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 sm:flex-none"
                        >
                          {busyId === product.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {quotes.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-xl font-bold text-slate-900">No enquiries yet</p>
                <p className="mx-auto mt-2 max-w-md text-base text-slate-600">
                  When a customer sends a quote request from the website, it will appear here.
                </p>
              </div>
            ) : (
              quotes.map((quote) => (
                <article key={quote.id} className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{quote.name}</h3>
                      {quote.businessName && (
                        <p className="text-base text-slate-600">{quote.businessName}</p>
                      )}
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(quote.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatINR(quote.subtotal)}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`tel:${quote.phoneNumber}`}
                      className="flex h-12 items-center rounded-md bg-slate-900 px-5 text-base font-semibold text-white hover:bg-slate-700"
                    >
                      Call {quote.phoneNumber}
                    </a>
                    <a
                      href={`https://wa.me/91${quote.phoneNumber.replace(/[^0-9]/g, "").slice(-10)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 items-center rounded-md bg-emerald-600 px-5 text-base font-semibold text-white hover:bg-emerald-700"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${quote.emailId}`}
                      className="flex h-12 items-center rounded-md border-2 border-slate-300 bg-white px-5 text-base font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Email
                    </a>
                  </div>

                  {quote.message && (
                    <p className="mt-4 rounded-md bg-slate-50 p-4 text-base leading-7 text-slate-700">
                      &ldquo;{quote.message}&rdquo;
                    </p>
                  )}

                  {quote.lines.length > 0 && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Items requested
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {quote.lines.map((line, index) => (
                          <li
                            key={index}
                            className="flex flex-wrap justify-between gap-2 text-base text-slate-700"
                          >
                            <span>
                              {line.productName}{" "}
                              <span className="text-slate-500">
                                {line.specs || line.dimension ? `(${line.specs || line.dimension}) ` : ""}×{" "}
                                {line.quantity}
                              </span>
                            </span>
                            <span className="font-semibold">{formatINR(line.lineTotal)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}
