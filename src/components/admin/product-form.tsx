"use client";

import { useState, type FormEvent } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { CATEGORIES, type AdminProduct, type AdminVariant, type AdminVariantSpec } from "@/components/admin/types";

const inputClass =
  "h-14 w-full rounded-md border-2 border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-slate-900";

function Step({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {hint && <p className="mt-1 text-base text-slate-600">{hint}</p>}
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function ProductForm({
  product,
  onDone,
  onCancel,
}: {
  product: AdminProduct;
  onDone: (message?: string) => void;
  onCancel: () => void;
}) {
  const isNew = product.id === 0;
  const [form, setForm] = useState<AdminProduct>(product);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setVariant = (index: number, patch: Partial<AdminVariant>) =>
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, ...patch } : variant)),
    }));

  const addVariant = () =>
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { dimension: "", specs: [], sku: null, price: 0, stock: 0 }],
    }));

  const removeVariant = (index: number) =>
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));

  const addSpec = (variantIndex: number) =>
    setVariant(variantIndex, {
      specs: [...form.variants[variantIndex].specs, { name: "", value: "" }],
    });

  const setSpec = (variantIndex: number, specIndex: number, patch: Partial<AdminVariantSpec>) =>
    setVariant(variantIndex, {
      specs: form.variants[variantIndex].specs.map((spec, i) =>
        i === specIndex ? { ...spec, ...patch } : spec,
      ),
    });

  const removeSpec = (variantIndex: number, specIndex: number) =>
    setVariant(variantIndex, {
      specs: form.variants[variantIndex].specs.filter((_, i) => i !== specIndex),
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a product name.");
      return;
    }
    if (form.variants.length === 0) {
      setError("Please add at least one size and price.");
      return;
    }
    for (const [index, variant] of form.variants.entries()) {
      if (!variant.dimension.trim()) {
        setError(`Size ${index + 1}: please enter a size (for example, 1/2 inch).`);
        return;
      }
      if (!variant.price || variant.price < 1) {
        setError(`Size ${index + 1}: please enter a price.`);
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(
        isNew ? "/api/admin/products" : `/api/admin/products/${form.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: form.gallery[0] ?? form.image }),
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not save");

      onDone(isNew ? `"${form.name}" was added.` : `"${form.name}" was saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      {/* noValidate: the browser's built-in bubbles are terse and easy to miss.
          handleSubmit produces friendlier messages in one consistent place. */}
      <form noValidate onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-5 px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {isNew ? "Add a Product" : "Edit Product"}
          </h1>
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-md border-2 border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border-2 border-red-300 bg-red-50 p-4 text-base font-semibold text-red-700"
          >
            {error}
          </p>
        )}

        <Step number={1} title="What is the product called?">
          <input
            required
            autoFocus
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            className={inputClass}
            placeholder="Hydraulic Pressure Hose"
          />
        </Step>

        <Step number={2} title="What type of product is it?">
          <div className="grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => set("category", category)}
                className={`h-14 rounded-md border-2 px-4 text-base font-semibold transition-colors ${
                  form.category === category
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Step>

        <Step number={3} title="Add photos" hint="The first photo is the one customers see first.">
          <ImageUploader images={form.gallery} onChange={(gallery) => set("gallery", gallery)} />
        </Step>

        <Step
          number={4}
          title="Sizes and prices"
          hint="Add one row for each size you sell. Price in rupees."
        >
          <div className="space-y-4">
            {form.variants.map((variant, index) => (
              <div key={index} className="rounded-md border-2 border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-slate-700">Size {index + 1}</p>
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="rounded px-3 py-1 text-base font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Size</span>
                    <input
                      value={variant.dimension}
                      onChange={(event) => setVariant(index, { dimension: event.target.value })}
                      className={`mt-1 ${inputClass}`}
                      placeholder="1/2 inch"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Price (₹)</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={variant.price || ""}
                      onChange={(event) => setVariant(index, { price: Number(event.target.value) })}
                      className={`mt-1 ${inputClass}`}
                      placeholder="850"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">In stock</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={variant.stock || ""}
                      onChange={(event) => setVariant(index, { stock: Number(event.target.value) })}
                      className={`mt-1 ${inputClass}`}
                      placeholder="10"
                    />
                  </label>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Other details <span className="font-normal text-slate-500">(optional — Range, Model No., Color, etc.)</span>
                  </p>
                  <div className="mt-2 space-y-2">
                    {variant.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center gap-2">
                        <input
                          value={spec.name}
                          onChange={(event) => setSpec(index, specIndex, { name: event.target.value })}
                          className={`${inputClass} h-11`}
                          placeholder="Name (e.g. Range)"
                        />
                        <input
                          value={spec.value}
                          onChange={(event) => setSpec(index, specIndex, { value: event.target.value })}
                          className={`${inputClass} h-11`}
                          placeholder="Value (e.g. 2-280 Kg/Cm2)"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index, specIndex)}
                          className="shrink-0 rounded px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addSpec(index)}
                    className="mt-2 h-11 w-full rounded-md border-2 border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    + Add a detail
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="h-14 w-full rounded-md border-2 border-dashed border-slate-400 bg-white text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Add another size
            </button>
          </div>
        </Step>

        <Step number={5} title="Description" hint="Optional. A short note about the product.">
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            className="w-full rounded-md border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-900"
            placeholder="Industrial-grade hose suitable for high-pressure plant use."
          />
        </Step>

        {/* Filter fields matter for the catalog but would overwhelm the main flow. */}
        <section className="rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setShowAdvanced((open) => !open)}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <span>
              <span className="text-xl font-bold text-slate-900">More details</span>
              <span className="mt-1 block text-base text-slate-600">
                Optional. Helps customers filter the catalog.
              </span>
            </span>
            <span className="text-2xl text-slate-500">{showAdvanced ? "−" : "+"}</span>
          </button>

          {showAdvanced && (
            <div className="grid gap-4 border-t border-slate-200 p-6 sm:grid-cols-2">
              {(
                [
                  ["brand", "Brand", "Best Hydraulics"],
                  ["material", "Material", "Nitrile"],
                  ["pressureRating", "Pressure rating", "25 bar"],
                  ["application", "Used for", "Plant Maintenance"],
                  ["partNumber", "Part number", "BH-1234"],
                  ["hsnCode", "HSN code", "40093100"],
                  ["family", "Product group", "Hydraulic Hose"],
                ] as [keyof AdminProduct, string, string][]
              ).map(([key, label, placeholder]) => (
                <label key={key} className="block">
                  <span className="text-base font-semibold text-slate-800">{label}</span>
                  <input
                    value={(form[key] as string) ?? ""}
                    onChange={(event) =>
                      set(key, (event.target.value || null) as AdminProduct[typeof key])
                    }
                    className={`mt-2 ${inputClass}`}
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <label className="flex cursor-pointer items-center gap-4">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => set("published", event.target.checked)}
              className="h-6 w-6 rounded border-2 border-slate-400"
            />
            <span>
              <span className="text-lg font-bold text-slate-900">Show on the website</span>
              <span className="mt-0.5 block text-base text-slate-600">
                Untick to hide this product from customers.
              </span>
            </span>
          </label>
        </section>

        <div className="flex gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="h-16 flex-1 rounded-md bg-slate-900 text-lg font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : isNew ? "Add Product" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-16 rounded-md border-2 border-slate-300 bg-white px-8 text-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
