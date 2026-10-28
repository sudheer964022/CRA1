"use client";

import { useState } from "react";

export type CraModelKey = "C4000" | "C2525" | "C0040";

interface ModelCalculation {
  id: CraModelKey;
  label: string;
  customerDiscount: string;
  partnerIncentive: string;
  customerPays: string;
  customerSaves: string;
  partnerEarns: string;
  explanation: string;
}

const MODEL_CALCULATIONS: Record<CraModelKey, ModelCalculation> = {
  C4000: {
    id: "C4000",
    label: "C4000",
    customerDiscount: "40% customer discount",
    partnerIncentive: "0% partner incentive",
    customerPays: "₹600",
    customerSaves: "₹400",
    partnerEarns: "₹0",
    explanation:
      "40% customer discount and 0% partner incentive. The customer pays ₹600 (saves 40%) and partner earns ₹0.",
  },
  C2525: {
    id: "C2525",
    label: "C2525",
    customerDiscount: "25% customer discount",
    partnerIncentive: "25% partner incentive",
    customerPays: "₹750",
    customerSaves: "₹250",
    partnerEarns: "₹187.50",
    explanation:
      "25% customer discount and 25% partner incentive. The customer pays ₹750 (saves 25%) and the partner earns ₹187.50.",
  },
  C0040: {
    id: "C0040",
    label: "C0040",
    customerDiscount: "0% customer discount",
    partnerIncentive: "40% partner incentive",
    customerPays: "₹1,000",
    customerSaves: "₹0",
    partnerEarns: "₹400",
    explanation:
      "0% customer discount and 40% partner incentive. The customer pays full ₹1,000 and the partner earns 40% (₹400).",
  },
};

export interface HeroProps {
  selectedModel?: CraModelKey;
  onSelectModel?: (model: CraModelKey) => void;
  onAccessRateList?: () => void;
}

