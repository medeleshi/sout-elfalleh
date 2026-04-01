"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "#how-it-works", label: "كيفية العمل" },
    { href: "#farmers", label: "المزارعون" },
    { href: "#about", label: "من نحن" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass shadow-sm transition-all duration-300">
      <div className="flex flex-row justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto md:px-12">
        {/* Mobile Toggle & Actions (Left side in RTL) */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link 
            href="/login" 
            className="hidden sm:block text-primary font-bold hover:text-primary-container transition-colors text-sm md:text-base px-2"
          >
            تسجيل الدخول
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2.5 md:px-7 md:py-3 rounded-2xl bg-primary text-on-primary font-black hover:scale-[1.05] hover:shadow-lg active:scale-95 transition-all duration-300 text-sm md:text-base whitespace-nowrap shadow-md"
          >
            أنشئ حسابك
          </Link>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Nav Links (Center in visual flow) */}
        <div className="hidden md:flex items-center gap-8 font-serif text-lg font-bold">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-on-surface-variant hover:text-primary transition-colors duration-300 ${link.href === "/" ? "text-primary border-b-2 border-primary pb-1" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Brand Identity (Right side in RTL) */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-primary font-serif">
          صوت الفلاح
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-surface-container/95 backdrop-blur-xl border-t border-primary/10 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-8 flex flex-col gap-6 text-right font-serif">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-on-surface-variant hover:text-primary transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-primary/10 flex flex-col gap-4">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-5 text-center rounded-2xl border-2 border-primary/20 text-primary font-black text-xl hover:bg-primary/5 active:scale-95 transition-all"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/signup" 
              onClick={() => setIsOpen(false)}
              className="block w-full py-5 text-center rounded-2xl bg-primary text-on-primary font-black text-xl hover:bg-primary-container active:scale-95 transition-all shadow-xl"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
