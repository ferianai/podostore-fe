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
  labaDus: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextOffset, setNextOffset] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // === Fetch Product Data ===
  const fetchProducts = useCallback(
    async (offsetValue?: string, pageNum?: number) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ pageSize: String(pageSize) });
        if (offsetValue) params.append("offset", offsetValue);
        if (search) params.append("search", search);
        if (category !== "all") params.append("kategori", category);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text(); // Optional: lihat error message dari server
          throw new Error(`HTTP error ${res.status}: ${text}`);
        }
        const data = await res.json();

        setProducts(data.records);
        setNextOffset(data.offset || null);
        setTotalProducts(data.totalCount || 0);
        if (pageNum) setCurrentPage(pageNum);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, search, category]
  );

  useEffect(() => {
    fetchProducts(undefined, 1);
  }, [fetchProducts]);

  const handleNext = () => {
    if (nextOffset) fetchProducts(nextOffset, currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) fetchProducts(undefined, currentPage - 1);
  };

  const totalPages = Math.ceil(totalProducts / pageSize) || 1;

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto">
      <ProductTableToolbar
        search={search}
        category={category}
        sortOrder={sortOrder}
        categories={[...Array.from(new Set(products.map((p) => p.kategori)))]}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSortOrder}
        onExportClick={() => window.open("/api/products?export=true", "_blank")}
        onNewProductClick={() => setShowModal(true)}
        onUpdateProductClick={() => setShowModal(true)}
        onSettingClick={() => setShowModal(true)}
      />

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
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
          <ProductTable
            products={products}
            onEdit={(p: Product) => console.log("Edit", p)}
            onDelete={(id: string) => console.log("Delete", id)}
            onUpdate={(id: string, data: Omit<Product, "id">) =>
              console.log("Update", id, data)
            }
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="text-gray-600">
          <span className="font-medium text-gray-800">Halaman {currentPage}</span>{" "}
          dari{" "}
          <span className="font-medium text-gray-800">{totalPages}</span>
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
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchProducts(undefined, currentPage)}
        />
      )}
    </div>
  );
}
