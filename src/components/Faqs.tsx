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
    question: "What is the Referral Programme?",
    answer:
      "Under the AVMLabs Referral Programme, partners can refer customers to AVMLabs for wellness testing (preventive and chronic).\n\nCustomers get a **25% discount** when they come through you, and you earn a **25% incentive** on the realised amount, paid monthly. GST applicable.",
    category: "Overview",
  },
  {
    id: 2,
    question: "Who can become a Referral Partner?",
    answer:
      "Start-ups in wellness, fitness, nutrition and home care, AYUSH disciplines, pharmacies, senior living societies, corporates, digital influencers and retail business establishments.",
    category: "Eligibility",
  },
  {
    id: 3,
    question: "What is the eligibility?",
    answer:
      "• Any individual, partnership or company can become a Referral Partner.\n• **No investment** is required.\n• **No minimum monthly business target** or fixed commitment.",
    category: "Eligibility",
  },
  {
    id: 4,
    question: "What incentive are partners eligible for?",
    answer:
      "**25% of the realised revenue** from your customers, subject to a **maximum of ₹500** per client.",
    category: "Incentive",
  },
  {
    id: 5,
    question: "How is the incentive calculated?",
    answer:
      "Example 1:\n• Profile cost: ₹1,000\n• Customer pays **₹750** after the 25% discount\n• We realise **₹750**\n• Partner incentive: **25% of ₹750 = ₹187.50 plus GST**\n\nExample 2:\n• Profile cost: ₹5,000\n• Customer pays **₹3,750** after the 25% discount\n• We realise **₹3,750**\n• Partner incentive: 25% of ₹3,750 = ₹937.50, **capped at ₹500 plus GST**",
    category: "Incentive",
  },
  {
    id: 6,
    question: "Is there a minimum cart value?",
    answer:
      "Yes. For a cart value below **₹250**, no patient discount is given and no partner incentive is generated.",
    category: "Incentive",
  },
  {
    id: 7,
    question: "What are the home collection charges?",
    answer:
      "**₹200** for the first patient, plus **₹100** for every additional patient at the same address during the same visit.\n\n• 1 patient – **₹200**\n• 2 patients – **₹300**\n• 3 patients – **₹400**",
    category: "Collection",
  },
  {
    id: 8,
    question: "What is the centre collection charge?",
    answer: "**There is no centre collection charge.**",
    category: "Collection",
  },
  {
    id: 9,
    question: "Do partners earn an incentive on collection charges?",
    answer:
      "**No.** The incentive is calculated on the realised test revenue only.",
    category: "Incentive",
  },
  {
    id: 10,
    question: "How will my referrals be identified?",
    answer:
      "Each partner is given a **unique QR / referral mechanism**. Eligible customers booking through your referral mechanism are mapped to you.",
    category: "Referral & QR",
  },
  {
    id: 11,
    question: "Will I be able to track my referrals and earnings?",
    answer:
      "**Yes.** The partner app tracks eligible referrals, business and incentives digitally.",
    category: "Tracking",
  },
  {
    id: 12,
    question: "Will I receive a unique QR code?",
    answer:
      "**Yes.** A unique **QR / referral mechanism** is provided during onboarding, and can be displayed at every place you own, operate or partner with.",
    category: "Referral & QR",
  },
  {
    id: 13,
    question: "Will AVMLabs provide promotional material?",
    answer:
      "**Yes.** AVMLabs provides approved promotional material and posters carrying your unique referral QR / link. Only AVMLabs-approved branding and promotional material may be used.",
    category: "Branding",
  },
  {
    id: 14,
    question: "How does a customer book a test?",
    answer:
      "The customer scans your **unique QR / referral mechanism** and proceeds through the AVMLabs booking process.",
    category: "Booking",
  },
  {
    id: 15,
    question: "Who handles testing and reporting?",
    answer:
      "**AVMLabs handles** the diagnostic testing and reporting through its laboratory network.",
    category: "Operations",
  },
  {
    id: 16,
    question: "Do partners need to collect samples?",
    answer:
      "**No.** Your role is to refer customers and create awareness. Sample collection is handled through the AVMLabs collection process, subject to serviceability.",
    category: "Operations",
  },
  {
    id: 17,
    question: "Is home collection available everywhere?",
    answer:
      "Home collection is subject to **serviceability and operational availability** at the patient's location.",
    category: "Collection",
  },
  {
    id: 18,
    question: "How frequently are partner incentives settled?",
    answer:
      "Eligible incentives are calculated and settled **monthly**, when dues exceed **₹1,000**, subject to the applicable invoicing and payment process.",
    category: "Payouts",
  },
  {
    id: 19,
    question: "Do partners need to raise an invoice?",
    answer:
      "**Yes.** Raise a monthly invoice for the eligible incentive amount from within the app.",
    category: "Payouts",
  },
  {
    id: 20,
    question: "Is GST applicable to the partner incentive?",
    answer:
      "**Yes**, the invoice carries **18% GST**.\n\nExample: incentive ₹1,000 + GST ₹180 = **invoice ₹1,180**. Payment is processed against the invoice and the required documentation.",
    category: "Payouts",
  },
  {
    id: 21,
    question: "What documents are required for onboarding?",
    answer:
      "The AVMLabs team confirms the required **KYC, banking and tax documentation** during onboarding. This may include PAN, bank details, GST details where applicable, and other necessary documents.",
    category: "Onboarding",
  },
  {
    id: 22,
    question: "Can an organisation with multiple outlets become a partner?",
    answer:
      "**Yes**, subject to onboarding. The referral / QR structure can be configured to track referrals from multiple locations.",
    category: "Eligibility",
  },
  {
    id: 23,
    question: "Is this an AVMLabs franchise?",
    answer:
      "**No.** The programme is a referral partnership arrangement. A partner is not an AVMLabs franchise, laboratory or branch.",
    category: "Compliance",
  },
  {
    id: 24,
    question: "Can partners use the AVMLabs brand?",
    answer:
      "**Only AVMLabs-approved branding**, posters and communication material may be used. A partner must not represent itself as an AVMLabs laboratory, branch or franchise.",
    category: "Branding",
  },
  {
    id: 25,
    question: "How do I get started?",
    answer:
      "Once you confirm your interest, the AVMLabs team guides you through documentation, onboarding, **QR / referral activation** and the start of referrals.",
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
    <section id="faqs" className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the referral partnership and guidelines.
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
              placeholder="Search FAQs by question or answer keyword (e.g. incentive, discount, GST, collection)..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 transition-all outline-none shadow-2xs"
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
              Try searching with another keyword like &ldquo;incentive&rdquo;, &ldquo;GST&rdquo;, or &ldquo;discount&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-sm font-medium text-[#1e3a8a] hover:underline cursor-pointer"
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
                      ? "border-slate-200 border-l-4 border-l-[#1e3a8a] shadow-xs"
                      : "border-slate-200/90 hover:border-slate-300 hover:border-l-4 hover:border-l-[#1e3a8a]/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4.5 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-6 h-6 rounded bg-[#1e3a8a] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        Q
                      </span>
                      <h3 className="font-semibold text-slate-800 text-base sm:text-lg group-hover:text-[#1e3a8a] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <span
                      className={`w-6 h-6 flex items-center justify-center shrink-0 text-[#1e3a8a] transition-transform duration-200 ${
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
