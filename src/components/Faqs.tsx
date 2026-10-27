"use client";

import { useState, useMemo } from "react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FaqItem[] = [
  {
    id: 1,
    question: "What does CRA stand for and how does the Referral Programme work?",
    answer:
      "**CRA** stands for **Customer Referral Agency**.\n\nUnder the AVMLabs Referral Programme, partners refer patients and customers for diagnostic tests and health profiles.\n\n**How the programme works**:\n• **You Refer**: You refer patients and customers using your authorized partner login or referral link.\n• **AVMLabs Handles Operations**: AVMLabs handles booking, home or centre sample collection, accredited laboratory processing, and verified digital reporting.\n• **Shared Commercial Benefit**: The benefit on each test is split between customer discount and your partner incentive according to your chosen CRA Category:\n  - **C4000**: Customer Discount **40%** | Partner Incentive **0%** (Maximum patient saving)\n  - **C2525**: Customer Discount **25%** | Partner Incentive **25% on realized** (equal to 18.75% of catalogue price) (Balanced win-win sharing)\n  - **C0040**: Customer Discount **0%** | Partner Incentive **40% on realized** (equal to 40% of catalogue price) (Maximum partner earning)",
    category: "Overview",
  },
  {
    id: 2,
    question: "What are the three CRA Categories in detail?",
    answer:
      "• **Model C4000 (Maximum Customer Discount)**:\n  - Customer Discount: **40%** off catalogue price\n  - Partner Incentive: **0%**\n  - Customer saves maximum on every test. Ideal for charitable trusts, health camps, residential societies, and partners prioritizing patient affordability.\n\n• **Model C2525 (Balanced Sharing Model)**:\n  - Customer Discount: **25%** off catalogue price\n  - Partner Incentive: **25% on realized amount** (equals **18.75% of catalogue price**)\n  - The standard win-win model providing both patient savings and attractive monthly partner incentives.\n\n• **Model C0040 (Maximum Partner Incentive)**:\n  - Customer Discount: **0%** (Customer pays full catalogue price)\n  - Partner Incentive: **40% on realized amount** (equals **40% of catalogue price**)\n  - Designed for commercial influencers, corporate referrals, gyms, and pharmacies seeking maximum earnings.",
    category: "CRA Categories",
  },
  {
    id: 3,
    question: "How are customer discounts and partner incentives calculated?",
    answer:
      "• **Customer discount** is applied directly to the **B2C (Catalogue) price**.\n• **Partner incentive** is calculated on the **realized amount** (net amount paid by the customer).\n\n**Detailed Examples on a ₹1,000 Test**:\n\n1. **Under C4000**:\n   • Catalogue Price: ₹1,000\n   • Customer pays after 40% discount: **₹600** (saves ₹400)\n   • Partner Incentive (0%): **₹0**\n\n2. **Under C2525**:\n   • Catalogue Price: ₹1,000\n   • Customer pays after 25% discount: **₹750** (saves ₹250)\n   • Partner Incentive (25% on realized): 25% of ₹750 = **₹187.50 plus GST**\n\n3. **Under C0040**:\n   • Catalogue Price: ₹1,000\n   • Customer pays full catalogue price: **₹1,000** (saves ₹0)\n   • Partner Incentive (40% on realized): 40% of ₹1,000 = **₹400 plus GST**",
    category: "Incentive",
  },
  {
    id: 4,
    question: "Who can become a Referral Partner?",
    answer:
      "Start-ups in wellness, fitness, nutrition and home care, AYUSH disciplines, pharmacies, senior living societies, corporates, digital influencers and retail business establishments.",
    category: "Eligibility",
  },
  {
    id: 5,
    question: "What is the eligibility?",
    answer:
      "• Any individual, partnership or company can become a Referral Partner.\n• **No investment** is required.\n• **No minimum monthly business target** or fixed commitment.",
    category: "Eligibility",
  },
  {
    id: 6,
    question: "What incentive are partners eligible for?",
    answer:
      "Partner incentives depend on the assigned CRA Category:\n• **C4000**: **0%** (100% of the benefit is passed directly to the customer as a 40% discount).\n• **C2525**: **25% of realized revenue** (equivalent to **18.75% of B2C price**).\n• **C0040**: **40% of realized revenue** (equivalent to **40% of B2C price**).\n\nIncentives are calculated on test revenue and paid monthly plus GST.",
    category: "Incentive",
  },
  {
    id: 7,
    question: "Is there a minimum cart value?",
    answer:
      "Yes. For a cart value below **₹250**, no patient discount is given and no partner incentive is generated.",
    category: "Incentive",
  },
  {
    id: 8,
    question: "What are the home collection charges?",
    answer:
      "**₹200** for the first patient, plus **₹100** for every additional patient at the same address during the same visit.\n\n• 1 patient – **₹200**\n• 2 patients – **₹300**\n• 3 patients – **₹400**",
    category: "Collection",
  },
  {
    id: 9,
    question: "What is the centre collection charge?",
    answer: "**There is no centre collection charge.**",
    category: "Collection",
  },
  {
    id: 10,
    question: "Do partners earn an incentive on collection charges?",
    answer:
      "**No.** The incentive is calculated on the realized diagnostic test revenue only.",
    category: "Incentive",
  },
  {
    id: 11,
    question: "How will my referrals be identified?",
    answer:
      "Each partner is given a **unique QR / referral mechanism**. Eligible customers booking through your referral mechanism are automatically mapped to your partner account.",
    category: "Referral & QR",
  },
  {
    id: 12,
    question: "Will I be able to track my referrals and earnings?",
    answer:
      "**Yes.** The partner dashboard tracks eligible referrals, booking status, realized revenue, and accrued incentives digitally.",
    category: "Tracking",
  },
  {
    id: 13,
    question: "Will I receive a unique QR code?",
    answer:
      "**Yes.** A unique **QR / referral mechanism** is provided during onboarding, and can be displayed at your premises, website, social handles, or clinics.",
    category: "Referral & QR",
  },
  {
    id: 14,
    question: "Will AVMLabs provide promotional material?",
    answer:
      "**Yes.** AVMLabs provides approved promotional material, digital creatives, and standee posters carrying your unique referral QR / link. Only AVMLabs-approved branding may be used.",
    category: "Branding",
  },
  {
    id: 15,
    question: "How does a customer book a test?",
    answer:
      "The customer scans your **unique QR / referral link**, chooses their required tests or profiles with the applicable discount, and proceeds through the AVMLabs booking workflow.",
    category: "Booking",
  },
  {
    id: 16,
    question: "Who handles testing and reporting?",
    answer:
      "**AVMLabs handles** all diagnostic testing and clinical reporting through its accredited laboratory network (LPL and CRL facilities).",
    category: "Operations",
  },
  {
    id: 17,
    question: "Do partners need to collect samples?",
    answer:
      "**No.** Your role is strictly to refer customers and build health awareness. Phlebotomy and sample collection are executed by AVMLabs certified technicians, subject to local serviceability.",
    category: "Operations",
  },
  {
    id: 18,
    question: "Is home collection available everywhere?",
    answer:
      "Home collection is subject to **serviceability and operational coverage** at the patient's pincode.",
    category: "Collection",
  },
  {
    id: 19,
    question: "How frequently are partner incentives settled?",
    answer:
      "Eligible incentives are calculated and paid **monthly**, when dues exceed **₹1,000**, subject to the applicable invoice and documentation.",
    category: "Payouts",
  },
  {
    id: 20,
    question: "Do partners need to raise an invoice?",
    answer:
      "**Yes.** Partners raise a monthly invoice for the eligible incentive amount from within the partner portal.",
    category: "Payouts",
  },
  {
    id: 21,
    question: "Is GST applicable to the partner incentive?",
    answer:
      "**Yes**, the invoice carries **18% GST**.\n\nExample: incentive ₹1,000 + GST ₹180 = **invoice ₹1,180**. Payment is processed directly to your registered bank account.",
    category: "Payouts",
  },
  {
    id: 22,
    question: "What documents are required for onboarding?",
    answer:
      "The AVMLabs onboarding team verifies standard **KYC, banking, and tax documentation**, including PAN card, bank account verification (cancelled cheque / bank statement), and GST registration certificate where applicable.",
    category: "Onboarding",
  },
  {
    id: 23,
    question: "Can an organisation with multiple outlets become a partner?",
    answer:
      "**Yes**, multi-branch networks (gyms, pharmacies, corporate wellness desks) are supported with sub-QR tracking mapped to a single consolidated parent account.",
    category: "Eligibility",
  },
  {
    id: 24,
    question: "Is this an AVMLabs franchise?",
    answer:
      "**No.** The programme is a referral partnership arrangement. A partner is an independent referral affiliate and does not operate as an AVMLabs franchise, laboratory, or branch.",
    category: "Compliance",
  },
  {
    id: 25,
    question: "How do I get started?",
    answer:
      "Once you submit your partnership interest, our partner success team assists you with rapid KYC verification, category selection, and **QR / referral mechanism activation** within 24 to 48 hours.",
    category: "Onboarding",
  },
];

