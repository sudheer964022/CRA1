"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero, { type CraModelKey } from "@/components/Hero";
import CraModel from "@/components/CraModel";
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
    setTimeout(() => {
      const el = document.getElementById("rate-list");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCloseRateList = () => {
    setShowRateList(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onAccessRateList={handleAccessRateList}
        />
        <CraModel />
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
      <Footer />
    </div>
  );
}
