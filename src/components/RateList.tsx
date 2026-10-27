"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import initialCatalog from "@/lib/catalog.json";
import {
  cleanProfileName,
  getProfileTestCount,
  getProfileGroups,
} from "@/lib/profileGroups.js";
import { money } from "@/lib/formatters.js";
import CartSidebar, { type CartItem, MIN_CART_VALUE } from "@/components/CartSidebar";

export type CraCategory = "C4000" | "C2525" | "C0040";

export interface CraCategoryMeta {
  name: CraCategory;
  label: string;
  customerDiscountPct: number;
  craIncentivePctOnRealized: number;
  companyRealizedPct: string;
  description: string;
}

export const CRA_CATEGORIES: Record<CraCategory, CraCategoryMeta> = {
  C4000: {
    name: "C4000",
    label: "C4000",
    customerDiscountPct: 0.4,
    craIncentivePctOnRealized: 0,
    companyRealizedPct: "60%",
    description: "Customer Discount 40% · CRA Incentive 0% · Company Realized 60%",
  },
  C2525: {
    name: "C2525",
    label: "C2525",
    customerDiscountPct: 0.25,
    craIncentivePctOnRealized: 0.25,
    companyRealizedPct: "56.25%",
    description: "Customer Discount 25% · CRA Incentive 25% on realized (18.75% of B2C) · Company Realized 56.25%",
  },
  C0040: {
    name: "C0040",
    label: "C0040",
    customerDiscountPct: 0,
    craIncentivePctOnRealized: 0.4,
    companyRealizedPct: "60%",
    description: "Customer Discount 0% · CRA Incentive 40% on realized (40% of B2C) · Company Realized 60%",
  },
};

/**
 * Calculates Customer Price and CRA Incentive based on official CRA rules:
 * - Customer discount is calculated on B2C price
 * - CRA incentive is calculated on the realized amount (customer price)
 */
export function calculateCraPrices(b2c: number, category: CraCategory) {
  const meta = CRA_CATEGORIES[category];
  const customerPrice = Math.round(b2c * (1 - meta.customerDiscountPct));
  const craIncentive = Math.round(customerPrice * meta.craIncentivePctOnRealized);
  const companyRealized = customerPrice - craIncentive;
  return { b2c, customerPrice, craIncentive, companyRealized };
}

type SortField = "name" | "b2c" | "customer" | "cra";

export interface RateListProps {
  selectedModel?: CraCategory;
  onClose?: () => void;
}

interface AllItemProfile {
  type: "profile";
  id: string;
  name: string;
  rawName: string;
  contentsText: string;
  b2c: number;
  pkg: any;
}

interface AllItemTest {
  type: "test";
  id: string;
  code: string;
  name: string;
  tech: string;
  sample: string;
  b2c: number;
  test: any;
}

type AllItem = AllItemProfile | AllItemTest;

