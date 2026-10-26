"use client";

import { useState } from "react";

export type CraModel = "C4000" | "C2525" | "C0040";

interface CraModelOption {
  id: CraModel;
  title: string;
  subtitle: string;
}

const CRA_MODELS: CraModelOption[] = [
  {
    id: "C4000",
    title: "C4000",
    subtitle: "Max customer saving",
  },
  {
    id: "C2525",
    title: "C2525",
    subtitle: "Balanced",
  },
  {
    id: "C0040",
    title: "C0040",
    subtitle: "Max partner earning",
  },
];

const PARTNER_TYPES = [
  "Pharmacy",
  "Clinic / Doctor",
  "Diagnostic Lab / Collection Centre",
  "Hospital / Nursing Home",
  "Wellness Centre / Gym / Nutritionist",
  "Individual Healthcare Professional",
  "Corporate / Organization",
  "Other",
];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [partnerType, setPartnerType] = useState("Pharmacy");
  const [city, setCity] = useState("");
  const [preferredModel, setPreferredModel] = useState<CraModel>("C0040");

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedModelMeta = CRA_MODELS.find((m) => m.id === preferredModel);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setHasError(true);
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 10) {
      setHasError(true);
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setHasError(false);
    setErrorMessage("");
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setMobileNumber("");
    setEmail("");
    setOrganisation("");
    setCity("");
    setPreferredModel("C0040");
    setHasError(false);
    setErrorMessage("");
  };

  return (
    <section id="register" className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 sm:mb-9">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
            Register as a partner
          </h2>
          <p className="mt-2 text-slate-500 text-sm sm:text-base leading-relaxed">
            Fill in a few basic details. Our team will contact you for KYC and activate your QR within 24 to 48 hours.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-[#FAFDFB] border border-[#BDE5CE] rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-[#1E9E4F]/10 text-[#1E9E4F] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#0E294B] tracking-tight">
              Registration Submitted Successfully
            </h3>
            <p className="mt-2.5 text-slate-600 text-sm sm:text-base leading-relaxed">
              Thank you, <strong className="text-slate-900">{fullName}</strong>. Your referral partner registration has been received. Our team will verify your details and contact you on <strong className="text-slate-900">{mobileNumber}</strong> for KYC and to activate your partner QR code within 24 to 48 hours.
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-4 mt-6 text-left max-w-md mx-auto grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Partner Type</span>
                <span className="text-slate-800 font-semibold">{partnerType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Preferred Model</span>
                <span className="text-[#B8893B] font-bold">{preferredModel} ({selectedModelMeta?.subtitle})</span>
              </div>
              {city && (
                <div className="col-span-2 border-t border-slate-100 pt-2">
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">City</span>
                  <span className="text-slate-800 font-semibold">{city}</span>
                </div>
              )}
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm transition-all cursor-pointer font-sans"
              >
                Submit another registration
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} noValidate className="space-y-4 sm:space-y-5">
            {hasError && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 text-sm text-red-700 flex items-center gap-2">
                <span className="text-red-500 font-bold">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div>
                <label htmlFor="reg-fullname" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    hasError && !fullName.trim()
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20"
                  }`}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="reg-mobile" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="10-digit number"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    hasError && !mobileNumber.trim()
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20 transition-colors"
                />
              </div>

              {/* Organisation / Business Name */}
              <div>
                <label htmlFor="reg-org" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Organisation / business name
                </label>
                <input
                  id="reg-org"
                  type="text"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Optional for individuals"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20 transition-colors"
                />
              </div>

              {/* Partner Type */}
              <div>
                <label htmlFor="reg-type" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Partner type
                </label>
                <div className="relative">
                  <select
                    id="reg-type"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full appearance-none px-3.5 pr-10 py-2.5 sm:py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20 cursor-pointer transition-colors"
                  >
                    {PARTNER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 inset-y-0 flex items-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="reg-city" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  City
                </label>
                <input
                  id="reg-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Pune"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20 transition-colors"
                />
              </div>
            </div>

            {/* Preferred CRA Model */}
            <div className="pt-1">
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Preferred CRA model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CRA_MODELS.map((model) => {
                  const isSelected = preferredModel === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setPreferredModel(model.id)}
                      aria-pressed={isSelected}
                      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#FDF8EE] border-[#C8923A] shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Radio indicator circle */}
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "border-[#C8923A] bg-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C8923A]" />
                        )}
                      </span>

                      {/* Content */}
                      <div className="min-w-0">
                        <span className="block font-bold text-slate-900 text-sm sm:text-base leading-tight">
                          {model.title}
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5 leading-snug">
                          {model.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3.5 sm:py-4 rounded-full bg-[#0F2A43] hover:bg-[#1B4268] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer font-sans"
              >
                <span>Submit</span>
              </button>
              <p className="mt-2.5 text-xs text-slate-500">
                Your details will be reviewed by the AVMLabs partner onboarding team.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
