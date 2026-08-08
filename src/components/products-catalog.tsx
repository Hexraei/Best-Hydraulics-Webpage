"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

const PRICE_RANGES = ["Under ₹1,500", "₹1,500 - ₹3,000", "₹3,000 - ₹5,000", "₹5,000+"];
const CATEGORIES = ["Hydraulics", "Pneumatics", "Industrial Rubber"];

// Groups material values that only differ by casing or a trailing qualifier
// (e.g. "BRASS", "Brass", "Brass & Chrome") under one filter option, so
// shoppers see one clean "Brass" checkbox instead of three near-duplicates.
// Purely a filter-matching concern — the stored `material` values are
// untouched, so product pages still show the exact original text.
function materialGroupKey(material: string) {
  return material.trim().toLowerCase().split(/[\s&]+/)[0];
}

function FilterGroup({
  title,
  options,
  selectedValues,
  onChangeOption,
  open = false,
}: {
  title: string;
  options: string[];
  selectedValues: string[];
  onChangeOption: (option: string, checked: boolean) => void;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-slate-200 py-4 last:border-b-0" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-900 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-slate-500 transition duration-200 group-open:rotate-45">+</span>
      </summary>

      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option);
          return (
            <label
              key={option}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-[3px] border border-transparent px-2 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onChangeOption(option, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>{option}</span>
              </span>
            </label>
          );
        })}
      </div>
    </details>
  );
}

const PAGE_SIZE = 24;

