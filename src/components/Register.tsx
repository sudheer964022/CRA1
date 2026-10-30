"use client";

import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiSuccessMessage, setApiSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setHasError(true);
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length !== 10) {
      setHasError(true);
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setHasError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setHasError(true);
      setErrorMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setHasError(false);
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cra-lead/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobile: mobileNumber.trim(),
          email: email.trim() || null,
          pincode: pincode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setHasError(true);
        setErrorMessage(data.message || "Failed to submit registration. Please try again.");
        return;
      }

      if (data.message) {
        setApiSuccessMessage(data.message);
      }
      setIsSubmitted(true);
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setMobileNumber("");
    setEmail("");
    setPincode("");
    setHasError(false);
    setErrorMessage("");
    setApiSuccessMessage("");
  };

  return (
    <section id="register" className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with CRA (Customer Referral Agency) definition */}
        <div className="mb-7 sm:mb-9">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-8 h-[2px] bg-[#B8893B] rounded-full inline-block" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] text-[#B8893B] uppercase font-sans">
              CRA · CUSTOMER REFERRAL AGENCY
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0E294B] tracking-tight leading-tight">
            Register as a partner
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Fill in your details to get onboarded as an authorized Customer Referral Agency (CRA) partner. The AVMLabs onboarding team will review your application, verify KYC, and activate your partner account within 24 to 48 hours.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-[#FAFDFB] border border-[#BDE5CE] rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-[#1E9E4F]/10 text-[#1E9E4F] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#0E294B] tracking-tight">
              Registration Received — Ready for Onboarding
            </h3>
            <p className="mt-2.5 text-slate-600 text-sm sm:text-base leading-relaxed">
              Thank you, <strong className="text-slate-900">{fullName}</strong>. Your partner registration details have been securely recorded. Our onboarding team will contact you on{" "}
              <strong className="text-slate-900">{mobileNumber}</strong> to complete KYC verification and activate your partner account within 24 to 48 hours.
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-4 mt-6 text-left max-w-md mx-auto grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Mobile</span>
                <span className="text-slate-800 font-semibold">{mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Pincode</span>
                <span className="text-slate-800 font-semibold">{pincode}</span>
              </div>
              {email && (
                <div className="col-span-2 border-t border-slate-100 pt-2">
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Email</span>
                  <span className="text-slate-800 font-semibold">{email}</span>
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
                  disabled={isSubmitting}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${
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
                  maxLength={10}
                  disabled={isSubmitting}
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/\D/g, ""));
                    if (hasError) setHasError(false);
                  }}
                  placeholder="10-digit number"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    hasError && (!mobileNumber.trim() || mobileNumber.trim().length !== 10)
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
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20 transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="reg-pincode" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-pincode"
                  type="text"
                  maxLength={6}
                  disabled={isSubmitting}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    if (hasError) setHasError(false);
                  }}
                  placeholder="6-digit pincode (e.g. 500081)"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    hasError && (!pincode.trim() || pincode.trim().length !== 6)
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-[#0E294B] focus:ring-1 focus:ring-[#0E294B]/20"
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 sm:py-4 rounded-full bg-[#0F2A43] hover:bg-[#1B4268] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer font-sans disabled:opacity-75 disabled:cursor-not-allowed gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <span>Submit Details</span>
                )}
              </button>
              <p className="mt-2.5 text-xs text-slate-500 text-center">
                No registration fee deposit required. Our onboarding team will contact you for KYC and activation.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
