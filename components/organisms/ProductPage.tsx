// components/organisms/ProductPage.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import ProductTable from "@/components/molecules/product/ProductTable";
import ProductFormModal from "@/components/molecules/product/ProductFormModal";
import ProductTableToolbar from "@/components/molecules/product/ProductTableToolbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  persenLabaEcer: number;
  persenLabaDus: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState<string | null>(null);
  const [nextOffset, setNextOffset] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = useCallback(
    async (offsetValue?: string) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ pageSize: String(pageSize) });
        if (offsetValue) params.append("offset", offsetValue);
        if (search) params.append("search", search);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        setProducts(data.records);
        setOffset(offsetValue || null);
        setNextOffset(data.offset || null);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, search]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNext = () => {
    if (nextOffset) fetchProducts(nextOffset);
  };
  const handlePrev = () => {
    fetchProducts();
  };

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4">
      {/* === Toolbar === */}
      <ProductTableToolbar
        search={search}
        onSearchChange={setSearch}
        onFilterClick={() => console.log("Filter clicked")}
        onExportClick={() => console.log("Export clicked")}
        onNewProductClick={() => setShowModal(true)}
      />

      {/* === Product Table === */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          </div>
        ) : (
          // 🟣 Tambahkan wrapper scrollable di sini
          <div >
            <ProductTable
              products={products}
              onEdit={(p: Product) => console.log("Edit", p)}
              onDelete={(id: string) => console.log("Delete", id)}
              onUpdate={(id: string, data: Omit<Product, 'id'>) => console.log("Update", id, data)}
            />
          </div>
        )}
      </div>

      {/* === Pagination === */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="text-gray-500">
          <span className="font-medium text-gray-700">1–{pageSize}</span> of{" "}
          <span className="text-gray-700">13 Pages</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={!offset || loading}
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!nextOffset || loading}
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {[10, 20, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchProducts()}
        />
      )}
    </div>
  );
}
