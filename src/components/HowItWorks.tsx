"use client";

const STEPS = [
  {
    step: "01",
    title: "Register & Onboard",
    tagline: "First step: give details & onboard",
    description:
      "Submit your basic details. The AVMLabs team verifies your KYC and onboards you with your official CRA partner account within 24–48 hours.",
  },
  {
    step: "02",
    title: "Refer Customers",
    tagline: "Refer using partner login",
    description:
      "Refer patients and customers easily using your referral code.",
  },
  {
    step: "03",
    title: "Customer Discount",
    tagline: "Customer gets instant discount",
    description:
      "Your customers receive instant discounts on their diagnostic tests and profiles as per your selected CRA model.",
  },
  {
    step: "04",
    title: "AVMLabs Does Processing",
    tagline: "Complete sample & report handling",
    description:
      "AVMLabs handles everything: sample collection (home or centre), lab testing, quality control, and verified digital reporting.",
  },
  {
    step: "05",
    title: "Incentive Ledger",
    tagline: "Automated ledger credits",
    description:
      "Every completed test automatically credits your partner referral incentive directly into your transparent incentive ledger.",
  },
  {
    step: "06",
    title: "Withdraw Earnings",
    tagline: "Monthly payout withdrawals",
    description:
      "Easily withdraw your accumulated incentives every month with complete payout clarity, paid directly plus GST.",
  },
];

const KEY_POINTS = [
  {
    title: "Who can join",
    description:
      "Pharmacies, clinics, doctors, diagnostic labs, wellness and fitness centres, nutritionists, AYUSH practitioners, senior living communities, and health advocates.",
  },
  {
    title: "Minimum cart",
    description: "Below ₹250 cart value, no discount and no referral incentive applies.",
  },
  {
    title: "Home collection",
    description:
      "₹200 for the first patient, ₹100 for each additional patient at the same address. Centre walk-in collection is completely free.",
  },
  {
    title: "Independent CRA partner",
    description:
      "You are an independent Customer Referral Agency (CRA) partner. AVMLabs handles all medical sampling, laboratory testing, and verified reporting.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= 1. HOW IT WORKS (6 STEPS PER TRANSCRIPT) ================= */}
        <div>
          {/* Section Heading */}
          <div className="max-w-3xl mb-8 sm:mb-12">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-8 h-[2px] bg-[#B8893B] rounded-full inline-block" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] text-[#B8893B] uppercase font-sans">
                STEP-BY-STEP PROCESS
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
              How it works
            </h2>
            <p className="mt-2 text-[#55677A] text-sm sm:text-base leading-relaxed">
              A transparent 6-step workflow. You refer — AVMLabs handles all diagnostic bookings, sample processing, and verified reporting.
            </p>
          </div>

          {/* 6 Steps Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="group relative bg-[#FAFDFE]/80 hover:bg-white rounded-2xl p-6 sm:p-7 border border-[#E4E8EC] hover:border-[#B8893B]/60 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Step Number + Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-full bg-[#FAF4EB] border border-[#ECDDC7] text-[#B8893B] font-extrabold text-sm flex items-center justify-center font-sans shadow-2xs">
                      {item.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="font-sans text-xl sm:text-[22px] font-bold text-[#0E294B] mb-2.5 tracking-tight group-hover:text-[#B8893B] transition-colors">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm text-[#55677A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 2. KEY POINTS (2-COLUMN GRID) ================= */}
        <div className="mt-14 sm:mt-20 pt-12 sm:pt-16 border-t border-[#E4E8EC]">
          {/* Section Heading */}
          <div className="max-w-3xl mb-6 sm:mb-8">
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
              Key points to note
            </h2>
            <p className="mt-1.5 text-slate-500 text-sm">
              Essential guidelines for Customer Referral Agency (CRA) partners.
            </p>
          </div>

          {/* 2-Column Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-6 sm:gap-y-8">
            {KEY_POINTS.map((pt, idx) => (
              <div key={idx} className="border-b border-[#E4E8EC] pb-5">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-[#0E294B] mb-1.5 tracking-tight">
                  {pt.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-[#55677A] leading-relaxed">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
