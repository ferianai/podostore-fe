// ProductPage.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductTable from "@/components/molecules/product/ProductTable";
import ProductFormModal from "@/components/molecules/product/ProductFormModal";
import ProductTableToolbar from "@/components/molecules/product/ProductTableToolbar";
import { useProductFilter } from "@/components/context/ProductFilterContext";

interface Product {
  id: string;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  hargaBeliPcs: number;
  persenLabaEcer: number;
  labaDus: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextOffset, setNextOffset] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { search, category, sortOrder } = useProductFilter();

  const fetchProducts = useCallback(
    async (offsetValue?: string, pageNum?: number, append: boolean = false) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ pageSize: String(pageSize) });
        if (offsetValue) params.append("offset", offsetValue);
        if (search) params.append("search", search);
        if (category !== "all") params.append("kategori", category);
        if (sortOrder) params.append("sort", sortOrder);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        setProducts((prev) =>
          append ? [...prev, ...data.records] : data.records
        );
        setNextOffset(data.offset || null);
        setTotalProducts(data.totalCount || 0);
        if (pageNum) setCurrentPage(pageNum);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, search, category, sortOrder]
  );

  // ✅ Debounce untuk pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(undefined, 1, false);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [fetchProducts]);

  const handleNext = () => {
    if (nextOffset) fetchProducts(nextOffset, currentPage + 1, false);
  };

  const handlePrev = () => {
    if (currentPage > 1) fetchProducts(undefined, currentPage - 1, false);
  };

  const totalPages = Math.ceil(totalProducts / pageSize) || 1;

  return (
    <div className="space-y-1 w-full max-w-[1600px] mx-auto">
      <ProductTableToolbar />

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={() => setShowModal(true)}
            onDelete={() => {}}
            onUpdate={() => {}}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm text-gray-600 border-t pt-4">
        <p>
          <span className="font-medium">{currentPage}</span> dari{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage <= 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!nextOffset || loading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg text-sm px-2 py-1"
          >
            {[100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Load More (Lazy Load) */}
      {nextOffset && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => fetchProducts(nextOffset, undefined, true)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchProducts(undefined, currentPage, false)}
        />
      )}
    </div>
  );
}