function renderFormattedAnswer(text: string) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => {
        const lines = para.split("\n");
        return (
          <div key={i} className="space-y-1">
            {lines.map((line, j) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={j} className="leading-relaxed">
                  {parts.map((part, k) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <strong key={k} className="font-semibold text-slate-900">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function Faqs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([1]));

  // Filter FAQs based on search input
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return faqData;
    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Toggle individual FAQ item
  const toggleFaq = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about CRA categories, customer discounts, partner incentives, and referral workflows.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs (e.g. incentives, discounts, categories)..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#0F2A43] focus:ring-2 focus:ring-[#0F2A43]/15 transition-all outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FAQs Cards List with Color Accents */}
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-slate-200 bg-slate-50/50 p-8">
            <p className="text-slate-700 font-medium text-base mb-1">
              No matching questions found
            </p>
            <p className="text-slate-400 text-sm mb-4">
              Try searching with another keyword like &ldquo;C2525&rdquo;, &ldquo;incentive&rdquo;, or &ldquo;discount&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-sm font-medium text-[#0F2A43] hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border bg-white transition-all overflow-hidden ${
                    isOpen
                      ? "border-slate-300 border-l-4 border-l-[#0F2A43] shadow-xs"
                      : "border-slate-200/90 hover:border-slate-300 hover:border-l-4 hover:border-l-[#0F2A43]/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4.5 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-6 h-6 rounded bg-[#0F2A43] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        Q
                      </span>
                      <h3 className="font-semibold text-slate-800 text-base sm:text-lg group-hover:text-[#0F2A43] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <span
                      className={`w-6 h-6 flex items-center justify-center shrink-0 text-[#0F2A43] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-4.5 h-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                      {renderFormattedAnswer(faq.answer)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
