import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RateList from "@/components/RateList";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <RateList />
        <Faqs />
      </main>
      <Footer />
    </div>
  );
}
