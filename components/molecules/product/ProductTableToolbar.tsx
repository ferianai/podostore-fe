// components/molecules/product/ProductTableToolbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, Search } from "lucide-react";

interface ProductTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onExportClick: () => void;
  onNewProductClick: () => void;
}

export default function ProductTableToolbar({
  search,
  onSearchChange,
  onFilterClick,
  onExportClick,
  onNewProductClick,
}: ProductTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for id, name product"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Filter className="w-4 h-4" /> Filter
        </Button>
        <Button
          variant="outline"
          onClick={onExportClick}
          className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Download className="w-4 h-4" /> Export
        </Button>
        <Button
          onClick={onNewProductClick}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
        >
          <Plus className="w-4 h-4" /> New Product
        </Button>
      </div>
    </div>
  );
}
