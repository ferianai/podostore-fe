"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, Search } from "lucide-react";

interface ProductTableToolbarProps {
  search: string;
  category: string;
  sortOrder: string;
  categories: string[]; // 🔹 dikirim dari ProductPage
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onExportClick: () => void;
  onNewProductClick: () => void;
}

export default function ProductTableToolbar({
  search,
  category,
  sortOrder,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onExportClick,
  onNewProductClick,
}: ProductTableToolbarProps) {
  // 🔹 Ambil kategori unik, filter kosong/null, lalu urutkan alfabetis (A → Z)
  const sortedCategories = Array.from(
    new Set(categories.filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* === Left Section === */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search Input */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search name or ID"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* === Category Filter (dynamic + sorted) === */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm px-2 py-2 bg-white"
        >
          <option value="all">All Categories</option>
          {sortedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* === Sort Order === */}
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm px-2 py-2 bg-white"
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      {/* === Right Section (Actions) === */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onExportClick}
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Download className="w-4 h-4" /> Export
        </Button>
        <Button
          onClick={onNewProductClick}
          className="flex items-center gap-2 text-white shadow-md"
        >
          <Plus className="w-4 h-4" /> New Product
        </Button>
      </div>
    </div>
  );
}
