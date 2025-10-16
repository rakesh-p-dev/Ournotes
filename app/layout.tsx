
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
          <body className={`${inter.className} min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
            <MainNav />
            {children}
            <Footer />
            <Toaster />
          </body>
        </html>
      </ThemeProvider>
    </Providers>
  );
}
