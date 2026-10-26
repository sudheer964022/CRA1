"use client";

import { useState } from "react";

interface CraModelDetail {
  id: "C4000" | "C2525" | "C0040";
  title: string;
  subtitle: string;
  bullets: string[];
  expandedInfo: {
    description: string;
    example: string;
    bestFor: string;
    companyRealized: string;
  };
}

const MODELS_DATA: CraModelDetail[] = [
  {
    id: "C4000",
    title: "C4000",
    subtitle: "Maximum Customer Discount",
    bullets: ["Customer discount: 40%", "Partner incentive: 0%"],
    expandedInfo: {
      description:
        "100% of the commercial benefit is passed directly to the customer as a massive 40% discount off the catalogue price.",
      example: "On a ₹1,000 test, the customer pays ₹600. The partner incentive is ₹0.",
      bestFor: "Charitable trusts, health camps, residential societies, and partners prioritizing maximum patient affordability.",
      companyRealized: "60% of B2C",
    },
  },
  {
    id: "C2525",
    title: "C2525",
    subtitle: "Balanced Sharing",
    bullets: [
      "Customer discount: 25%",
      "Partner incentive: 25% of realized (18.75% of B2C)",
    ],
    expandedInfo: {
      description:
        "The standard win-win model. The customer enjoys 25% savings, and the partner earns 25% of the realized revenue (equal to 18.75% of B2C price).",
      example: "On a ₹1,000 test, the customer pays ₹750. The partner earns ₹187.50 plus GST.",
      bestFor: "Clinics, doctors, family physicians, and wellness practitioners looking for both patient delight and healthy monthly earnings.",
      companyRealized: "56.25% of B2C",
    },
  },
  {
    id: "C0040",
    title: "C0040",
    subtitle: "Maximum Partner Incentive",
    bullets: [
      "Customer discount: 0%",
      "Partner incentive: 40% of realized (40% of B2C)",
    ],
    expandedInfo: {
      description:
        "Highest earning model for referral partners. The customer pays the full catalogue price, and the partner earns 40% of the entire realized amount.",
      example: "On a ₹1,000 test, the customer pays ₹1,000. The partner earns ₹400 plus GST.",
      bestFor: "Pharmacies, medical stores, gyms, nutritionists, corporate referral agents, and commercial health influencers.",
      companyRealized: "60% of B2C",
    },
  },
];

export default function CraModel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="cra-model" className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-6 sm:mb-8">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
            What is the CRA model?
          </h2>
          <p className="mt-2.5 text-slate-600 text-sm sm:text-base leading-relaxed">
            CRA is the partner category that decides how the benefit on each test is split between your customer, you and AVMLabs. You pick one when you join.
          </p>
        </div>

        {/* Golden Rule Highlight Box */}
        <div className="bg-[#FAF4EB] border border-[#ECDDC7] rounded-2xl p-4 sm:p-5 mb-8 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
          <p>
            <strong className="font-bold text-slate-900">One rule to remember:</strong> the customer discount is taken from the{" "}
            <strong className="font-semibold text-slate-900">B2C (catalogue) price</strong>. Your incentive is taken from the{" "}
            <strong className="font-semibold text-slate-900">realized amount</strong>, which is what the customer actually pays.
          </p>
        </div>

        {/* Three Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
          {MODELS_DATA.map((model) => {
            const isExpanded = expandedId === model.id;
            return (
              <div
                key={model.id}
                className={`bg-white rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                  isExpanded
                    ? "border-[#C8923A] shadow-md ring-1 ring-[#C8923A]/30"
                    : "border-slate-200 shadow-2xs hover:shadow-sm hover:border-slate-300"
                }`}
              >
                <div>
                  <h3 className="font-sans text-3xl sm:text-4xl font-bold text-[#0E294B] tracking-tight">
                    {model.title}
                  </h3>
                  <span className="block text-xs sm:text-sm font-semibold text-[#C8923A] mt-1 mb-4">
                    {model.subtitle}
                  </span>

                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 mb-5">
                    {model.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expandable Section */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 animate-fadeIn">
                      <p>{model.expandedInfo.description}</p>
                      <div className="bg-[#FAF4EB]/70 p-2.5 rounded-lg border border-[#ECDDC7]/60">
                        <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                          Example on ₹1,000 Test:
                        </span>
                        <p className="text-slate-700">{model.expandedInfo.example}</p>
                      </div>
                      <p>
                        <strong className="text-slate-800">Best for:</strong> {model.expandedInfo.bestFor}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Company Realized: {model.expandedInfo.companyRealized}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tap to read more toggle */}
                <div className="pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(model.id)}
                    className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#C8923A] underline underline-offset-4 cursor-pointer transition-colors inline-flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Show less" : "Tap to read more"}</span>
                    <span className="text-[11px]">{isExpanded ? "▲" : "▼"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
