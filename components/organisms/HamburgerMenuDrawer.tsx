"use client";

import { useState } from "react";
import Link from "next/link";

export default function HamburgerMenuDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <Link href="/" className="block hover:text-purple-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/product" className="block hover:text-purple-700">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="block hover:text-purple-700">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <button
        className="p-1.5 rounded-md hover:bg-purple-700 transition sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
