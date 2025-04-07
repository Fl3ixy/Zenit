"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Mail, Share2, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname()
 if (pathname == "/")
  return;

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <footer className="py-12 bg-transparent border-t border-[#161616] relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <img
              width={50}
              height={10}
              src="/pictures/icon/Zenith.ico"
              alt="Zenith Logo"
            />
          </div>
          <div className="flex gap-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4">
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
            <button
              onClick={handleShareClick}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>

            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Games">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/50 text-sm">2025 Zenith - Fl3ixy. All rights reserved.</p>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl shadow-lg transition-opacity duration-300 z-50">
          Lien copié dans le presse-papiers !
        </div>
      )}
    </footer>
  );
}
