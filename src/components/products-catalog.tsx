"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

const filterGroups = [
  {
    title: "Product Category",
    open: true,
    options: ["Hydraulics", "Pneumatics", "Industrial Rubber"],
  },
  {
    title: "Brand",
    options: ["Best Hydraulics", "OEM Compatible", "Industrial Grade"],
  },
  {
    title: "Material",
    options: ["Nitrile", "EPDM", "Polyurethane", "Steel", "Rubber"],
  },
  {
    title: "Size",
    options: ["1/4 in", "3/8 in", "1/2 in", "3/4 in", "1 in"],
  },
  {
    title: "Pressure Rating",
    options: ["10 bar", "16 bar", "25 bar", "40 bar", "63 bar"],
  },
  {
    title: "Industry/Application",
    options: ["Plant Maintenance", "OEM Assembly", "Machine Shop", "Fabrication", "Automation"],
  },
  {
    title: "Availability",
    options: ["In Stock", "Dispatch Today", "Made to Order", "Bulk Supply"],
  },
  {
    title: "Price Range",
    options: ["Under ₹1,500", "₹1,500 - ₹3,000", "₹3,000 - ₹5,000", "₹5,000+"],
  },
];

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
              <span className="text-xs text-slate-400">—</span>
            </label>
          );
        })}
      </div>
    </details>
  );
}

const PAGE_SIZE = 24;

export function ProductsCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    "Product Category": [],
    "Brand": [],
    "Material": [],
    "Size": [],
    "Pressure Rating": [],
    "Industry/Application": [],
    "Availability": [],
    "Price Range": [],
  });

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      searchInputRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      const timer = setTimeout(() => {
        setSelectedFilters((prev) => {
          if (prev["Product Category"][0] === catParam) return prev;
          return {
            ...prev,
            "Product Category": [catParam],
          };
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleFilterChange = (groupTitle: string, option: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentGroup = prev[groupTitle] || [];
      const updatedGroup = checked
        ? [...currentGroup, option]
        : currentGroup.filter((val) => val !== option);
      return {
        ...prev,
        [groupTitle]: updatedGroup,
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      "Product Category": [],
      "Brand": [],
      "Material": [],
      "Size": [],
      "Pressure Rating": [],
      "Industry/Application": [],
      "Availability": [],
      "Price Range": [],
    });
  };

  const activeFiltersCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Search Query filter. Buyers search by model or part number as often as
    // by name, and those live on the variants, so match against every spec too.
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    if (normalizedQuery) {
      const terms = normalizedQuery.split(/\s+/);

      result = result.filter((product) => {
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
        return terms.every((term) => haystack.includes(term));
      });
    }

    // 2. Sidebar Filters
    // Category
    const selectedCats = selectedFilters["Product Category"];
    if (selectedCats && selectedCats.length > 0) {
      result = result.filter((product) => selectedCats.includes(product.category));
    }

    // Brand
    const selectedBrands = selectedFilters["Brand"];
    if (selectedBrands && selectedBrands.length > 0) {
      result = result.filter((product) => product.brand && selectedBrands.includes(product.brand));
    }

    // Material
    const selectedMaterials = selectedFilters["Material"];
    if (selectedMaterials && selectedMaterials.length > 0) {
      result = result.filter((product) => product.material && selectedMaterials.includes(product.material));
    }

    // Size
    const selectedSizes = selectedFilters["Size"];
    if (selectedSizes && selectedSizes.length > 0) {
      // Size lives in the freeform specs now, so match against every spec value.
      result = result.filter((product) => {
        return product.variants.some((variant) => {
          const haystack = variant.specs.map((spec) => spec.value).join(" ").toLowerCase();
          return selectedSizes.some((size) => haystack.includes(size.toLowerCase()));
        });
      });
    }

    // Pressure Rating
    const selectedPressures = selectedFilters["Pressure Rating"];
    if (selectedPressures && selectedPressures.length > 0) {
      result = result.filter((product) => product.pressureRating && selectedPressures.includes(product.pressureRating));
    }

    // Industry/Application
    const selectedApps = selectedFilters["Industry/Application"];
    if (selectedApps && selectedApps.length > 0) {
      result = result.filter((product) => product.application && selectedApps.includes(product.application));
    }

    // Availability
    const selectedAvails = selectedFilters["Availability"];
    if (selectedAvails && selectedAvails.length > 0) {
      result = result.filter((product) => {
        const inStock = product.variants.some((v) => v.stock > 0);
        return selectedAvails.some((avail) => {
          if (avail === "In Stock") return inStock;
          if (avail === "Dispatch Today") return inStock;
          if (avail === "Made to Order") return !inStock;
          if (avail === "Bulk Supply") return inStock;
          return false;
        });
      });
    }

    // Price Range
    const selectedPrices = selectedFilters["Price Range"];
    if (selectedPrices && selectedPrices.length > 0) {
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
  }, [products, submittedQuery, selectedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [submittedQuery, selectedFilters]);

  const totalResultsCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResultsCount / PAGE_SIZE));
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const onSearch = () => {
    setSubmittedQuery(query);
    setHasSearched(true);
  };

  const onClearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setHasSearched(false);
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
            {query || submittedQuery || hasSearched ? (
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
                {filterGroups.map((group) => (
                  <FilterGroup
                    key={group.title}
                    title={group.title}
                    options={group.options}
                    open={group.open}
                    selectedValues={selectedFilters[group.title] || []}
                    onChangeOption={(option, checked) => handleFilterChange(group.title, option, checked)}
                  />
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">
                  {hasSearched ? "Results Overview" : "Catalog Overview"}
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
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex h-10 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2 text-sm font-medium text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
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
