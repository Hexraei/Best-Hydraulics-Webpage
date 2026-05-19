"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatINR } from "@/lib/currency";
import { getProductById } from "@/lib/products";

function CartItemImage({ productName, image }: { productName: string; image?: string }) {
  if (!image) {
    return <div className="h-full w-full bg-slate-100" />;
  }

  return <Image src={image} alt={productName} fill sizes="120px" className="object-cover" />;
}

export default function CartPage() {
  const { lines, subtotal, updateQuantity, updateVariant } = useCart();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const address = "alfaruberss@gmail.com";
    const cartSummary =
      lines.length > 0
        ? lines
            .map((line) => {
              const product = getProductById(line.productId);
              const variant = product?.variants.find((item) => item.id === line.variantId);
              return `${line.productName} | ${product?.category ?? "Industrial"} | ${
                variant?.dimension ?? line.dimension
              } | Qty: ${line.quantity} | ${formatINR(line.unitPrice * line.quantity)}`;
            })
            .join("\n")
        : "No cart items included.";

    const body = [
      `Name: ${name || "-"}`,
      `Business Name: ${businessName || "-"}`,
      `Phone Number: ${phoneNumber || "-"}`,
      `Email ID: ${emailId || "-"}`,
      `Extra Message: ${message || "-"}`,
      "",
      "Cart Items:",
      cartSummary,
      "",
      `Subtotal: ${formatINR(subtotal)}`,
    ].join("\n");

    window.location.href = `mailto:${address}?subject=${encodeURIComponent("Request Quote - Best Hydraulics")}&body=${encodeURIComponent(body)}`;
  };

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
              <p className="text-sm font-medium text-slate-600">{lines.length} item{lines.length === 1 ? "" : "s"}</p>
            </div>

            {lines.length === 0 ? (
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
              </section>
            ) : (
              <div className="space-y-4">
                {lines.map((line) => {
                  const product = getProductById(line.productId);
                  const variant = product?.variants.find((item) => item.id === line.variantId);
                  const image = product?.image;
                  const lineTotal = line.unitPrice * line.quantity;

                  return (
                    <article
                      key={line.variantId}
                      className="rounded-[4px] border border-slate-200 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]"
                    >
                      <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="relative aspect-square overflow-hidden rounded-[4px] border border-slate-200 bg-slate-100">
                          <CartItemImage productName={line.productName} image={image} />
                        </div>

                        <div className="flex min-w-0 flex-col gap-4">
                          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">{line.productName}</h3>
                              <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">
                                {product?.category ?? "Industrial"} / {variant?.dimension ?? line.dimension}
                              </p>
                            </div>
                            <p className="text-lg font-semibold tracking-tight text-slate-950">{formatINR(lineTotal)}</p>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                            <label className="space-y-2">
                              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Variant
                              </span>
                              <select
                                value={line.variantId}
                                onChange={(event) => updateVariant(line.variantId, event.target.value)}
                                className="h-11 w-full rounded-[3px] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                              >
                                {(product?.variants ?? []).map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.dimension} • {item.color}
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
                                min={0}
                                value={line.quantity}
                                onChange={(event) => updateQuantity(line.variantId, Number(event.target.value))}
                                className="h-11 w-full rounded-[3px] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                              />
                            </label>
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
                    className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">
                    Business name <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                  <input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Phone number</span>
                  <input
                    required
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Email ID</span>
                  <input
                    required
                    type="email"
                    value={emailId}
                    onChange={(event) => setEmailId(event.target.value)}
                    className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
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

                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-white/15 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
                >
                  Request Quote
                </button>
              </div>
            </form>
          </aside>
        </div>

        <div className="mt-6 rounded-[4px] border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
          You can also send a blank request form just to get an enquiry callback, or contact us through WhatsApp or phone. When a
          request quote is sent with cart items, we will get back to you regarding prices and services as soon as possible.
        </div>
      </div>
    </div>
  );
}
