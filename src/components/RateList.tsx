"use client";

import { useState, useMemo, Fragment } from "react";
import {
  LPL_PROFILES,
  LPL_TESTS,
  ProfileItem,
  TestItem,
} from "@/data/rateListData";

export type CraCategory = "C4000" | "C2525" | "C0040";

export const CRA_CATEGORIES: Record<
  CraCategory,
  {
    name: string;
    label: string;
    customerDiscount: string;
    craIncentive: string;
    companyRealized: string;
  }
> = {
  C4000: {
    name: "C4000",
    label: "C4000",
    customerDiscount: "40%",
    craIncentive: "0%",
    companyRealized: "60%",
  },
  C2525: {
    name: "C2525",
    label: "C2525",
    customerDiscount: "25%",
    craIncentive: "25%",
    companyRealized: "56.25%",
  },
  C0040: {
    name: "C0040",
    label: "C0040",
    customerDiscount: "0%",
    craIncentive: "40%",
    companyRealized: "60%",
  },
};

export function getPriceBreakdown(b2c: number, category: CraCategory) {
  if (category === "C4000") {
    const customerPrice = Math.round(b2c * 0.6); // 40% discount
    const craIncentive = 0; // 0%
    const companyPrice = customerPrice - craIncentive; // 60% of B2C
    return { b2c, customerPrice, craIncentive, companyPrice };
  } else if (category === "C2525") {
    const customerPrice = Math.round(b2c * 0.75); // 25% discount
    const craIncentive = Math.round(b2c * 0.1875); // 25% on realized (18.75% of B2C)
    const companyPrice = customerPrice - craIncentive; // 56.25% of B2C
    return { b2c, customerPrice, craIncentive, companyPrice };
  } else {
    // C0040
    const customerPrice = b2c; // 0% discount
    const craIncentive = Math.round(b2c * 0.4); // 40% of B2C
    const companyPrice = customerPrice - craIncentive; // 60% of B2C
    return { b2c, customerPrice, craIncentive, companyPrice };
  }
}

type SortOption =
  | "customer-asc"
  | "customer-desc"
  | "cra-asc"
  | "cra-desc"
  | "company-asc"
  | "company-desc"
  | "b2c-asc"
  | "b2c-desc"
  | "name";

