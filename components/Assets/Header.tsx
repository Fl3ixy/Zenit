"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation'


export default function Header() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const pathname = usePathname()
  if (pathname == "/") {
    return;
  }

  const Logo = ({ className = "" }) => (
    <li className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center">
        <Link href={"/home"}>
          <Image
            src="/pictures/icon/Zenith.ico"
            width={50}
            height={10}
            alt="LypsChill Logo"
          />
        </Link>
      </div>
      <button
        onClick={() => setToggleSidebar(!toggleSidebar)}
        className="lg:hidden rounded-lg border-0 bg-transparent text-white transition-all duration-200 ease-out focus:border-4 flex flex-col justify-center items-center w-10 h-10"
      >
        {/* Première barre du burger */}
        <div
          className={`w-7 h-1 bg-white my-1 transition-transform duration-300 ${
            toggleSidebar ? "rotate-45 translate-y-2" : ""
          }`}
        ></div>
        {/* Deuxième barre (celle du milieu) */}
        <div
          className={`w-7 h-1 bg-white my-1 transition-opacity duration-300 ${
            toggleSidebar ? "opacity-0" : "opacity-100"
          }`}
        ></div>
        {/* Troisième barre du burger */}
        <div
          className={`w-7 h-1 bg-white my-1 transition-transform duration-300 ${
            toggleSidebar ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></div>
      </button>
    </li>
  );

  return (
    <header className="flex">
      <nav className="w-full bg-transparent">
        <ul className="flex justify-between p-5 text-[1.5rem]">
          <div className="flex w-full flex-col lg:flex-row justify-between gap-5 lg:gap-10">
            {/* Logo apparaît sur tous les formats */}
            <Logo />

            {/* Menu mobile - visible uniquement sur petits écrans et quand ouvert */}
            <div
              className={`${
                toggleSidebar ? "flex" : "hidden"
              } flex-col items-start gap-5 lg:hidden transition-all duration-300 ease-in-out transform ${
                toggleSidebar ? "translate-y-0" : "-translate-y-10"
              } z-50`} // Retiré l'overflow: "hidden" ici
            >
              {[{ name: "Home", link: "/" }, { name: "About", link: "/about" }, { name: "Contact", link: "/contact" }].map(
                (link) => (
                  <li key={link.name} className="w-full">
                    <Link href={link.link} className="text-white">
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </div>

            {/* Menu PC - visible uniquement sur grands écrans */}
            <div className="hidden lg:flex w-full items-center justify-end gap-20">
              <div className="flex gap-4 justify-end w-full">
                <Link
                  href="/home"
                  className="text-white duration-200 font-medium ease-out hover:-translate-y-2"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-white duration-200 ease-out font-medium hover:-translate-y-2"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white duration-200 ease-out font-medium hover:-translate-y-2"
                >
                  Contacts
                </Link>
              </div>
            </div>
          </div>
        </ul>
      </nav>
    </header>
  );
}
