import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "FoodHub | Premium Food Delivery & Ordering",
  description: "Experience gourmet culinary delights delivered straight to your doorstep. Order fresh starters, hearty mains, gourmet desserts, and premium beverages.",
  keywords: "food delivery, online order, restaurant, gourmet food, burger, steak, salmon, foodhub",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50 antialiased selection:bg-orange-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
