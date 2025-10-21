// components/molecules/product/ProductTableToolbar.tsx
"use client";
import { useProductFilter, SortOrder } from "@/components/context/ProductFilterContext";

export default function ProductTableToolbar() {
  const { category, setCategory, sortOrder, setSortOrder, categories, loadingCategories } = useProductFilter();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs">
      <div className="flex flex-wrap gap-1 items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loadingCategories}
          className="border rounded px-1 py-1"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="border rounded px-1 py-1"
        >
          <option value={SortOrder.ASC}>A → Z</option>
          <option value={SortOrder.DESC}>Z → A</option>
        </select>
      </div>
    </div>
  );
}
