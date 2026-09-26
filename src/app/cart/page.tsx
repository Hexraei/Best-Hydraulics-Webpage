"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatINR } from "@/lib/currency";
import { primaryPhone } from "@/lib/site";
import { orderedSpecs, variantLabel } from "@/lib/specs";

const fieldClass =
  "h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20";

function CartItemImage({ productName, image }: { productName: string; image?: string }) {
  if (!image) {
    return <div className="h-full w-full bg-slate-100" />;
  }

  return <Image src={image} alt={productName} fill sizes="120px" className="object-contain" />;
}

export default function CartPage() {
  const { lines, subtotal, updateQuantity, updateVariant, clearCart, hydrated } = useCart();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          phoneNumber,
          emailId,
          message,
          company: honeypot,
          lines: lines.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "We could not submit your request. Please try again.");
      }

      clearCart();
      setSuccess(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-50/70 py-16">
        <div className="container max-w-xl text-center">
          <div className="rounded-[4px] border border-slate-200 bg-white p-8 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Quote Request Sent</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Your Request for Quote has been delivered to our sales desk. Our team will get back to you on pricing,
              availability, and dispatch as soon as possible.
            </p>
            <p className="mt-2 text-sm leading-6 font-medium text-slate-600">
              Need it urgently? Call us on{" "}
              <a href={`tel:${primaryPhone}`} className="text-blue-600 hover:text-blue-800">
                {primaryPhone}
              </a>
              .
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-5 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
              >
                Return to Catalog
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="inline-flex h-11 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Send Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70">
      <div className="container py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="space-y-6">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Cart & Request Quote</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Review the items on the left and send a quote request on the right for pricing, dispatch, and service support.
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Selected items</p>
              </div>
              {hydrated && (
                <p className="text-sm font-medium text-slate-600">{lines.length} item{lines.length === 1 ? "" : "s"}</p>
              )}
            </div>

            {/* The server cannot see the saved cart, so render nothing cart-specific until hydration. */}
            {!hydrated ? (
              <div className="h-40 animate-pulse rounded-[4px] border border-slate-200 bg-white" />
            ) : lines.length === 0 ? (
              <section className="rounded-[4px] border border-slate-200 bg-white p-8 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Cart status</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your cart is currently empty</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Add products from the catalog to build a procurement list for your team or send a blank request form for a
                  callback.
                </p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex h-11 items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-4 text-sm font-medium !text-white transition-colors hover:bg-slate-800"
                  >
                    Go to Products
                  </Link>
                </div>

                <dl className="mt-8 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-3">
                  {[
                    { term: "No minimum order", detail: "Single parts or bulk OEM orders get the same handling." },
                    { term: "Transparent pricing", detail: "Quoted prices are the prices you pay, no surprises." },
                    { term: "Fast RFQ turnaround", detail: "We typically respond within 24 hours." },
                  ].map((item) => (
                    <div key={item.term}>
                      <dt className="text-sm font-semibold text-slate-900">{item.term}</dt>
                      <dd className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : (
              <div className="space-y-4">
                {lines.map((line) => {
                  const variant = line.options.find((item) => item.id === line.variantId);
                  const lineTotal = line.unitPrice * line.quantity;

                  return (
                    <article
                      key={line.variantId}
                      className="rounded-[4px] border border-slate-200 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]"
                    >
                      <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="relative aspect-square overflow-hidden rounded-[4px] border border-slate-200 bg-white p-2">
                          <CartItemImage productName={line.productName} image={line.image} />
                        </div>

                        <div className="flex min-w-0 flex-col gap-4">
                          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">{line.productName}</h3>
                              <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">{line.category}</p>
                              <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                                {orderedSpecs(variant?.specs ?? line.specs ?? []).map((spec) => (
                                  <div key={spec.name} className="flex gap-1.5">
                                    <dt className="text-slate-500">{spec.name}:</dt>
                                    <dd className="font-medium text-slate-900">{spec.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                            <p className="text-lg font-semibold tracking-tight text-slate-950">{formatINR(lineTotal)}</p>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_auto] sm:items-end">
                            <label className="space-y-2">
                              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Variant
                              </span>
                              <select
                                value={line.variantId}
                                onChange={(event) => updateVariant(line.variantId, event.target.value)}
                                className="h-11 w-full rounded-[3px] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                              >
                                {line.options.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {variantLabel(item.specs ?? [])}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="space-y-2">
                              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Quantity
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={line.quantity}
                                onChange={(event) => {
                                  // Ignore the transient empty value while retyping, so the line is not dropped.
                                  const quantity = Math.floor(Number(event.target.value));
                                  if (quantity >= 1) updateQuantity(line.variantId, quantity);
                                }}
                                className="h-11 w-full rounded-[3px] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => updateQuantity(line.variantId, 0)}
                              className="h-11 rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <div className="rounded-[4px] border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Subtotal</p>
                    <p className="text-2xl font-semibold tracking-tight text-slate-950">{formatINR(subtotal)}</p>
                  </div>
                  <p className="mt-2 text-right text-[0.72rem] leading-5 text-slate-500">
                    Excl. 18% GST (except Janatics products), subject to change.
                  </p>
                </div>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-[10rem] lg:self-start">
            <form
              onSubmit={handleSubmit}
              className="rounded-[4px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
            >
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-slate-200/75">Request quote</p>
              <div className="mt-4 space-y-4">
                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Name</span>
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">
                    Business name <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                  <input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Phone number</span>
                  <input
                    required
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Email ID</span>
                  <input
                    required
                    type="email"
                    value={emailId}
                    onChange={(event) => setEmailId(event.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">
                    Extra message <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    className="w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
                  />
                </label>

                {/* Spam trap: hidden from users, ignored by them, filled by bots. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  className="absolute h-0 w-0 overflow-hidden opacity-0"
                />

                {errorMsg && (
                  <div
                    role="alert"
                    className="rounded-[3px] border border-red-200 bg-red-950 p-3 text-xs font-semibold text-red-200"
                  >
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-white/15 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending request..." : "Request Quote"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
