"use client";

const STEPS = [
  {
    step: "1",
    title: "Join",
    description: "Submit interest. KYC, category and QR activation in 24–48 hours.",
  },
  {
    step: "2",
    title: "Share your QR",
    description: "Display it at your clinic, shop, website or social pages.",
  },
  {
    step: "3",
    title: "Customer books",
    description: "They scan, pick tests and see their discount.",
  },
  {
    step: "4",
    title: "You get paid",
    description: "Monthly invoice for your incentive, plus 18% GST.",
  },
];

const KEY_POINTS = [
  {
    title: "Who can join",
    description:
      "Wellness, fitness, nutrition, AYUSH, pharmacies, senior living, corporates, influencers and retail outlets.",
  },
  {
    title: "Minimum cart",
    description: "Below ₹250, no discount and no incentive.",
  },
  {
    title: "Home collection",
    description:
      "₹200 for the first patient, ₹100 for each extra patient at the same address. Centre collection is free. No incentive on collection charges.",
  },
  {
    title: "Not a franchise",
    description:
      "You are an independent referral partner. AVMLabs handles sampling, testing and reports.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. HOW IT WORKS (4 STEPS) ================= */}
        <div>
          {/* Section Heading */}
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
              How it works
            </h2>
            <p className="mt-2 text-[#55677A] text-sm sm:text-base leading-relaxed">
              You refer. AVMLabs does everything else.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="border-t border-[#E4E8EC] pt-5 flex flex-col items-start"
              >
                {/* Number Circle */}
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border-[1.5px] border-[#B8893B] text-[#B8893B] flex items-center justify-center font-bold text-xs sm:text-sm mb-3.5 shrink-0">
                  {item.step}
                </div>
                {/* Step Title */}
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#0E294B] mb-2 tracking-tight">
                  {item.title}
                </h3>
                {/* Step Description */}
                <p className="text-sm text-[#55677A] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 2. KEY POINTS (2-COLUMN GRID) ================= */}
        <div className="mt-14 sm:mt-20 pt-12 sm:pt-16 border-t border-[#E4E8EC]">
          {/* Section Heading */}
          <div className="max-w-3xl mb-6 sm:mb-8">
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
              Key points
            </h2>
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
