import Footer from "@/components/Assets/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Assets/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith -  Gestionnaire d'images",
  description: "Zenith",
  icons: {
    icon: "/pictures/icon/Zenith.ico",
    apple: "/pictures/icon/Zenith.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Header />
        {children}</body>
      <Footer />
    </html>
  );
}
