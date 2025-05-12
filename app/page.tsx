import Hero from "@/components/ui/landing/hero";
import Features from "@/components/ui/landing/Features";
import Footer from "@/components/ui/landing/Footer";
import Navbar from "@/components/ui/landing/Navbar";
import HowItWorks from "@/components/ui/landing/HowItWorks";
import ComparisonSection from "@/components/ui/landing/ComparisonSection";
import Cta from "@/components/ui/landing/Cta";
import FAQSection from "@/components/ui/landing/FAQSection";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* <HowItWorks /> */}
        {/* <ComparisonSection /> */}
        {/* <FAQSection/> */}
        {/* <Cta /> */}
      </main>
      <Footer />
    </div>
  );
}
