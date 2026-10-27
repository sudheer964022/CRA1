"use client";

import { useState } from "react";
import Image from "next/image";

export interface HeaderProps {
  onAccessRateList?: () => void;
  isRateListOpen?: boolean;
}

export default function Header({
  onAccessRateList,
  isRateListOpen = false,
}: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappNumber = "919699690289";
  const whatsappMessage = "Dear Team,\nI need assistance with a customer referral";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleRateListClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onAccessRateList) {
      e.preventDefault();
      onAccessRateList();
      window.history.pushState(null, "", "#rate-list");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-[#E4E8EC]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-4 sm:gap-8">

        {/* Logo & CRA Sub-brand */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          <a
            href="#hero"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            aria-label="AVMLabs home"
          >
            <Image
              src="/AVMLabs-Logo-WL.png"
              alt="AVMLabs"
              width={360}
              height={240}
              className="h-[48px] sm:h-[56px] md:h-[62px] lg:h-[66px] w-auto object-contain"
              priority
            />
          </a>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto">
          <a
            href="#cra-models"
            className="text-[15px] font-semibold text-[#55677A] hover:text-[#0F2A43] py-1 border-b-2 border-transparent hover:border-[#B8893B] transition-colors"
          >
            CRA Categories
          </a>
          <a
            href="#how-it-works"
            className="text-[15px] font-semibold text-[#55677A] hover:text-[#0F2A43] py-1 border-b-2 border-transparent hover:border-[#B8893B] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#rate-list"
            onClick={handleRateListClick}
            className={`text-[15px] font-semibold py-1 border-b-2 transition-colors cursor-pointer ${
              isRateListOpen
                ? "text-[#0F2A43] border-[#B8893B]"
                : "text-[#55677A] hover:text-[#0F2A43] border-transparent hover:border-[#B8893B]"
            }`}
          >
            Rate list
          </a>
          <a
            href="#register"
            className="text-[15px] font-semibold text-[#55677A] hover:text-[#0F2A43] py-1 border-b-2 border-transparent hover:border-[#B8893B] transition-colors"
          >
            Register
          </a>
          <a
            href="#faqs"
            className="text-[15px] font-semibold text-[#55677A] hover:text-[#0F2A43] py-1 border-b-2 border-transparent hover:border-[#B8893B] transition-colors"
          >
            FAQs
          </a>
        </nav>

        {/* Action Controls: WhatsApp & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex items-center gap-2 bg-[#1E9E4F] hover:bg-[#178441] text-white font-bold text-xs sm:text-[15px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-[0_6px_16px_rgba(30,158,79,0.28)] transition-all active:scale-95 cursor-pointer"
          >
            <svg
              className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-white shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.800s.7-2 1-2.300c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .500l-.3.4-.4.400c-.1.1-.3.3-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.2.4-.2.6-.1l1.900.9c.3.100.5.200.5.300.1.200.1.8-.1 1.400z" />
            </svg>
            <span className="whitespace-nowrap">Chat on WhatsApp</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E4E8EC] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <a
            href="#cra-models"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#55677A] hover:text-[#0F2A43] hover:bg-slate-50 transition-colors"
          >
            CRA Categories
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#55677A] hover:text-[#0F2A43] hover:bg-slate-50 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#rate-list"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleRateListClick(e);
            }}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isRateListOpen
                ? "text-[#0F2A43] font-bold bg-[#FAF4EB]"
                : "text-[#55677A] hover:text-[#0F2A43] hover:bg-slate-50"
            }`}
          >
            Rate list
          </a>
          <a
            href="#register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#55677A] hover:text-[#0F2A43] hover:bg-slate-50 transition-colors"
          >
            Register
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#55677A] hover:text-[#0F2A43] hover:bg-slate-50 transition-colors"
          >
            FAQs
          </a>
        </div>
      )}
    </header>
  );
}
