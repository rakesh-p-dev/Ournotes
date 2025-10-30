import Features from "@/components/ui/Features";
import About from "@/components/ui/About";
import { Metadata } from "next";
import HeroSection from "@/components/ui/HeroSection";

export const metadata: Metadata = {
  title: "Ournotes - Study Smarter with AI-Powered Learning",
  description:
    "Transform your learning experience with Ournotes - Access comprehensive study notes, AI-powered quizzes, and personalized study assistance. Join thousands of students achieving academic excellence.",
  keywords: [
    "study notes",
    "AI learning",
    "education",
    "student resources",
    "academic notes",
    "quiz platform",
    "study tools",
    "online learning",
    "exam preparation",
  ],
  openGraph: {
    title: "Our notes - Study Smarter with AI-Powered Learning",
    description:
      "Transform your learning experience with OurNotes - Access comprehensive study notes, AI-powered quizzes, and personalized study assistance.",
    url:  "https://our-notes-rakesh-paulraj1s-projects.vercel.app/",
    siteName: "Our Notes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OurNotes - Study Smarter with AI-Powered Learning",
    description:
      "Transform your learning experience with Ournotes - Access comprehensive study notes, interactive flashcards, AI-powered quizzes, and personalized study assistance.",
    site: "@ournotes",
    creator: "@ournotes",
  },
  alternates: {
    canonical:
      "https://our-notes-rakesh-paulraj1s-projects.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export const dynamic = "force-dynamic";

export default async function Home() {
  
  return (
   
 

    <div className="font-satoshi container mx-auto min-h-screen max-w-6xl bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
   
      <div className="mx-4">
        
        <HeroSection />
        <About />
        <Features />
      </div>
    </div>
   
  );
}
