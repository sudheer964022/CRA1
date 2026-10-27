"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero, { type CraModelKey } from "@/components/Hero";
import RateList from "@/components/RateList";
import HowItWorks from "@/components/HowItWorks";
import Register from "@/components/Register";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<CraModelKey>("C4000");
  const [showRateList, setShowRateList] = useState(false);

  const handleAccessRateList = () => {
    setShowRateList(true);
    const scrollTarget = () => {
      const el = document.getElementById("rate-list");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (document.getElementById("rate-list")) {
      scrollTarget();
    } else {
      setTimeout(scrollTarget, 120);
    }
  };

  const handleCloseRateList = () => {
    setShowRateList(false);
  };

  // Synchronize initial URL hash or external anchor clicks
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash === "#rate-list") {
        setShowRateList(true);
        setTimeout(() => {
          const el = document.getElementById("rate-list");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header
        onAccessRateList={handleAccessRateList}
        isRateListOpen={showRateList}
      />
      <main className="flex-1">
        <Hero
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onAccessRateList={handleAccessRateList}
        />
        
        {showRateList && (
          <RateList
            selectedModel={selectedModel}
            onClose={handleCloseRateList}
          />
        )}
        <HowItWorks />
        <Register />
        <Faqs />
      </main>
      <Footer onAccessRateList={handleAccessRateList} />
    </div>
  );
}
