import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import MobileNavBar from '@/components/MobileNavBar';
const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  metadataBase: new URL("https://hamroeshop.com"),
  title: "EShop - Your choice to buy",
  description: "EShop - Your choice to buy. The best online shopping experience.",
  openGraph: {
    title: "EShop - Your choice to buy",
    description: "EShop - The best online shopping experience in Nepal.",
    url: "https://hamroeshop.com",
    siteName: "Hamro EShop",
    images: [
      {
        url: "/og.png", 
        width: 1200,
        height: 630,
        alt: "Hamro EShop - Your best shopping partner"
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EShop - Your choice to buy",
    description: "Hamro EShop - The best shopping experience in Nepal.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <Toaster />
          <AppContextProvider>
            {children}
            <MobileNavBar /> 
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}