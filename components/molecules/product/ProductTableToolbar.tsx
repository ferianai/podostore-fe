// components/molecules/product/ProductTableToolbar.tsx
"use client";

import { useProductFilter, SortOrder } from "@/components/context/ProductFilterContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductTableToolbar() {
  const { category, setCategory, sortOrder, setSortOrder, categories, loadingCategories } =
    useProductFilter();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category Select */}
        <Select
          value={category}
          onValueChange={(val) => setCategory(val)}
          disabled={loadingCategories}
        >
          <SelectTrigger className="w-[150px] text-xs" size="sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" className="text-xs max-h-120">
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Order Select */}
        <Select
          value={sortOrder}
          onValueChange={(val) => setSortOrder(val as SortOrder)}
        >
          <SelectTrigger className="w-[80px] text-xs" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" className="w-[80px] text-xs">
            <SelectItem value={SortOrder.ASC}>A → Z</SelectItem>
            <SelectItem value={SortOrder.DESC}>Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
