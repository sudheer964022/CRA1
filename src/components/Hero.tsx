"use client";

import { useState } from "react";

export type CraModelKey = "C4000" | "C2525" | "C0040";

interface ModelCalculation {
  id: CraModelKey;
  label: string;
  subLabel: string;
  customerPays: string;
  customerSaves: string;
  partnerEarns: string;
  explanation: string;
}

const MODEL_CALCULATIONS: Record<CraModelKey, ModelCalculation> = {
  C4000: {
    id: "C4000",
    label: "C4000",
    subLabel: "Most savings",
    customerPays: "₹600",
    customerSaves: "₹400",
    partnerEarns: "₹0",
    explanation:
      "Maximum customer saving. The customer pays ₹600 (saves 40%) and the partner earns 0%.",
  },
  C2525: {
    id: "C2525",
    label: "C2525",
    subLabel: "Balanced",
    customerPays: "₹750",
    customerSaves: "₹250",
    partnerEarns: "₹187.50",
    explanation:
      "Both sides gain. The customer pays ₹750 and the partner earns 25% of that, which is ₹187.50.",
  },
  C0040: {
    id: "C0040",
    label: "C0040",
    subLabel: "Most earning",
    customerPays: "₹1,000",
    customerSaves: "₹0",
    partnerEarns: "₹400",
    explanation:
      "The partner incentive is highest. The customer pays the full ₹1,000 and the partner earns 40%, which is ₹400.",
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
      className="w-full pt-8 sm:pt-14 lg:pt-18 pb-12 sm:pb-16 lg:pb-20 border-b border-[#E4E8EC]"
      style={{
        background: "radial-gradient(900px 520px at 88% 0, #F7EFDD 0, rgba(255,255,255,0) 65%), #ffffff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Eyebrow Accent: Horizontal bar + REFERRAL PROGRAMME */}
            <div className="flex items-center gap-3">
              <span className="w-10 sm:w-11 h-[2px] bg-[#B8893B] rounded-full inline-block" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#B8893B] uppercase font-sans">
                REFERRAL PROGRAMME
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold text-[#0F2A43] tracking-tight leading-[1.06]">
              Refer patients. <em>Earn on every test</em> they book.
            </h1>

            {/* Description Paragraph */}
            <p className="text-[#55677A] text-base sm:text-lg leading-relaxed max-w-xl">
              Join the AVMLabs Referral Programme. Share your QR code, AVMLabs handles the testing and reports, and the benefit is shared between the customer and the partner based on the CRA category.
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

            {/* Three Trust Badges matching avmlabs-cra.html .facts */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm font-semibold text-[#55677A] pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span> No investment
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span> No monthly target
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5">
                <span className="text-[#B8893B] font-bold">✓</span> Paid monthly
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE DARK CARD ================= */}
          <div className="lg:col-span-5">
            <div className="bg-[#0F2A43] text-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 lg:p-8 shadow-[0_24px_48px_-20px_rgba(15,42,67,0.45)] border border-slate-700/50 flex flex-col justify-between">
              
              {/* Card Header */}
              <div className="mb-5 sm:mb-6">
                <h3 className="font-sans text-2xl sm:text-[28px] font-bold text-white tracking-tight">
                  Choose a model
                </h3>
                <p className="text-[#B5C3D1] text-xs sm:text-sm mt-1">
                  Select one to see an example on a ₹1,000 test.
                </p>
              </div>

              {/* 3 Model Selector Pills */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5">
                {(["C4000", "C2525", "C0040"] as CraModelKey[]).map((key) => {
                  const item = MODEL_CALCULATIONS[key];
                  const isSelected = selectedModel === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectModel(key)}
                      aria-pressed={isSelected}
                      className={`flex flex-col items-start p-2.5 sm:p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#E0B565] bg-[rgba(184,137,59,0.3)]"
                          : "border-white/20 bg-transparent hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 w-full">
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-[#E0B565]" : "border-[#B5C3D1]"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#E0B565]" />}
                        </span>
                        <span className="font-bold text-white text-xs sm:text-sm leading-none font-sans">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#B5C3D1] mt-1.5 pl-5 leading-tight font-medium">
                        {item.subLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

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

              {/* Action Buttons: Access Rate List + How it works ↓ */}
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
                  Access Rate List
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
