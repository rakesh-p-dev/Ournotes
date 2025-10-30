
import { Poppins, Lexend, Montserrat, Roboto, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/utils/providers";
import {Toaster} from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/ui/Themeprovider";
import Footer from "@/components/ui/Footer";
import MainNav from "@/components/ui/Navbar";



export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lexend",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
  display: "swap",
});



export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ThemeProvider  
      
        defaultTheme="system" 
        enableSystem
        storageKey="notes-buddy-theme"
        disableTransitionOnChange={false}>
        <html lang="en">
          <head>
            <link rel="icon" href="./favicon.svg" />
          </head>
          <body className={`${inter.className} min-h-screen relative bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors duration-300`}>
          
        

            <div className="relative z-10">
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
      backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
    }}
  />

              <MainNav />
              {children}
              <Footer />
              <Toaster />
            </div>
          </body>
        </html>
      </ThemeProvider>
    </Providers>
  );
}