export default function RateList() {
  const [craCategory, setCraCategory] = useState<CraCategory>("C4000");
  const [activeTab, setActiveTab] = useState<"profiles" | "tests">("profiles");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("customer-asc");

  // Filters for Tests tab
  const [techFilter, setTechFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sampleFilter, setSampleFilter] = useState("all");

  // Expanded profile accordion rows
  const [expandedProfiles, setExpandedProfiles] = useState<Set<number>>(new Set());

  // Pagination for tests
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // When CRA Incentive is 0% (C4000), do not display the CRA Incentive column
  const showCraIncentive = craCategory !== "C4000";

  const toggleProfile = (id: number) => {
    setExpandedProfiles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHeaderSort = (column: "customer" | "cra" | "company" | "b2c") => {
    if (column === "customer") {
      setSortOrder((prev) => (prev === "customer-asc" ? "customer-desc" : "customer-asc"));
    } else if (column === "cra") {
      setSortOrder((prev) => (prev === "cra-asc" ? "cra-desc" : "cra-asc"));
    } else if (column === "company") {
      setSortOrder((prev) => (prev === "company-asc" ? "company-desc" : "company-asc"));
    } else {
      setSortOrder((prev) => (prev === "b2c-asc" ? "b2c-desc" : "b2c-asc"));
    }
  };

  // Filtered & Sorted Profiles
  const filteredProfiles = useMemo(() => {
    let result = [...LPL_PROFILES];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.contents.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const prA = getPriceBreakdown(a.catalogueRate, craCategory);
      const prB = getPriceBreakdown(b.catalogueRate, craCategory);
      if (sortOrder === "customer-asc") return prA.customerPrice - prB.customerPrice;
      if (sortOrder === "customer-desc") return prB.customerPrice - prA.customerPrice;
      if (sortOrder === "cra-asc") return prA.craIncentive - prB.craIncentive;
      if (sortOrder === "cra-desc") return prB.craIncentive - prA.craIncentive;
      if (sortOrder === "company-asc") return prA.companyPrice - prB.companyPrice;
      if (sortOrder === "company-desc") return prB.companyPrice - prA.companyPrice;
      if (sortOrder === "b2c-asc") return prA.b2c - prB.b2c;
      if (sortOrder === "b2c-desc") return prB.b2c - prA.b2c;
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [searchQuery, sortOrder, craCategory]);

  // Filtered & Sorted Tests
  const filteredTests = useMemo(() => {
    let result = [...LPL_TESTS];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.technology.toLowerCase().includes(q) ||
          t.sample.toLowerCase().includes(q)
      );
    }

    if (techFilter !== "all") {
      result = result.filter((t) => t.technology.toLowerCase() === techFilter.toLowerCase());
    }

    if (sampleFilter !== "all") {
      result = result.filter((t) => t.sample.toLowerCase() === sampleFilter.toLowerCase());
    }

    if (priceFilter !== "all") {
      result = result.filter((t) => {
        const { customerPrice } = getPriceBreakdown(t.catalogueRate, craCategory);
        if (priceFilter === "under-100") return customerPrice <= 100;
        if (priceFilter === "101-250") return customerPrice > 100 && customerPrice <= 250;
        if (priceFilter === "above-250") return customerPrice > 250;
        return true;
      });
    }

    result.sort((a, b) => {
      const prA = getPriceBreakdown(a.catalogueRate, craCategory);
      const prB = getPriceBreakdown(b.catalogueRate, craCategory);
      if (sortOrder === "customer-asc") return prA.customerPrice - prB.customerPrice;
      if (sortOrder === "customer-desc") return prB.customerPrice - prA.customerPrice;
      if (sortOrder === "cra-asc") return prA.craIncentive - prB.craIncentive;
      if (sortOrder === "cra-desc") return prB.craIncentive - prA.craIncentive;
      if (sortOrder === "company-asc") return prA.companyPrice - prB.companyPrice;
      if (sortOrder === "company-desc") return prB.companyPrice - prA.companyPrice;
      if (sortOrder === "b2c-asc") return prA.b2c - prB.b2c;
      if (sortOrder === "b2c-desc") return prB.b2c - prA.b2c;
      if (sortOrder === "name") return a.description.localeCompare(b.description);
      return 0;
    });

    return result;
  }, [searchQuery, sortOrder, techFilter, sampleFilter, priceFilter, craCategory]);

  // Pagination for Tests
  const totalTestPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [filteredTests, currentPage, pageSize]);

  // Export to CSV / Excel
  const handleExportExcel = () => {
    let csv = "";
    if (activeTab === "profiles") {
      csv = showCraIncentive
        ? "Profile Name,Parameters Count,Category,B2C Price (INR),Customer Price (INR),CRA Incentive (INR),Company Price (INR),Included Tests\n"
        : "Profile Name,Parameters Count,Category,B2C Price (INR),Customer Price (INR),Company Price (INR),Included Tests\n";
      filteredProfiles.forEach((p) => {
        const pr = getPriceBreakdown(p.catalogueRate, craCategory);
        csv += showCraIncentive
          ? `"${p.name}","${p.paramCount}","${craCategory}","${pr.b2c}","${pr.customerPrice}","${pr.craIncentive}","${pr.companyPrice}","${p.contents.replace(/"/g, '""')}"\n`
          : `"${p.name}","${p.paramCount}","${craCategory}","${pr.b2c}","${pr.customerPrice}","${pr.companyPrice}","${p.contents.replace(/"/g, '""')}"\n`;
      });
    } else {
      csv = showCraIncentive
        ? "Test Code,Test Description,Technology,Sample,Category,B2C Price (INR),Customer Price (INR),CRA Incentive (INR),Company Price (INR)\n"
        : "Test Code,Test Description,Technology,Sample,Category,B2C Price (INR),Customer Price (INR),Company Price (INR)\n";
      filteredTests.forEach((t) => {
        const pr = getPriceBreakdown(t.catalogueRate, craCategory);
        csv += showCraIncentive
          ? `"${t.code}","${t.description.replace(/"/g, '""')}","${t.technology}","${t.sample}","${craCategory}","${pr.b2c}","${pr.customerPrice}","${pr.craIncentive}","${pr.companyPrice}"\n`
          : `"${t.code}","${t.description.replace(/"/g, '""')}","${t.technology}","${t.sample}","${craCategory}","${pr.b2c}","${pr.customerPrice}","${pr.companyPrice}"\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AVMLabs_${activeTab === "profiles" ? "Profiles" : "Tests"}_${craCategory}_RateList.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="rate-list" className="py-12 sm:py-16 bg-[#f8fafc]/80 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar (Sticky when scrolling) */}
        <div className="sticky top-[60px] sm:top-[72px] md:top-[80px] z-40 bg-white/95 backdrop-blur-md rounded-[7px] border border-slate-200/90 shadow-md p-3 sm:p-4 mb-4 transition-shadow">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            
            {/* Left: Category Dropdown (Before Profiles & Tests toggle) + Profiles vs Tests Segmented Toggle */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              
              {/* CRA Category Dropdown */}
              <div className="relative inline-flex items-center">
                <select
                  id="cra-category-select"
                  value={craCategory}
                  onChange={(e) => {
                    const nextCat = e.target.value as CraCategory;
                    setCraCategory(nextCat);
                    if (nextCat === "C4000" && (sortOrder === "cra-asc" || sortOrder === "cra-desc")) {
                      setSortOrder("customer-asc");
                    }
                    setCurrentPage(1);
                  }}
                  aria-label="Select CRA Category"
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-[7px] border border-slate-200/90 bg-white text-xs sm:text-sm font-bold text-[#1c1950] hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="C4000">C4000</option>
                  <option value="C2525">C2525</option>
                  <option value="C0040">C0040</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Profiles vs Tests Segmented Toggle */}
              <div className="inline-flex p-1 rounded-[7px] bg-slate-100 border border-slate-200/60 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profiles");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "profiles"
                      ? "bg-[#1c1950] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Profiles</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-[5px] text-xs font-bold leading-none ${
                      activeTab === "profiles"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {LPL_PROFILES.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("tests");
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "tests"
                      ? "bg-[#1c1950] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Tests</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-[5px] text-xs font-bold leading-none ${
                      activeTab === "tests"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {LPL_TESTS.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Middle: Search Box */}
            <div className="relative flex-1 min-w-[200px]">
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
                placeholder="Search test name or profile..."
                className="w-full pl-9.5 pr-8 py-2 rounded-[7px] border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 transition-all"
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

            {/* Right: Sort Dropdown & Excel Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative inline-flex items-center">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOption)}
                  aria-label="Sort Rate List"
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-[7px] border border-slate-200/90 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="customer-asc">Customer Price: Low to High</option>
                  <option value="customer-desc">Customer Price: High to Low</option>
                  {showCraIncentive && (
                    <>
                      <option value="cra-asc">CRA Incentive: Low to High</option>
                      <option value="cra-desc">CRA Incentive: High to Low</option>
                    </>
                  )}
                  <option value="company-asc">Company Price: Low to High</option>
                  <option value="company-desc">Company Price: High to Low</option>
                  <option value="b2c-asc">B2C Price: Low to High</option>
                  <option value="b2c-desc">B2C Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <span className="pointer-events-none absolute right-2.5 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[7px] border border-slate-200/90 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Secondary Filter Row (Only in Tests tab) */}
          {activeTab === "tests" && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] shrink-0 mr-0.5">
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
                  className="appearance-none pl-3 pr-7 py-2 rounded-[7px] border border-slate-200/90 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 cursor-pointer shadow-2xs transition-colors"
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
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              {/* Price Filter (Customer Price ranges) */}
              <div className="relative inline-flex items-center">
                <select
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by Customer Price"
                  className="appearance-none pl-3 pr-7 py-2 rounded-[7px] border border-slate-200/90 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="all">Prices</option>
                  <option value="under-100">₹100 & below</option>
                  <option value="101-250">₹101 – ₹250</option>
                  <option value="above-250">Above ₹250</option>
                </select>
                <span className="pointer-events-none absolute right-2 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="appearance-none pl-3 pr-7 py-2 rounded-[7px] border border-slate-200/90 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 focus:outline-none focus:border-[#1c1950] focus:ring-1 focus:ring-[#1c1950]/20 cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="all">All Samples</option>
                  <option value="Serum">Serum</option>
                  <option value="Fluoride">Fluoride</option>
                  <option value="EDTA">EDTA</option>
                  <option value="Urine">Urine</option>
                </select>
                <span className="pointer-events-none absolute right-2 inset-y-0 flex items-center text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="text-xs font-semibold text-[#1c1950] hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Counter Info & Category Pill Bar */}
        <div className="mb-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-500">
          <div>
            {activeTab === "profiles" ? (
              <span>
                Showing {filteredProfiles.length === 0 ? 0 : 1}–{filteredProfiles.length} of {LPL_PROFILES.length} matching profiles
              </span>
            ) : (
              <span>
                Showing {filteredTests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredTests.length)} of {LPL_TESTS.length} matching tests
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 bg-white/90 px-2.5 py-1 rounded-[7px] border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>
              Category: <strong className="text-[#1c1950] font-bold">{craCategory}</strong>
            </span>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white rounded-[7px] border border-slate-200/90 shadow-2xs overflow-hidden">
          {activeTab === "profiles" ? (
            /* =================== PROFILES TABLE =================== */
            filteredProfiles.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-700 font-medium text-base mb-1">No matching profiles found</p>
                <p className="text-slate-400 text-sm mb-4">Try searching with another keyword.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-medium text-[#1c1950] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="px-4 sm:px-6 py-3.5 text-left w-60 sm:w-72 md:w-[32%]">
                        Profile
                      </th>
                      
                      {/* B2C Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("b2c")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                          sortOrder === "b2c-asc" || sortOrder === "b2c-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                        title="Click to sort by B2C Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          B2C Price
                          <span className="text-[10px]">
                            {sortOrder === "b2c-asc" ? "▲" : sortOrder === "b2c-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>

                      {/* Customer Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("customer")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-28 sm:w-32 cursor-pointer select-none transition-colors ${
                          sortOrder === "customer-asc" || sortOrder === "customer-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-[#1c1950] hover:text-[#14123b]"
                        }`}
                        title="Click to sort by Customer Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          <span>Customer Price</span>
                          <span className="text-[10px]">
                            {sortOrder === "customer-asc" ? "▲" : sortOrder === "customer-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>

                      {/* CRA Incentive Header (Only if showCraIncentive) */}
                      {showCraIncentive && (
                        <th
                          scope="col"
                          onClick={() => handleHeaderSort("cra")}
                          className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                            sortOrder === "cra-asc" || sortOrder === "cra-desc"
                              ? "text-[#1c1950] bg-slate-100/60"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Click to sort by CRA Incentive"
                        >
                          <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                            <span>CRA Incentive</span>
                            <span className="text-[10px]">
                              {sortOrder === "cra-asc" ? "▲" : sortOrder === "cra-desc" ? "▼" : "⇅"}
                            </span>
                          </span>
                        </th>
                      )}

                      {/* Company Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("company")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                          sortOrder === "company-asc" || sortOrder === "company-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Click to sort by Company Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          <span>Company Price</span>
                          <span className="text-[10px]">
                            {sortOrder === "company-asc" ? "▲" : sortOrder === "company-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.map((p: ProfileItem) => {
                      const isExpanded = expandedProfiles.has(p.id);
                      const price = getPriceBreakdown(p.catalogueRate, craCategory);
                      return (
                        <Fragment key={p.id}>
                          <tr className="hover:bg-slate-50/70 transition-colors">
                            {/* Profile Title with Caret */}
                            <td className="px-4 sm:px-6 py-4 max-w-xs sm:max-w-sm">
                              <button
                                type="button"
                                onClick={() => toggleProfile(p.id)}
                                className="flex items-center gap-2 text-left cursor-pointer group/title"
                              >
                                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover/title:text-[#1c1950] transition-colors">
                                  {p.displayName}
                                </span>
                                <span
                                  className={`text-blue-600 text-xs transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                >
                                  ▾
                                </span>
                              </button>
                            </td>

                            {/* B2C Price */}
                            <td className="px-4 sm:px-5 py-4 text-right font-semibold text-slate-500 text-sm sm:text-base w-24 sm:w-28 whitespace-nowrap">
                              ₹{price.b2c}
                            </td>

                            {/* Customer Price */}
                            <td className="px-4 sm:px-5 py-4 text-right font-bold text-[#1c1950] text-sm sm:text-base w-28 sm:w-32 whitespace-nowrap">
                              ₹{price.customerPrice}
                            </td>

                            {/* CRA Incentive (Only if showCraIncentive) */}
                            {showCraIncentive && (
                              <td className="px-4 sm:px-5 py-4 text-right font-bold text-emerald-600 text-sm sm:text-base w-24 sm:w-28 whitespace-nowrap">
                                ₹{price.craIncentive}
                              </td>
                            )}

                            {/* Company Price */}
                            <td className="px-4 sm:px-5 py-4 text-right font-bold text-slate-800 text-sm sm:text-base w-24 sm:w-28 whitespace-nowrap">
                              ₹{price.companyPrice}
                            </td>
                          </tr>

                          {/* Accordion Expanded Row */}
                          {isExpanded && (
                            <tr className="bg-slate-50/70">
                              <td
                                colSpan={showCraIncentive ? 5 : 4}
                                className="px-4 sm:px-6 py-3.5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed"
                              >
                                <div className="max-w-4xl">
                                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                                    Included Parameters ({p.paramCount}):
                                  </span>
                                  <p className="text-slate-600">{p.contents}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* =================== TESTS TABLE =================== */
            filteredTests.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-700 font-medium text-base mb-1">No matching tests found</p>
                <p className="text-slate-400 text-sm mb-4">Try clearing filters or search keywords.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTechFilter("all");
                    setPriceFilter("all");
                    setSampleFilter("all");
                  }}
                  className="text-sm font-medium text-[#1c1950] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="px-4 sm:px-5 py-3.5 w-16 sm:w-20">
                        Code
                      </th>
                      <th scope="col" className="px-4 sm:px-5 py-3.5 w-52 sm:w-64 md:w-[28%]">
                        Test
                      </th>
                      <th scope="col" className="px-4 sm:px-5 py-3.5 hidden md:table-cell w-28">
                        Technology
                      </th>
                      <th scope="col" className="px-4 sm:px-5 py-3.5 hidden sm:table-cell w-20">
                        Sample
                      </th>

                      {/* B2C Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("b2c")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                          sortOrder === "b2c-asc" || sortOrder === "b2c-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                        title="Click to sort by B2C Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          B2C Price
                          <span className="text-[10px]">
                            {sortOrder === "b2c-asc" ? "▲" : sortOrder === "b2c-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>

                      {/* Customer Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("customer")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-28 sm:w-32 cursor-pointer select-none transition-colors ${
                          sortOrder === "customer-asc" || sortOrder === "customer-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-[#1c1950] hover:text-[#14123b]"
                        }`}
                        title="Click to sort by Customer Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          <span>Customer Price</span>
                          <span className="text-[10px]">
                            {sortOrder === "customer-asc" ? "▲" : sortOrder === "customer-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>

                      {/* CRA Incentive Header (Only if showCraIncentive) */}
                      {showCraIncentive && (
                        <th
                          scope="col"
                          onClick={() => handleHeaderSort("cra")}
                          className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                            sortOrder === "cra-asc" || sortOrder === "cra-desc"
                              ? "text-[#1c1950] bg-slate-100/60"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Click to sort by CRA Incentive"
                        >
                          <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                            <span>CRA Incentive</span>
                            <span className="text-[10px]">
                              {sortOrder === "cra-asc" ? "▲" : sortOrder === "cra-desc" ? "▼" : "⇅"}
                            </span>
                          </span>
                        </th>
                      )}

                      {/* Company Price Header */}
                      <th
                        scope="col"
                        onClick={() => handleHeaderSort("company")}
                        className={`px-4 sm:px-5 py-3.5 text-right font-bold w-24 sm:w-28 cursor-pointer select-none transition-colors ${
                          sortOrder === "company-asc" || sortOrder === "company-desc"
                            ? "text-[#1c1950] bg-slate-100/60"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Click to sort by Company Price"
                      >
                        <span className="inline-flex items-center gap-1 justify-end whitespace-nowrap">
                          <span>Company Price</span>
                          <span className="text-[10px]">
                            {sortOrder === "company-asc" ? "▲" : sortOrder === "company-desc" ? "▼" : "⇅"}
                          </span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedTests.map((t: TestItem) => {
                      const price = getPriceBreakdown(t.catalogueRate, craCategory);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Code */}
                          <td className="px-4 sm:px-5 py-4 font-semibold text-slate-600 text-xs sm:text-sm w-16 sm:w-20">
                            {t.code}
                          </td>

                          {/* Test Name */}
                          <td className="px-4 sm:px-5 py-4 font-semibold text-slate-900 text-sm sm:text-base max-w-xs sm:max-w-sm">
                            {t.description}
                          </td>

                          {/* Technology Pill */}
                          <td className="px-4 sm:px-5 py-4 hidden md:table-cell w-28">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[7px] text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
                              {t.technology}
                            </span>
                          </td>

                          {/* Sample */}
                          <td className="px-4 sm:px-5 py-4 text-slate-600 text-xs sm:text-sm hidden sm:table-cell w-20">
                            {t.sample}
                          </td>

                          {/* B2C Price */}
                          <td className="px-4 sm:px-5 py-4 font-semibold text-slate-500 text-sm sm:text-base text-right w-24 sm:w-28 whitespace-nowrap">
                            ₹{price.b2c}
                          </td>

                          {/* Customer Price */}
                          <td className="px-4 sm:px-5 py-4 font-bold text-[#1c1950] text-sm sm:text-base text-right w-28 sm:w-32 whitespace-nowrap">
                            ₹{price.customerPrice}
                          </td>

                          {/* CRA Incentive (Only if showCraIncentive) */}
                          {showCraIncentive && (
                            <td className="px-4 sm:px-5 py-4 font-bold text-emerald-600 text-sm sm:text-base text-right w-24 sm:w-28 whitespace-nowrap">
                              ₹{price.craIncentive}
                            </td>
                          )}

                          {/* Company Price */}
                          <td className="px-4 sm:px-5 py-4 font-bold text-slate-800 text-sm sm:text-base text-right w-24 sm:w-28 whitespace-nowrap">
                            ₹{price.companyPrice}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalTestPages > 1 && (
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-[7px] border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalTestPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-[7px] text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#1c1950] text-white"
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
                      className="px-3 py-1.5 rounded-[7px] border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
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
    </section>
  );
}