// Comma-separated values in a single query param, e.g. ?brand=Techno,Festo —
// keeps the URL readable and avoids Next's array-param quirks.
function parseListParam(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function toListParam(values: string[]) {
  return values.length > 0 ? values.join(",") : null;
}

export function ProductsCatalog({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Every filterable value is derived from the actual catalog rather than a
  // fixed list, so a filter option only ever appears if a product can match
  // it — no more checkboxes that always return zero results.
  const { brandOptions, materialGroups } = useMemo(() => {
    const brands = new Set<string>();
    const materials = new Map<string, string>(); // group key -> display label

    for (const product of products) {
      if (product.brand) brands.add(product.brand);
      if (product.material) {
        const key = materialGroupKey(product.material);
        // First-seen spelling wins as the display label for the group.
        if (!materials.has(key)) materials.set(key, product.material.trim());
      }
    }

    return {
      brandOptions: Array.from(brands).sort(),
      materialGroups: Array.from(materials.entries())
        .map(([key, label]) => ({ key, label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };
  }, [products]);

  // URL is the single source of truth for search/filters/page, so it survives
  // navigating to a product and back — the browser restores this exact URL,
  // and everything below re-derives from it.
  const initial = useMemo(
    () => ({
      query: searchParams.get("q") ?? "",
      category: parseListParam(searchParams.get("category")),
      brand: parseListParam(searchParams.get("brand")),
      material: parseListParam(searchParams.get("material")),
      price: parseListParam(searchParams.get("price")),
      page: Math.max(1, Number(searchParams.get("page")) || 1),
    }),
    // Deliberately only re-derived on mount — after that, this component owns
    // the URL (via updateUrl below) rather than reacting to its own writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [query, setQuery] = useState(initial.query);
  const [submittedQuery, setSubmittedQuery] = useState(initial.query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initial.category);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initial.brand);
  const [selectedMaterialKeys, setSelectedMaterialKeys] = useState<string[]>(initial.material);
  const [selectedPrices, setSelectedPrices] = useState<string[]>(initial.price);
  const [currentPage, setCurrentPage] = useState(initial.page);

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      searchInputRef.current?.focus();
    }
    // Only meant to run for the query string this component mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirrors every piece of state into the URL so it survives a visit to a
  // product page and back — the browser restores this exact URL and every
  // filter/search value is re-derived from it on the way back.
  //
  // Uses the native History API directly rather than router.replace(): all
  // filtering already happens client-side from the `products` prop already in
  // memory, so there is no need to ask the server to re-render anything.
  // router.replace() would trigger an RSC round-trip for a page like this one
  // (Suspense boundary + useSearchParams), and in testing that round-trip
  // reliably completed (200 response) without ever committing the resulting
  // URL to the address bar — a bug, not a design choice. window.history.
  // replaceState is the pattern Next's own docs recommend for exactly this
  // "sync client state to the URL" case, and it updates the address bar
  // synchronously with no server request at all.
  const updateUrl = useCallback(
    (next: {
      query?: string;
      category?: string[];
      brand?: string[];
      material?: string[];
      price?: string[];
      page?: number;
    }) => {
      const params = new URLSearchParams();
      const q = next.query ?? submittedQuery;
      const category = next.category ?? selectedCategories;
      const brand = next.brand ?? selectedBrands;
      const material = next.material ?? selectedMaterialKeys;
      const price = next.price ?? selectedPrices;
      const page = next.page ?? currentPage;

      if (q) params.set("q", q);
      const categoryParam = toListParam(category);
      if (categoryParam) params.set("category", categoryParam);
      const brandParam = toListParam(brand);
      if (brandParam) params.set("brand", brandParam);
      const materialParam = toListParam(material);
      if (materialParam) params.set("material", materialParam);
      const priceParam = toListParam(price);
      if (priceParam) params.set("price", priceParam);
      if (page > 1) params.set("page", String(page));

      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `/products?${qs}` : "/products");
    },
    [submittedQuery, selectedCategories, selectedBrands, selectedMaterialKeys, selectedPrices, currentPage],
  );

  const toggleValue = (values: string[], value: string, checked: boolean) =>
    checked ? [...values, value] : values.filter((v) => v !== value);

  const handleCategoryChange = (option: string, checked: boolean) => {
    const next = toggleValue(selectedCategories, option, checked);
    setSelectedCategories(next);
    setCurrentPage(1);
    updateUrl({ category: next, page: 1 });
  };

  const handleBrandChange = (option: string, checked: boolean) => {
    const next = toggleValue(selectedBrands, option, checked);
    setSelectedBrands(next);
    setCurrentPage(1);
    updateUrl({ brand: next, page: 1 });
  };

  const handleMaterialChange = (key: string, checked: boolean) => {
    const next = toggleValue(selectedMaterialKeys, key, checked);
    setSelectedMaterialKeys(next);
    setCurrentPage(1);
    updateUrl({ material: next, page: 1 });
  };

  const handlePriceChange = (option: string, checked: boolean) => {
    const next = toggleValue(selectedPrices, option, checked);
    setSelectedPrices(next);
    setCurrentPage(1);
    updateUrl({ price: next, page: 1 });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedMaterialKeys([]);
    setSelectedPrices([]);
    setCurrentPage(1);
    updateUrl({ category: [], brand: [], material: [], price: [], page: 1 });
  };

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + selectedMaterialKeys.length + selectedPrices.length;

  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Search Query filter. Buyers search by model or part number as often as
    // by name, and those live on the variants, so match against every spec too.
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    if (normalizedQuery) {
      const terms = normalizedQuery.split(/\s+/);

      const matched = products
        .map((product) => {
          const name = (product.name ?? "").toLowerCase();
          const haystack = [
            product.name,
            product.category,
            product.family,
            product.description,
            product.brand,
            product.material,
            product.partNumber,
            product.hsnCode,
            ...product.variants.flatMap((variant) =>
              variant.specs.flatMap((spec) => [spec.name, spec.value]),
            ),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          // Every term must appear, so extra words narrow rather than widen.
          const isMatch = terms.every((term) => haystack.includes(term));
          return { product, isMatch, name };
        })
        .filter((entry) => entry.isMatch);

      // Relevance ranking, most to least specific — otherwise results come
      // back in whatever order products happen to sit in the database (newest
      // insertions last), so a product whose actual name is the query can
      // appear below one that only happens to mention it in a buried spec.
      //
      // Hyphens/slashes count as word separators here, same as spaces, so
      // searching "o ring" matches a product literally named "O-Ring" — a
      // plain substring check would miss it since "o-ring" never contains
      // the literal text "o ring".
      const normalizeForMatch = (value: string) => value.replace(/[-/\s]+/g, " ").trim();
      const normalizedQueryLoose = normalizeForMatch(normalizedQuery);

      const rank = ({ product, name }: { product: Product; name: string }) => {
        const looseName = normalizeForMatch(name);
        if (looseName === normalizedQueryLoose) return 0; // exact name match
        if (looseName.startsWith(normalizedQueryLoose)) return 1; // name starts with query
        if (looseName.includes(normalizedQueryLoose)) return 2; // name contains query
        const category = normalizeForMatch(product.category ?? "");
        const family = normalizeForMatch(product.family ?? "");
        const brand = normalizeForMatch(product.brand ?? "");
        const material = normalizeForMatch(product.material ?? "");
        if ([category, family, brand, material].some((field) => field.includes(normalizedQueryLoose))) return 3;
        const description = normalizeForMatch(product.description ?? "");
        if (description.includes(normalizedQueryLoose)) return 4;
        return 5; // only matched somewhere in the variant specs
      };

      result = matched
        .map((entry) => ({ ...entry, rank: rank(entry) }))
        .sort((a, b) => a.rank - b.rank)
        .map((entry) => entry.product);
    }

    // 2. Category
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category));
    }

    // 3. Brand
    if (selectedBrands.length > 0) {
      result = result.filter((product) => product.brand && selectedBrands.includes(product.brand));
    }

    // 4. Material — matched by normalized group key, so "BRASS" and "Brass &
    // Chrome" both satisfy a selected "Brass" filter.
    if (selectedMaterialKeys.length > 0) {
      result = result.filter(
        (product) => product.material && selectedMaterialKeys.includes(materialGroupKey(product.material)),
      );
    }

    // 5. Price Range
    if (selectedPrices.length > 0) {
      result = result.filter((product) => {
        const minPrice = Math.min(...product.variants.map((v) => v.price));
        return selectedPrices.some((range) => {
          if (range === "Under ₹1,500") return minPrice < 1500;
          if (range === "₹1,500 - ₹3,000") return minPrice >= 1500 && minPrice <= 3000;
          if (range === "₹3,000 - ₹5,000") return minPrice >= 3000 && minPrice <= 5000;
          if (range === "₹5,000+") return minPrice > 5000;
          return false;
        });
      });
    }

    return result;
  }, [products, submittedQuery, selectedCategories, selectedBrands, selectedMaterialKeys, selectedPrices]);

  const totalResultsCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResultsCount / PAGE_SIZE));
  // currentPage can be stale after a filter change shrinks the result set
  // (e.g. coming back from a product page on page 3 of a now-1-page result),
  // so the page actually rendered is always clamped into range.
  const safePage = Math.min(currentPage, totalPages);
  const pagedProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  const onSearch = () => {
    setSubmittedQuery(query);
    setCurrentPage(1);
    updateUrl({ query, page: 1 });
  };

  const onClearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setCurrentPage(1);
    updateUrl({ query: "", page: 1 });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50/70">
      <div className="container py-6 lg:py-8">
        <section className="relative overflow-hidden rounded-[4px] border border-slate-200 bg-slate-950">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-catalog.jpg"
              alt="Industrial machinery and procurement catalog banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/58" />
          </div>
          <div className="relative px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-slate-200/90">
              Product Catalogue
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Industrial products for maintenance, OEM sourcing, and plant operations.
            </h1>
          </div>
        </section>

        <form
          className="sticky top-[calc(4rem+4.5rem)] z-20 flex items-stretch gap-3 border-b border-slate-200/60 bg-white/55 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/35 lg:top-[calc(4rem+4.5rem)]"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <div className="relative flex min-w-0 flex-1 items-stretch">
            <input
              ref={searchInputRef}
              id="product-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search SKU, hose ID, valve type, material, or size"
              className="h-14 min-w-0 flex-1 rounded-[3px] border border-slate-300 bg-white px-4 pr-14 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
            {query || submittedQuery ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={onClearSearch}
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[3px] text-xl leading-none text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            className="h-14 rounded-[3px] border border-slate-950 bg-slate-950 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-[15rem] lg:self-start">
            <div className="rounded-[4px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Filter catalog
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">Technical filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-200 px-4">
                <FilterGroup
                  title="Product Category"
                  options={CATEGORIES}
                  open
                  selectedValues={selectedCategories}
                  onChangeOption={handleCategoryChange}
                />
                {brandOptions.length > 0 && (
                  <FilterGroup
                    title="Brand"
                    options={brandOptions}
                    selectedValues={selectedBrands}
                    onChangeOption={handleBrandChange}
                  />
                )}
                {materialGroups.length > 0 && (
                  <FilterGroup
                    title="Material"
                    options={materialGroups.map((m) => m.label)}
                    selectedValues={selectedMaterialKeys.map(
                      (key) => materialGroups.find((m) => m.key === key)?.label ?? key,
                    )}
                    onChangeOption={(label, checked) => {
                      const key = materialGroups.find((m) => m.label === label)?.key ?? label;
                      handleMaterialChange(key, checked);
                    }}
                  />
                )}
                <FilterGroup
                  title="Price Range"
                  options={PRICE_RANGES}
                  selectedValues={selectedPrices}
                  onChangeOption={handlePriceChange}
                />
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">
                  {submittedQuery || activeFiltersCount > 0 ? "Results Overview" : "Catalog Overview"}
                </p>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Available Products: <span className="font-semibold text-slate-900">{totalResultsCount}</span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalResultsCount === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg font-medium text-slate-900">No products match your selected filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-950 bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Reset All Filters
                </button>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => goToPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2 text-sm font-medium text-slate-600">
                  Page {safePage} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export function CatalogFallback() {
  return (
    <div className="bg-slate-50/70">
      <div className="container py-6 lg:py-8">
        <div className="h-64 animate-pulse rounded-[4px] border border-slate-200 bg-slate-200/70" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="hidden h-96 animate-pulse rounded-[4px] border border-slate-200 bg-white lg:block" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[4px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
