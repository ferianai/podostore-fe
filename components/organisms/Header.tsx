"use client";

import { Search } from "lucide-react";
import HamburgerMenuDrawer from "./HamburgerMenuDrawer";
import { useState } from "react";

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="bg-[#1b0341] text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 sm:py-3 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-lg sm:text-xl font-bold">
            xyz<span className="text-yellow-400">grosir</span>
          </span>
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:flex items-center w-[250px] relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-2 py-2 rounded-full bg-white shadow-sm text-sm sm:text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#606911] transition"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-2 sm:hidden">
          {/* Search Icon toggles search input */}
          <button
            aria-label="Search"
            className="p-1.5 rounded-md hover:bg-purple-700 transition"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Hamburger Drawer */}
          <HamburgerMenuDrawer />
        </div>
      </div>

      {/* Mobile Search Input (overlay below header) */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-2 rounded-full bg-white shadow-sm text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#606911] transition"
              autoFocus
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}