export default function Hero({
  selectedModel: externalSelectedModel,
  onSelectModel,
  onAccessRateList,
}: HeroProps = {}) {
  const [internalModel, setInternalModel] = useState<CraModelKey>("C4000");
  const selectedModel = externalSelectedModel ?? internalModel;

  const handleSelectModel = (key: CraModelKey) => {
    if (onSelectModel) {
      onSelectModel(key);
    } else {
      setInternalModel(key);
    }
  };

  const currentCalc = MODEL_CALCULATIONS[selectedModel];

  return (
    <section
      id="hero"
      className="w-full pt-3 sm:pt-5 lg:pt-6 pb-10 sm:pb-14 lg:pb-16 border-b border-[#E4E8EC]"
      style={{
        background: "radial-gradient(900px 520px at 88% 0, #F7EFDD 0, rgba(255,255,255,0) 65%), #ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Prominent Eyebrow Pill Badge for CRA (Customer Referral Agency) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FAF4EB] border border-[#ECDDC7] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8893B] shrink-0" />
              <span className="text-xs sm:text-[13px] font-extrabold text-[#0F2A43] tracking-wide uppercase font-sans">
                Customer Referral Agency (CRA) Programme
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold text-[#0F2A43] tracking-tight leading-[1.06]">
              Refer customers. <span className="text-[#B8893B]">Earn on every test</span> they book.
            </h1>

            {/* Description Paragraph with prominent bold Customer Referral Agency definition */}
            <p className="text-[#4A5D71] text-base sm:text-lg leading-relaxed max-w-xl">
              Partner with AVMLabs under the <strong className="font-bold text-[#0F2A43]">Customer Referral Agency (CRA)</strong> model. You refer patients and customers; AVMLabs handles all diagnostic testing and clinical reporting. Benefits are shared transparently between the customer discount and your referral earnings.
            </p>

            {/* Left Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#register"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#0F2A43] hover:bg-[#1B4268] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer font-sans"
              >
                Register as partner
              </a>
              <a
                href="#faqs"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#0F2A43] text-[#0F2A43] hover:text-white font-bold text-sm border-1.5 border-[#0F2A43] transition-all active:scale-95 cursor-pointer font-sans"
              >
                Read FAQs
              </a>
            </div>

            {/* Three Trust Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm font-semibold text-[#55677A] pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span> No investment
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span> No monthly target
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span>Withdraw incentive as & when needed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span>Get incentive on referral
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span>Choose a category according to your convenience (C4000, C2525, C0040)
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE DARK CARD ================= */}
          <div id="cra-models" className="lg:col-span-5 scroll-mt-24">
            <div className="bg-[#0F2A43] text-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 lg:p-8 shadow-[0_24px_48px_-20px_rgba(15,42,67,0.45)] border border-slate-700/50 flex flex-col justify-between">

              {/* Card Header with Customer Referral Agency (CRA) full form */}
              <div className="mb-5 sm:mb-6">
                <span className="inline-block px-2.5 py-1 rounded-md bg-white/10 text-[#E0B565] text-[11px] font-bold uppercase tracking-wider mb-2">
                  Customer Referral Agency (CRA)
                </span>
                <h3 className="font-sans text-2xl sm:text-[28px] font-bold text-white tracking-tight">
                  Explore CRA Categories
                </h3>
                <p className="text-[#B5C3D1] text-xs sm:text-sm mt-1">
                  Select a category to see how benefits are shared on a ₹1,000 test:
                </p>
              </div>

              {/* 3 Model Selector Pills */}
              <fieldset className="mb-5">
                <legend className="sr-only">Select CRA category</legend>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {(["C4000", "C2525", "C0040"] as CraModelKey[]).map((key) => {
                    const item = MODEL_CALCULATIONS[key];
                    const isSelected = selectedModel === key;
                    return (
                      <label
                        key={key}
                        className={`min-w-0 flex min-h-[92px] cursor-pointer flex-col rounded-xl border p-2.5 text-left transition-all sm:p-3 ${isSelected
                            ? "border-[#E0B565] bg-[rgba(184,137,59,0.30)] shadow-[inset_0_0_0_1px_rgba(224,181,101,0.35)]"
                            : "border-white/20 bg-transparent hover:border-white/40 hover:bg-white/[0.08]"
                          }`}
                      >
                        <input
                          type="radio"
                          name="hero-cra-category"
                          value={key}
                          checked={isSelected}
                          onChange={() => handleSelectModel(key)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-1.5 w-full">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-[#E0B565]" : "border-[#B5C3D1]"
                              }`}
                            aria-hidden="true"
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#E0B565]" />}
                          </span>
                          <span className="min-w-0 font-bold text-white text-xs sm:text-sm leading-none font-sans">
                            {item.label}
                          </span>
                        </div>
                        <span className="mt-1.5 space-y-0.5 text-left">
                          <span className="block text-[9px] leading-tight text-[#E8EEF4] font-medium sm:text-[11px]">
                            {item.customerDiscount}
                          </span>
                          <span className="block text-[9px] leading-tight text-[#E0B565] font-semibold sm:text-[11px]">
                            {item.partnerIncentive}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* 3 Calculation Metrics Boxes */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5">
                {/* Customer Pays */}
                <div className="bg-white/[0.08] rounded-xl p-3 text-center">
                  <span className="block text-[11px] sm:text-xs text-[#B5C3D1] font-medium">
                    Customer pays
                  </span>
                  <span className="block font-sans text-xl sm:text-[28px] font-bold text-white mt-1 leading-tight tracking-tight">
                    {currentCalc.customerPays}
                  </span>
                </div>

                {/* Customer Saves */}
                <div className="bg-white/[0.08] rounded-xl p-3 text-center">
                  <span className="block text-[11px] sm:text-xs text-[#B5C3D1] font-medium">
                    Customer saves
                  </span>
                  <span className="block font-sans text-xl sm:text-[28px] font-bold text-white mt-1 leading-tight tracking-tight">
                    {currentCalc.customerSaves}
                  </span>
                </div>

                {/* Partner Earns (in Gold Accent) */}
                <div className="bg-white/[0.08] rounded-xl p-3 text-center">
                  <span className="block text-[11px] sm:text-xs text-[#B5C3D1] font-medium">
                    Partner earns
                  </span>
                  <span className="block font-sans text-xl sm:text-[28px] font-bold text-[#E0B565] mt-1 leading-tight tracking-tight">
                    {currentCalc.partnerEarns}
                  </span>
                </div>
              </div>

              {/* In simple words Callout */}
              <div className="border-l-3 border-[#B8893B] bg-white/[0.08] p-3.5 sm:p-4 rounded-r-xl text-xs sm:text-[14px] text-[#E8EEF4] leading-relaxed mb-6">
                <span className="text-[#E0B565] font-bold">In simple words: </span>
                {currentCalc.explanation}
              </div>

              {/* Action Buttons: View Rate List + How it works ↓ */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onAccessRateList) {
                      onAccessRateList();
                    } else {
                      document.getElementById("rate-list")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 sm:px-5 py-3 rounded-full bg-[#B8893B] hover:bg-[#A07631] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer text-center font-sans"
                >
                  View Rate List
                </button>
                <a
                  href="#how-it-works"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 rounded-full bg-none hover:bg-white/10 text-white border-1.5 border-white/50 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer text-center font-sans"
                >
                  <span>How it works</span>
                  <span className="text-xs">↓</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
