"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { useStore } from "@/lib/store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Organic Tea", href: "/products?category=organic-tea" },
  { label: "Natural Herb's", href: "/products?category=natural-herbs" },
  { label: "Natural Soap's", href: "/products?category=natural-soaps" },
  { label: "Pickle's", href: "/products?category=pickles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">

      {/* Top bar */}
      <div className="bg-[#161616] border-b border-[#2A2A2A] text-center py-1">
        <p className="text-[0.75rem] text-[#C9A84C] tracking-widest font-raleway">
          We're currently undergoing maintenance. Please check back soon.
        </p>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between h-[72px] px-[5%]">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center">
          <img
            src="/Images/Logo.png"
            alt="Logo"
            className="object-contain hover:scale-105 transition w-auto h-16"
            
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#C8C0B0] text-[0.82rem] font-medium tracking-wide hover:text-[#C9A84C] transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#C8C0B0] hover:text-[#C9A84C] transition"
          >
            <Search size={20} />
          </button>

          {/* User */}
          <Link href="/profile" className="text-[#C8C0B0] hover:text-[#C9A84C] transition">
            <User size={20} />
          </Link>

          {/* Wishlist */}
          <Link href="/profile?tab=wishlist" className="text-[#C8C0B0] hover:text-[#C9A84C] transition">
            <Heart size={20} />
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-[#C8C0B0] hover:text-[#C9A84C] transition"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] text-black rounded-full w-[18px] h-[18px] text-[0.65rem] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#C8C0B0]"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="bg-[#111111] border-t border-[#2A2A2A] py-3 px-[5%]">
          <div className="flex gap-2 max-w-[500px] mx-auto">
            <input
              placeholder="Search organic products..."
              className="flex-1 px-4 py-2 bg-[#161616] border border-[#C9A84C] text-[#F5F0E8] rounded font-raleway outline-none"
            />
            <button className="bg-gradient-to-br from-[#C9A84C] to-[#9A7A2E] text-black px-5 py-2 font-semibold text-sm tracking-wide">
              SEARCH
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-[#111111] border-t border-[#2A2A2A] px-[5%] py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[#C8C0B0] text-sm border-b border-[#1A1A1A]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}