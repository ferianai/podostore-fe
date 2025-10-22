"use client";

import { Search } from "lucide-react";
import HamburgerMenuDrawer from "./HamburgerMenuDrawer";
import { useProductFilter } from "@/components/context/ProductFilterContext";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Header() {
  const { search, setSearch } = useProductFilter();

  return (
    <header className="bg-[#191258] text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center px-4 py-2 sm:py-3 sm:w-full max-w-[1600px] mx-auto">
        
        {/* Logo */}
        <div className="flex shrink-0">
          <Link href="/" passHref>
            <span className="text-lg text-[#fbe80f] sm:text-xl font-bold cursor-pointer">
              xyz<span className="text-[#1ac2ff]">grosir</span>
            </span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Navigation Menu */}
        <nav className="hidden sm:flex gap-4 mr-4">
          <Link href="/product" passHref>
            <span className="text-sm hover:text-[#fbe80f] cursor-pointer">Products</span>
          </Link>
          <Link href="/auth/login" passHref>
            <span className="text-sm hover:text-[#fbe80f] cursor-pointer">Login</span>
          </Link>
        </nav>

        {/* Search bar */}
        <div className="flex items-center relative w-[160px] sm:w-[260px] lg:w-[350px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            type="text"
            placeholder="Search name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 sm:py-2 rounded-md bg-white shadow-sm text-xs sm:text-xs text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#606911] transition"
          />
        </div>

        {/* Hamburger Menu */}
        <div className="flex shrink-0 ml-2">
          <HamburgerMenuDrawer />
        </div>
      </div>
    </header>
  );
}