export default function RateList({ selectedModel = "C4000", onClose }: RateListProps) {
  const [catalog, setCatalog] = useState<any>(initialCatalog);
  const [craCategory, setCraCategory] = useState<CraCategory>(selectedModel);
  const [activeTab, setActiveTab] = useState<"all" | "profiles" | "tests">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Synchronize category when selectedModel changes from Hero section
  useEffect(() => {
    if (selectedModel) {
      setCraCategory(selectedModel);
      setCurrentPage(1);
    }
  }, [selectedModel]);

  // Referral Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restore cart from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avm_cra_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("avm_cra_cart", JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  const addToCart = (item: {
    id: string;
    type: "profile" | "test";
    code?: string;
    name: string;
    b2c: number;
    details?: string;
    testCount?: number;
  }) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: item.id,
          type: item.type,
          code: item.code,
          name: item.name,
          b2c: item.b2c,
          quantity: 1,
          details: item.details,
          testCount: item.testCount,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCartQty = (id: string) => {
    const found = cart.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  // Filters for Tests tab
  const [techFilter, setTechFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sampleFilter, setSampleFilter] = useState("all");

  // Expanded profile accordion rows (collapsed by default)
  const [expandedProfiles, setExpandedProfiles] = useState<Set<string>>(new Set());

  // Pagination for All and Tests
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // DYNAMIC DATA FETCHING: fetch latest catalog from /api/catalog
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && Array.isArray(data.tests) && Array.isArray(data.packages)) {
            setCatalog(data);
          }
        }
      } catch (err) {
        console.warn("Using bundled catalog fallback:", err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const catalogTestsByCode = useMemo(() => {
    return Object.fromEntries(((catalog.tests as any[]) || []).map((t) => [t.code, t]));
  }, [catalog.tests]);

  const toggleProfile = (id: string) => {
    setExpandedProfiles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHeaderSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Profiles (filtered to LPL packages by default, matching Camp app)
  const lplPackages = useMemo(() => {
    const list = ((catalog.packages as any[]) || []).filter(
      (p) => !p.processedAt || p.processedAt === "LPL"
    );
    return list;
  }, [catalog.packages]);

  // Tests (filtered to LPL tests by default, matching Camp app)
  const lplTests = useMemo(() => {
    return ((catalog.tests as any[]) || []).filter(
      (t) => !t.processedAt || t.processedAt === "LPL"
    );
  }, [catalog.tests]);

  // Combined All Items (Profiles + Tests)
  const allItems = useMemo<AllItem[]>(() => {
    const profileItems: AllItemProfile[] = lplPackages.map((p) => ({
      type: "profile",
      id: p.id,
      name: cleanProfileName(p.name),
      rawName: String(p.rawName || p.name),
      contentsText: String(p.contentsText || p.contents || ""),
      b2c: p.pricing?.b2c ?? p.b2c ?? 0,
      pkg: p,
    }));

    const testItems: AllItemTest[] = lplTests.map((t) => ({
      type: "test",
      id: t.code,
      code: t.code,
      name: t.name || t.description || "",
      tech: t.tech || t.technology || "",
      sample: t.sample || "",
      b2c: t.b2c || 0,
      test: t,
    }));

    return [...profileItems, ...testItems];
  }, [lplPackages, lplTests]);

  // Filtered & Sorted All Items
  const filteredAll = useMemo(() => {
    let result = [...allItems];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((item) => {
        if (item.type === "profile") {
          return (
            item.name.toLowerCase().includes(q) ||
            item.rawName.toLowerCase().includes(q) ||
            item.contentsText.toLowerCase().includes(q)
          );
        } else {
          return (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.tech.toLowerCase().includes(q) ||
            item.sample.toLowerCase().includes(q)
          );
        }
      });
    }

    result.sort((a, b) => {
      const prA = calculateCraPrices(a.b2c, craCategory);
      const prB = calculateCraPrices(b.b2c, craCategory);
      const nameA = a.name;
      const nameB = b.name;

      let diff = 0;
      if (sortField === "customer") diff = prA.customerPrice - prB.customerPrice;
      else if (sortField === "cra") diff = prA.craIncentive - prB.craIncentive;
      else if (sortField === "b2c") diff = prA.b2c - prB.b2c;
      else diff = nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });

      return sortAsc
        ? diff || nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" })
        : -diff || nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: "base" });
    });

    return result;
  }, [allItems, searchQuery, sortField, sortAsc, craCategory]);

  const totalAllPages = Math.ceil(filteredAll.length / pageSize) || 1;
  const paginatedAll = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAll.slice(start, start + pageSize);
  }, [filteredAll, currentPage, pageSize]);

  // Filtered & Sorted Profiles
  const filteredProfiles = useMemo(() => {
    let result = [...lplPackages];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const cleanName = cleanProfileName(p.name).toLowerCase();
        const rawName = String(p.rawName || p.name).toLowerCase();
        const contents = String(p.contentsText || p.contents || "").toLowerCase();
        return cleanName.includes(q) || rawName.includes(q) || contents.includes(q);
      });
    }

    result.sort((a, b) => {
      const b2cA = a.pricing?.b2c ?? a.b2c ?? 0;
      const b2cB = b.pricing?.b2c ?? b.b2c ?? 0;
      const prA = calculateCraPrices(b2cA, craCategory);
      const prB = calculateCraPrices(b2cB, craCategory);
      const nameA = cleanProfileName(a.name);
      const nameB = cleanProfileName(b.name);

      let diff = 0;
      if (sortField === "customer") diff = prA.customerPrice - prB.customerPrice;
      else if (sortField === "cra") diff = prA.craIncentive - prB.craIncentive;
      else if (sortField === "b2c") diff = prA.b2c - prB.b2c;
      else diff = nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });

      return sortAsc
        ? diff || nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" })
        : -diff || nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: "base" });
    });

    return result;
  }, [lplPackages, searchQuery, sortField, sortAsc, craCategory]);

  // Filtered & Sorted Tests
  const filteredTests = useMemo(() => {
    let result = [...lplTests];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          String(t.name || "").toLowerCase().includes(q) ||
          String(t.code || "").toLowerCase().includes(q) ||
          String(t.tech || t.technology || "").toLowerCase().includes(q) ||
          String(t.sample || "").toLowerCase().includes(q)
      );
    }

    if (techFilter !== "all") {
      result = result.filter(
        (t) => String(t.tech || t.technology || "").toLowerCase() === techFilter.toLowerCase()
      );
    }

    if (sampleFilter !== "all") {
      result = result.filter(
        (t) => String(t.sample || "").toLowerCase() === sampleFilter.toLowerCase()
      );
    }

    if (priceFilter !== "all") {
      result = result.filter((t) => {
        const { customerPrice } = calculateCraPrices(t.b2c || 100, craCategory);
        if (priceFilter === "under-100") return customerPrice <= 100;
        if (priceFilter === "101-250") return customerPrice > 100 && customerPrice <= 250;
        if (priceFilter === "above-250") return customerPrice > 250;
        return true;
      });
    }

    result.sort((a, b) => {
      const prA = calculateCraPrices(a.b2c || 0, craCategory);
      const prB = calculateCraPrices(b.b2c || 0, craCategory);
      const nameA = a.name || a.description || "";
      const nameB = b.name || b.description || "";

      let diff = 0;
      if (sortField === "customer") diff = prA.customerPrice - prB.customerPrice;
      else if (sortField === "cra") diff = prA.craIncentive - prB.craIncentive;
      else if (sortField === "b2c") diff = prA.b2c - prB.b2c;
      else diff = nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });

      return sortAsc
        ? diff || nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" })
        : -diff || nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: "base" });
    });

    return result;
  }, [lplTests, searchQuery, techFilter, sampleFilter, priceFilter, sortField, sortAsc, craCategory]);

  const totalTestPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [filteredTests, currentPage, pageSize]);

  // Export Table to formatted Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      if (activeTab === "all") {
        const rows = filteredAll.map((item, idx) => {
          const { customerPrice, craIncentive, companyRealized } = calculateCraPrices(item.b2c, craCategory);
          if (item.type === "profile") {
            const pkg = item.pkg;
            const testCount = getProfileTestCount(pkg, catalogTestsByCode);
            const groups = getProfileGroups(pkg, catalogTestsByCode);
            const summaryTests = groups
              .map((g: any) => (g.parameters?.length ? `${g.label} (${g.parameters.join(", ")})` : g.label))
              .join("; ");

            return {
              "S.No": idx + 1,
              "Item Type": "Profile",
              "Code / ID": pkg.id,
              "Name": item.name,
              "Details": `${testCount} Tests: ${summaryTests || pkg.contentsText || ""}`,
              "CRA Category": craCategory,
              "Catalogue B2C Rate (INR)": item.b2c,
              "Customer Price (INR)": customerPrice,
              "CRA Incentive (INR)": craIncentive,
              "Company Realized (INR)": companyRealized,
            };
          } else {
            const t = item.test;
            return {
              "S.No": idx + 1,
              "Item Type": "Test",
              "Code / ID": t.code,
              "Name": t.name,
              "Details": `Tech: ${t.tech || t.technology || "—"} | Sample: ${t.sample || "—"}`,
              "CRA Category": craCategory,
              "Catalogue B2C Rate (INR)": item.b2c,
              "Customer Price (INR)": customerPrice,
              "CRA Incentive (INR)": craIncentive,
              "Company Realized (INR)": companyRealized,
            };
          }
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, `All_Items_${craCategory}`);
      } else if (activeTab === "profiles") {
        const rows = filteredProfiles.map((p, idx) => {
          const testCount = getProfileTestCount(p, catalogTestsByCode);
          const b2c = p.pricing?.b2c ?? p.b2c ?? 0;
          const { customerPrice, craIncentive, companyRealized } = calculateCraPrices(b2c, craCategory);
          const groups = getProfileGroups(p, catalogTestsByCode);
          const summaryTests = groups
            .map((g: any) => (g.parameters?.length ? `${g.label} (${g.parameters.join(", ")})` : g.label))
            .join("; ");

          return {
            "S.No": idx + 1,
            "Profile Name": cleanProfileName(p.name),
            "Test Count": testCount,
            "CRA Category": craCategory,
            "Catalogue B2C Rate (INR)": b2c,
            "Customer Price (INR)": customerPrice,
            "CRA Incentive (INR)": craIncentive,
            "Company Realized (INR)": companyRealized,
            "Included Tests": summaryTests || p.contentsText || "",
          };
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, `Profiles_${craCategory}`);
      } else {
        const rows = filteredTests.map((t, idx) => {
          const { customerPrice, craIncentive, companyRealized } = calculateCraPrices(t.b2c || 0, craCategory);
          return {
            "S.No": idx + 1,
            "Test Code": t.code,
            "Test Name": t.name,
            "Technology": t.tech || t.technology || "—",
            "Sample": t.sample || "—",
            "CRA Category": craCategory,
            "Catalogue Rate (INR)": t.b2c || 0,
            "Customer Price (INR)": customerPrice,
            "CRA Incentive (INR)": craIncentive,
            "Company Realized (INR)": companyRealized,
          };
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, `Tests_${craCategory}`);
      }

      const tabTitle = activeTab === "all" ? "All" : activeTab === "profiles" ? "Profiles" : "Tests";
      XLSX.writeFile(wb, `AVMLabs_${tabTitle}_${craCategory}_RateList.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
    }
  };

  const currentCategoryMeta = CRA_CATEGORIES[craCategory];
  const hasCraIncentive = currentCategoryMeta.craIncentivePctOnRealized > 0;
  const gridCols = hasCraIncentive
    ? "sm:grid-cols-[minmax(0,1fr)_150px_135px_135px_56px]"
    : "sm:grid-cols-[minmax(0,1fr)_165px_145px_56px]";

  return (
    <section id="rate-list" className="py-10 sm:py-14 bg-[#f8fafc] border-b border-slate-200 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar */}
        <div className="sticky top-[60px] sm:top-[72px] md:top-[80px] z-40 bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 sm:p-4 mb-4 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Left: All / Profiles / Tests Toggle */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                {/* All Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#1c1950] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${
                      activeTab === "all"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {lplPackages.length + lplTests.length}
                  </span>
                </button>

                {/* Profiles Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profiles");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "profiles"
                      ? "bg-[#1c1950] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Profiles</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${
                      activeTab === "profiles"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {lplPackages.length}
                  </span>
                </button>

                {/* Tests Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("tests");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "tests"
                      ? "bg-[#1c1950] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Tests</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold leading-none ${
                      activeTab === "tests"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {lplTests.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Middle & Right: Search Box & Excel Export */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-0">
                <span className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={
                    activeTab === "all"
                      ? "Search all profiles and tests (e.g. AVM 1, Lipid, TSH)..."
                      : activeTab === "profiles"
                      ? "Search profiles (e.g. AVM 1, Lipid)..."
                      : "Search tests (e.g. TSH, Glucose)..."
                  }
                  className="w-full pl-9.5 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Excel Export Button */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer shrink-0"
                title="Download Rate Card in Excel format"
              >
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Excel</span>
              </button>

              {/* Close Rate List Button */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer shrink-0"
                  title="Close Rate List"
                >
                  <span className="text-slate-400 font-bold">✕</span>
                  <span>Close</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filters for Tests tab */}
          {activeTab === "tests" && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] shrink-0 mr-1">
                FILTERS:
              </span>

              {/* Technology Filter */}
              <div className="relative inline-flex items-center">
                <select
                  value={techFilter}
                  onChange={(e) => {
                    setTechFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by Technology"
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] cursor-pointer shadow-2xs"
                >
                  <option value="all">All Technologies</option>
                  <option value="Photometry">Photometry</option>
                  <option value="C.L.I.A">C.L.I.A</option>
                  <option value="H.P.L.C">H.P.L.C</option>
                  <option value="I.S.E">I.S.E</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Microscopy">Microscopy</option>
                  <option value="Manual">Manual</option>
                </select>
                <span className="pointer-events-none absolute right-2 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Sample Filter */}
              <div className="relative inline-flex items-center">
                <select
                  value={sampleFilter}
                  onChange={(e) => {
                    setSampleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by Sample"
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] cursor-pointer shadow-2xs"
                >
                  <option value="all">All Samples</option>
                  <option value="Serum">Serum</option>
                  <option value="Fluoride">Fluoride</option>
                  <option value="EDTA">EDTA</option>
                  <option value="Urine">Urine</option>
                </select>
                <span className="pointer-events-none absolute right-2 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Price Filter */}
              <div className="relative inline-flex items-center">
                <select
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by Price"
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] cursor-pointer shadow-2xs"
                >
                  <option value="all">All Price Bands</option>
                  <option value="under-100">₹100 & below</option>
                  <option value="101-250">₹101 – ₹250</option>
                  <option value="above-250">Above ₹250</option>
                </select>
                <span className="pointer-events-none absolute right-2 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {(techFilter !== "all" || priceFilter !== "all" || sampleFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setTechFilter("all");
                    setPriceFilter("all");
                    setSampleFilter("all");
                    setCurrentPage(1);
                  }}
                  className="text-xs font-semibold text-[#1c1950] hover:underline cursor-pointer ml-1"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Counter Info */}
        <div className="mb-3 px-1 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-500">
          <div>
            {activeTab === "all" ? (
              <span>
                Showing {filteredAll.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredAll.length)} of {filteredAll.length} items
                {searchQuery ? "" : ` (${lplPackages.length} profiles, ${lplTests.length} tests)`}
              </span>
            ) : activeTab === "profiles" ? (
              <span>
                Showing {filteredProfiles.length === 0 ? 0 : 1}–{filteredProfiles.length} of {lplPackages.length} diagnostic profiles
              </span>
            ) : (
              <span>
                Showing {filteredTests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredTests.length)} of {lplTests.length} diagnostic tests
              </span>
            )}
          </div>
        </div>

        {/* Table / Cards Container */}
        <div className="sm:bg-white sm:rounded-xl sm:border sm:border-slate-200 sm:shadow-sm sm:overflow-hidden">
          {activeTab === "all" ? (
            /* =================== ALL (PROFILES + TESTS) VIEW =================== */
            filteredAll.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 sm:border-0 shadow-xs sm:shadow-none">
                <p className="text-slate-700 font-medium text-base mb-1">No matching profiles or tests found</p>
                <p className="text-slate-400 text-sm mb-4">Try searching with another keyword.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-semibold text-[#1c1950] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                {/* Desktop Table Header */}
                <div className={`hidden sm:grid ${gridCols} gap-3 items-center px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 select-none`}>
                  <button
                    type="button"
                    onClick={() => handleHeaderSort("name")}
                    className={`flex items-center text-left transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "name" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Profile / Test Name</span>
                    <span className="ml-1 text-[11px]">{sortField === "name" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHeaderSort("b2c")}
                    className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "b2c" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Catalogue Rate</span>
                    <span className="ml-1 text-[11px]">{sortField === "b2c" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHeaderSort("customer")}
                    className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "customer" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Customer Price</span>
                    <span className="ml-1 text-[11px]">{sortField === "customer" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  {hasCraIncentive && (
                    <button
                      type="button"
                      onClick={() => handleHeaderSort("cra")}
                      className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                        sortField === "cra" ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                      }`}
                    >
                      <span>CRA Incentive</span>
                      <span className="ml-1 text-[11px]">{sortField === "cra" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                    </button>
                  )}

                  <div className="text-center font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                    Add
                  </div>
                </div>

                {/* Rows: Mobile Container Cards & Desktop Table Rows */}
                <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-slate-100">
                  {paginatedAll.map((item) => {
                    const { customerPrice, craIncentive } = calculateCraPrices(item.b2c, craCategory);

                    if (item.type === "profile") {
                      const pkg = item.pkg;
                      const isExpanded = expandedProfiles.has(pkg.id);
                      const testCount = getProfileTestCount(pkg, catalogTestsByCode);
                      const groups = getProfileGroups(pkg, catalogTestsByCode);

                      return (
                        <div
                          key={`profile-${pkg.id}`}
                          className="bg-white rounded-xl border border-slate-200/90 shadow-xs sm:rounded-none sm:border-0 sm:shadow-none overflow-hidden transition-all"
                        >
                          {/* Mobile View: Dedicated Container Card */}
                          <div className="sm:hidden p-4">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <button
                                type="button"
                                onClick={() => toggleProfile(pkg.id)}
                                className="w-full text-left font-bold text-[#1c1950] hover:text-blue-700 text-sm leading-snug flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                                aria-expanded={isExpanded}
                              >
                                <span className="group-hover:underline">
                                  {item.name} {testCount > 0 ? `(${testCount})` : ""}
                                </span>
                              </button>

                              {/* Mobile + Add Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart({
                                    id: `profile-${pkg.id}`,
                                    type: "profile",
                                    name: cleanProfileName(pkg.name),
                                    b2c: item.b2c,
                                    testCount,
                                  })
                                }
                                className={`shrink-0 inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                  getItemCartQty(`profile-${pkg.id}`) > 0
                                    ? "bg-[#B8893B] text-white"
                                    : "bg-[#FAF4EB] text-[#B8893B] border border-[#ECDDC7] hover:bg-[#B8893B] hover:text-white"
                                }`}
                              >
                                {getItemCartQty(`profile-${pkg.id}`) > 0 ? (
                                  <>
                                    <span>✓</span>
                                    <span>{getItemCartQty(`profile-${pkg.id}`)}</span>
                                    <span>+</span>
                                  </>
                                ) : (
                                  <>
                                    <span>+</span>
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="mb-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Profile
                              </span>
                            </div>

                            {/* Mobile Pricing Container Boxes: Catalogue B2C Rate -> Customer Price -> CRA Incentive */}
                            <div className={`grid ${hasCraIncentive ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-2.5 border-t border-slate-100`}>
                              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-center">
                                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Catalogue Rate</span>
                                <span className="font-medium text-slate-700 text-sm">{money(item.b2c)}</span>
                              </div>
                              <div className="bg-[#1c1950]/5 border border-[#1c1950]/10 rounded-lg p-2 text-center">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Customer Price</span>
                                <span className="font-extrabold text-[#1c1950] text-sm">{money(customerPrice)}</span>
                              </div>
                              {hasCraIncentive && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                                  <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-tight">CRA Incentive</span>
                                  <span className="font-bold text-emerald-600 text-sm">{craIncentive > 0 ? money(craIncentive) : "₹0"}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Desktop Table Row View */}
                          <div
                            className={`hidden sm:grid ${gridCols} gap-2.5 sm:gap-3 items-center px-4 sm:px-6 py-3.5 sm:py-4 text-sm transition-colors hover:bg-slate-50/70`}
                          >
                            {/* Profile Name & Expand Toggle */}
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleProfile(pkg.id)}
                                className="font-bold text-[#1c1950] hover:text-blue-700 text-sm sm:text-base leading-snug text-left inline-flex items-center gap-2 cursor-pointer transition-colors group"
                                aria-expanded={isExpanded}
                              >
                                <span className="group-hover:underline">
                                  {item.name} {testCount > 0 ? `(${testCount})` : ""}
                                </span>
                              </button>
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Profile
                                </span>
                              </div>
                            </div>

                            {/* Catalogue B2C Rate */}
                            <div className="text-right font-medium text-slate-600 text-xs sm:text-sm">
                              {money(item.b2c)}
                            </div>

                            {/* Customer Price */}
                            <div className="text-right font-extrabold text-[#1c1950] text-sm sm:text-base">
                              {money(customerPrice)}
                            </div>

                            {/* CRA Incentive */}
                            {hasCraIncentive && (
                              <div className="text-right font-bold text-emerald-600 text-xs sm:text-sm">
                                {craIncentive > 0 ? money(craIncentive) : "₹0"}
                              </div>
                            )}

                            {/* Add + Button */}
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart({
                                    id: `profile-${pkg.id}`,
                                    type: "profile",
                                    name: cleanProfileName(pkg.name),
                                    b2c: item.b2c,
                                    testCount,
                                  })
                                }
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                  getItemCartQty(`profile-${pkg.id}`) > 0
                                    ? "bg-[#B8893B] hover:bg-[#A07631] text-white font-bold text-xs"
                                    : "bg-[#FAF4EB] hover:bg-[#B8893B] text-[#B8893B] hover:text-white border border-[#ECDDC7] text-lg font-bold"
                                }`}
                                title={
                                  getItemCartQty(`profile-${pkg.id}`) > 0
                                    ? `In cart (${getItemCartQty(`profile-${pkg.id}`)}) - click to add another`
                                    : "Add to referral cart"
                                }
                              >
                                {getItemCartQty(`profile-${pkg.id}`) > 0 ? `+${getItemCartQty(`profile-${pkg.id}`)}` : "+"}
                              </button>
                            </div>
                          </div>

                          {/* Profile Included Tests Accordion */}
                          {isExpanded && (
                            <div className="bg-[#FAFBFD] px-4 sm:px-8 py-4 border-t border-b border-slate-200/90 space-y-3.5">
                              <span className="block text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400">
                                TESTS INCLUDED
                              </span>
                              <div className="space-y-3.5">
                                {groups.map((group: any, gIdx: number) => {
                                  const hasParams = group.parameters && group.parameters.length > 0;
                                  const isRedundantLabel =
                                    hasParams &&
                                    (groups.length === 1 ||
                                      cleanProfileName(group.label).toLowerCase().replace(/\s*\(\d+\)/g, "").trim() ===
                                        cleanProfileName(pkg.name).toLowerCase().replace(/\s*\(\d+\)/g, "").trim());

                                  return (
                                    <div key={gIdx} className="border-l-2 border-[#1c1950] pl-3.5 py-0.5">
                                      {!isRedundantLabel && (
                                        <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">
                                          {group.label}
                                        </span>
                                      )}
                                      {hasParams ? (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-slate-600">
                                          {group.parameters.map((param: string, pIdx: number) => (
                                            <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                                              <span className="text-slate-400 select-none">•</span>
                                              <span>{param}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <span className="text-xs text-slate-600 block">
                                          {group.label}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      const t = item.test;

                      return (
                        <div
                          key={`test-${t.code}`}
                          className="bg-white rounded-xl border border-slate-200/90 shadow-xs sm:rounded-none sm:border-0 sm:shadow-none p-4 sm:p-0 overflow-hidden transition-all"
                        >
                          {/* Mobile View: Dedicated Container Card */}
                          <div className="sm:hidden space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-slate-900 text-sm leading-snug flex-1">
                                {t.name}
                              </h4>
                              {/* Mobile + Add Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart({
                                    id: `test-${t.code}`,
                                    type: "test",
                                    code: t.code,
                                    name: t.name,
                                    b2c: item.b2c,
                                  })
                                }
                                className={`shrink-0 inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                  getItemCartQty(`test-${t.code}`) > 0
                                    ? "bg-[#B8893B] text-white"
                                    : "bg-[#FAF4EB] text-[#B8893B] border border-[#ECDDC7] hover:bg-[#B8893B] hover:text-white"
                                }`}
                              >
                                {getItemCartQty(`test-${t.code}`) > 0 ? (
                                  <>
                                    <span>✓</span>
                                    <span>{getItemCartQty(`test-${t.code}`)}</span>
                                    <span>+</span>
                                  </>
                                ) : (
                                  <>
                                    <span>+</span>
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Mobile Pricing Grid: Catalogue B2C Rate -> Customer Price -> CRA Incentive */}
                            <div className={`grid ${hasCraIncentive ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-2 border-t border-slate-100`}>
                              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-center">
                                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Catalogue B2C</span>
                                <span className="font-medium text-slate-700 text-sm">{money(item.b2c)}</span>
                              </div>
                              <div className="bg-[#1c1950]/5 border border-[#1c1950]/10 rounded-lg p-2 text-center">
                                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Customer Price</span>
                                <span className="font-extrabold text-[#1c1950] text-sm">{money(customerPrice)}</span>
                              </div>
                              {hasCraIncentive && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                                  <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-tight">CRA Incentive</span>
                                  <span className="font-bold text-emerald-600 text-sm">{craIncentive > 0 ? money(craIncentive) : "₹0"}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Desktop Table Row View */}
                          <div
                            className={`hidden sm:grid ${gridCols} gap-2.5 sm:gap-3 items-center px-4 sm:px-6 py-3.5 sm:py-4 text-sm transition-colors hover:bg-slate-50/70`}
                          >
                            {/* Test Name */}
                            <div>
                              <div className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                                {t.name}
                              </div>
                            </div>

                            {/* Catalogue B2C Rate */}
                            <div className="text-right font-medium text-slate-600 text-xs sm:text-sm">
                              {money(item.b2c)}
                            </div>

                            {/* Customer Price */}
                            <div className="text-right font-extrabold text-[#1c1950] text-sm sm:text-base">
                              {money(customerPrice)}
                            </div>

                            {/* CRA Incentive */}
                            {hasCraIncentive && (
                              <div className="text-right font-bold text-emerald-600 text-xs sm:text-sm">
                                {craIncentive > 0 ? money(craIncentive) : "₹0"}
                              </div>
                            )}

                            {/* Add + Button */}
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart({
                                    id: `test-${t.code}`,
                                    type: "test",
                                    code: t.code,
                                    name: t.name,
                                    b2c: item.b2c,
                                  })
                                }
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                  getItemCartQty(`test-${t.code}`) > 0
                                    ? "bg-[#B8893B] hover:bg-[#A07631] text-white font-bold text-xs"
                                    : "bg-[#FAF4EB] hover:bg-[#B8893B] text-[#B8893B] hover:text-white border border-[#ECDDC7] text-lg font-bold"
                                }`}
                                title={
                                  getItemCartQty(`test-${t.code}`) > 0
                                    ? `In cart (${getItemCartQty(`test-${t.code}`)}) - click to add another`
                                    : "Add to referral cart"
                                }
                              >
                                {getItemCartQty(`test-${t.code}`) > 0 ? `+${getItemCartQty(`test-${t.code}`)}` : "+"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Pagination Controls for All tab */}
                {totalAllPages > 1 && (
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalAllPages, 8) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#1c1950] text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-200/60"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalAllPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalAllPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )
          ) : activeTab === "profiles" ? (
            /* =================== PROFILES VIEW =================== */
            filteredProfiles.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 sm:border-0 shadow-xs sm:shadow-none">
                <p className="text-slate-700 font-medium text-base mb-1">No matching profiles found</p>
                <p className="text-slate-400 text-sm mb-4">Try searching with another keyword.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-semibold text-[#1c1950] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                {/* Desktop Table Header: Profile | Catalogue B2C Rate | Customer Price | CRA Incentive */}
                <div className={`hidden sm:grid ${gridCols} gap-3 items-center px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 select-none`}>
                  <button
                    type="button"
                    onClick={() => handleHeaderSort("name")}
                    className={`flex items-center text-left transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "name" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Profile</span>
                    <span className="ml-1 text-[11px]">{sortField === "name" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHeaderSort("b2c")}
                    className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "b2c" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Catalogue</span>
                    <span className="ml-1 text-[11px]">{sortField === "b2c" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleHeaderSort("customer")}
                    className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                      sortField === "customer" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                    }`}
                  >
                    <span>Customer Price</span>
                    <span className="ml-1 text-[11px]">{sortField === "customer" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                  </button>

                  {hasCraIncentive && (
                    <button
                      type="button"
                      onClick={() => handleHeaderSort("cra")}
                      className={`flex items-center justify-end text-right transition-colors cursor-pointer font-bold uppercase tracking-wider ${
                        sortField === "cra" ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                      }`}
                    >
                      <span>CRA Incentive</span>
                      <span className="ml-1 text-[11px]">{sortField === "cra" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                    </button>
                  )}

                  <div className="text-center font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                    Add
                  </div>
                </div>

                {/* Profiles: Mobile Container Cards & Desktop Table Rows */}
                <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-slate-100">
                  {filteredProfiles.map((pkg) => {
                    const isExpanded = expandedProfiles.has(pkg.id);
                    const testCount = getProfileTestCount(pkg, catalogTestsByCode);
                    const groups = getProfileGroups(pkg, catalogTestsByCode);
                    const b2c = pkg.pricing?.b2c ?? pkg.b2c ?? 0;
                    const { customerPrice, craIncentive } = calculateCraPrices(b2c, craCategory);

                    return (
                      <div
                        key={pkg.id}
                        className="bg-white rounded-xl border border-slate-200/90 shadow-xs sm:rounded-none sm:border-0 sm:shadow-none overflow-hidden transition-all"
                      >
                        {/* Mobile View: Dedicated Container Card */}
                        <div className="sm:hidden p-4">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <button
                              type="button"
                              onClick={() => toggleProfile(pkg.id)}
                              className="w-full text-left font-bold text-[#1c1950] hover:text-blue-700 text-sm leading-snug flex items-center justify-between gap-2 cursor-pointer transition-colors group flex-1"
                              aria-expanded={isExpanded}
                            >
                              <span className="group-hover:underline">
                                {cleanProfileName(pkg.name)} {testCount > 0 ? `(${testCount})` : ""}
                              </span>
                            </button>

                            {/* Mobile + Add Button */}
                            <button
                              type="button"
                              onClick={() =>
                                addToCart({
                                  id: `profile-${pkg.id}`,
                                  type: "profile",
                                  name: cleanProfileName(pkg.name),
                                  b2c,
                                  testCount,
                                })
                              }
                              className={`shrink-0 inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                getItemCartQty(`profile-${pkg.id}`) > 0
                                  ? "bg-[#B8893B] text-white"
                                  : "bg-[#FAF4EB] text-[#B8893B] border border-[#ECDDC7] hover:bg-[#B8893B] hover:text-white"
                              }`}
                            >
                              {getItemCartQty(`profile-${pkg.id}`) > 0 ? (
                                <>
                                  <span>✓</span>
                                  <span>{getItemCartQty(`profile-${pkg.id}`)}</span>
                                  <span>+</span>
                                </>
                              ) : (
                                <>
                                  <span>+</span>
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Mobile Pricing Container Boxes: Catalogue B2C Rate -> Customer Price -> CRA Incentive */}
                          <div className={`grid ${hasCraIncentive ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-2.5 border-t border-slate-100`}>
                            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-center">
                              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Catalogue B2C</span>
                              <span className="font-medium text-slate-700 text-sm">{money(b2c)}</span>
                            </div>
                            <div className="bg-[#1c1950]/5 border border-[#1c1950]/10 rounded-lg p-2 text-center">
                              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Customer Price</span>
                              <span className="font-extrabold text-[#1c1950] text-sm">{money(customerPrice)}</span>
                            </div>
                            {hasCraIncentive && (
                              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                                <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-tight">CRA Incentive</span>
                                <span className="font-bold text-emerald-600 text-sm">{craIncentive > 0 ? money(craIncentive) : "₹0"}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Table Row View */}
                        <div
                          className={`hidden sm:grid ${gridCols} gap-2.5 sm:gap-3 items-center px-4 sm:px-6 py-3.5 sm:py-4 text-sm transition-colors hover:bg-slate-50/70`}
                        >
                          {/* Profile Name & Expand Toggle */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleProfile(pkg.id)}
                              className="font-bold text-[#1c1950] hover:text-blue-700 text-sm sm:text-base leading-snug text-left inline-flex items-center gap-2 cursor-pointer transition-colors group"
                              aria-expanded={isExpanded}
                            >
                              <span className="group-hover:underline">
                                {cleanProfileName(pkg.name)} {testCount > 0 ? `(${testCount})` : ""}
                              </span>
                            </button>
                          </div>

                          {/* Catalogue B2C Rate */}
                          <div className="text-right font-medium text-slate-600 text-xs sm:text-sm">
                            {money(b2c)}
                          </div>

                          {/* Customer Price */}
                          <div className="text-right font-extrabold text-[#1c1950] text-sm sm:text-base">
                            {money(customerPrice)}
                          </div>

                          {/* CRA Incentive */}
                          {hasCraIncentive && (
                            <div className="text-right font-bold text-emerald-600 text-xs sm:text-sm">
                              {craIncentive > 0 ? money(craIncentive) : "₹0"}
                            </div>
                          )}

                          {/* Add + Button */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                addToCart({
                                  id: `profile-${pkg.id}`,
                                  type: "profile",
                                  name: cleanProfileName(pkg.name),
                                  b2c,
                                  testCount,
                                })
                              }
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                getItemCartQty(`profile-${pkg.id}`) > 0
                                  ? "bg-[#B8893B] hover:bg-[#A07631] text-white font-bold text-xs"
                                  : "bg-[#FAF4EB] hover:bg-[#B8893B] text-[#B8893B] hover:text-white border border-[#ECDDC7] text-lg font-bold"
                              }`}
                              title={
                                getItemCartQty(`profile-${pkg.id}`) > 0
                                  ? `In cart (${getItemCartQty(`profile-${pkg.id}`)}) - click to add another`
                                  : "Add to referral cart"
                              }
                            >
                              {getItemCartQty(`profile-${pkg.id}`) > 0 ? `+${getItemCartQty(`profile-${pkg.id}`)}` : "+"}
                            </button>
                          </div>
                        </div>

                        {/* Included Tests Accordion */}
                        {isExpanded && (
                          <div className="bg-[#FAFBFD] px-4 sm:px-8 py-4 border-t border-b border-slate-200/90 space-y-3.5">
                            <span className="block text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400">
                              TESTS INCLUDED
                            </span>
                            <div className="space-y-3.5">
                              {groups.map((group: any, gIdx: number) => {
                                const hasParams = group.parameters && group.parameters.length > 0;
                                const isRedundantLabel =
                                  hasParams &&
                                  (groups.length === 1 ||
                                    cleanProfileName(group.label).toLowerCase().replace(/\s*\(\d+\)/g, "").trim() ===
                                      cleanProfileName(pkg.name).toLowerCase().replace(/\s*\(\d+\)/g, "").trim());

                                return (
                                  <div key={gIdx} className="border-l-2 border-[#1c1950] pl-3.5 py-0.5">
                                    {!isRedundantLabel && (
                                      <span className="font-bold text-xs sm:text-sm text-slate-900 block mb-1">
                                        {group.label}
                                      </span>
                                    )}
                                    {hasParams ? (
                                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-slate-600">
                                        {group.parameters.map((param: string, pIdx: number) => (
                                          <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                                            <span className="text-slate-400 select-none">•</span>
                                            <span>{param}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span className="text-xs text-slate-600 block">
                                        {group.label}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            /* =================== TESTS VIEW =================== */
            filteredTests.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 sm:border-0 shadow-xs sm:shadow-none">
                <p className="text-slate-700 font-medium text-base mb-1">No matching tests found</p>
                <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTechFilter("all");
                    setSampleFilter("all");
                    setPriceFilter("all");
                  }}
                  className="text-sm font-semibold text-[#1c1950] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div>
                {/* Mobile View: Tests Container Cards */}
                <div className="sm:hidden space-y-3">
                  {paginatedTests.map((t: any) => {
                    const b2c = t.b2c || 0;
                    const { customerPrice, craIncentive } = calculateCraPrices(b2c, craCategory);

                    return (
                      <div key={t.code} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {t.code}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            {t.tech || t.technology || "—"}
                          </span>
                          {t.sample && (
                            <span className="text-xs text-slate-500">
                              • {t.sample}
                            </span>
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug flex-1">
                            {t.name}
                          </h4>
                          {/* Mobile + Add Button */}
                          <button
                            type="button"
                            onClick={() =>
                              addToCart({
                                id: `test-${t.code}`,
                                type: "test",
                                code: t.code,
                                name: t.name,
                                b2c,
                              })
                            }
                            className={`shrink-0 inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                              getItemCartQty(`test-${t.code}`) > 0
                                ? "bg-[#B8893B] text-white"
                                : "bg-[#FAF4EB] text-[#B8893B] border border-[#ECDDC7] hover:bg-[#B8893B] hover:text-white"
                            }`}
                          >
                            {getItemCartQty(`test-${t.code}`) > 0 ? (
                              <>
                                <span>✓</span>
                                <span>{getItemCartQty(`test-${t.code}`)}</span>
                                <span>+</span>
                              </>
                            ) : (
                              <>
                                <span>+</span>
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Mobile Pricing Grid: Catalogue B2C Rate -> Customer Price -> CRA Incentive */}
                        <div className={`grid ${hasCraIncentive ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-2 border-t border-slate-100`}>
                          <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 text-center">
                            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Catalogue B2C</span>
                            <span className="font-medium text-slate-700 text-sm">{money(b2c)}</span>
                          </div>
                          <div className="bg-[#1c1950]/5 border border-[#1c1950]/10 rounded-lg p-2 text-center">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">Customer Price</span>
                            <span className="font-extrabold text-[#1c1950] text-sm">{money(customerPrice)}</span>
                          </div>
                          {hasCraIncentive && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                              <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-tight">CRA Incentive</span>
                              <span className="font-bold text-emerald-600 text-sm">{craIncentive > 0 ? money(craIncentive) : "₹0"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Tests Table with: Code | Test Name | Technology | Sample | Catalogue B2C Rate | Customer Price | CRA Incentive | Add */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                        <th scope="col" className="px-4 sm:px-5 py-3.5 text-left w-20">
                          Code
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleHeaderSort("name")}
                          className={`px-4 sm:px-5 py-3.5 text-left cursor-pointer transition-colors w-[240px] sm:w-[280px] md:w-[320px] max-w-[360px] ${
                            sortField === "name" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            Test Name
                            <span className="text-[10px]">{sortField === "name" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                          </span>
                        </th>
                        <th scope="col" className="px-4 sm:px-5 py-3.5 text-left hidden md:table-cell w-32">
                          Technology
                        </th>
                        <th scope="col" className="px-4 sm:px-5 py-3.5 text-left hidden sm:table-cell w-28">
                          Sample
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleHeaderSort("b2c")}
                          className={`px-4 sm:px-5 py-3.5 text-right font-bold w-36 cursor-pointer transition-colors ${
                            sortField === "b2c" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1 justify-end">
                            Catalogue Rate
                            <span className="text-[10px]">{sortField === "b2c" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                          </span>
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleHeaderSort("customer")}
                          className={`px-4 sm:px-5 py-3.5 text-right font-bold w-32 cursor-pointer transition-colors ${
                            sortField === "customer" ? "text-[#1c1950]" : "text-slate-500 hover:text-[#1c1950]"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1 justify-end">
                            Customer Price
                            <span className="text-[10px]">{sortField === "customer" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                          </span>
                        </th>
                        {hasCraIncentive && (
                          <th
                            scope="col"
                            onClick={() => handleHeaderSort("cra")}
                            className={`px-4 sm:px-5 py-3.5 text-right font-bold w-32 cursor-pointer transition-colors ${
                              sortField === "cra" ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1 justify-end">
                              CRA Incentive
                              <span className="text-[10px]">{sortField === "cra" ? (sortAsc ? "▲" : "▼") : "⇅"}</span>
                            </span>
                          </th>
                        )}
                        <th scope="col" className="px-3 sm:px-4 py-3.5 text-center w-16">
                          Add
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedTests.map((t: any) => {
                        const b2c = t.b2c || 0;
                        const { customerPrice, craIncentive } = calculateCraPrices(b2c, craCategory);

                        return (
                          <tr key={t.code} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 sm:px-5 py-3.5 font-bold text-slate-600 text-xs sm:text-sm">
                              {t.code}
                            </td>
                            <td className="px-4 sm:px-5 py-3.5 font-semibold text-slate-900 text-sm sm:text-base max-w-[360px]">
                              {t.name}
                            </td>
                            <td className="px-4 sm:px-5 py-3.5 hidden md:table-cell text-xs">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                {t.tech || t.technology || "—"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-5 py-3.5 text-slate-600 text-xs hidden sm:table-cell">
                              {t.sample || "—"}
                            </td>
                            <td className="px-4 sm:px-5 py-3.5 font-medium text-slate-600 text-xs sm:text-sm text-right whitespace-nowrap">
                              {money(b2c)}
                            </td>
                            <td className="px-4 sm:px-5 py-3.5 font-extrabold text-[#1c1950] text-sm text-right whitespace-nowrap">
                              {money(customerPrice)}
                            </td>
                            {hasCraIncentive && (
                              <td className="px-4 sm:px-5 py-3.5 font-bold text-emerald-600 text-xs text-right whitespace-nowrap">
                                {craIncentive > 0 ? money(craIncentive) : "₹0"}
                              </td>
                            )}
                            <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart({
                                    id: `test-${t.code}`,
                                    type: "test",
                                    code: t.code,
                                    name: t.name,
                                    b2c,
                                  })
                                }
                                className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                                  getItemCartQty(`test-${t.code}`) > 0
                                    ? "bg-[#B8893B] hover:bg-[#A07631] text-white font-bold text-xs"
                                    : "bg-[#FAF4EB] hover:bg-[#B8893B] text-[#B8893B] hover:text-white border border-[#ECDDC7] text-lg font-bold"
                                }`}
                                title={
                                  getItemCartQty(`test-${t.code}`) > 0
                                    ? `In cart (${getItemCartQty(`test-${t.code}`)}) - click to add another`
                                    : "Add to referral cart"
                                }
                              >
                                {getItemCartQty(`test-${t.code}`) > 0 ? `+${getItemCartQty(`test-${t.code}`)}` : "+"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalTestPages > 1 && (
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalTestPages, 8) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#1c1950] text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-200/60"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalTestPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalTestPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Referral Cart Button when cart has items and sidebar is closed */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#1c1950] hover:bg-[#28236f] text-white font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer border border-white/20"
          >
            <span className="w-6 h-6 rounded-full bg-[#E0B565] text-[#0F2A43] flex items-center justify-center font-extrabold text-xs">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
            <span>View Referral Cart</span>
            <span className="font-extrabold text-[#E0B565]">
              {money(cart.reduce((s, i) => s + i.b2c * i.quantity, 0))}
            </span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Referral Cart Sidebar Drawer */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        craCategory={craCategory}
        onSelectCategory={setCraCategory}
      />
    </section>
  );
}
