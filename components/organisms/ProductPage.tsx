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
  const [totalProducts, setTotalProducts] = useState(0);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [offset, setOffset] = useState<string | null>(null);
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

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        setProducts(data.records);
        setFiltered(data.records);
        setOffset(offsetValue || null);
        setNextOffset(data.offset || null);
        if (pageNum) setCurrentPage(pageNum);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, search]
  );

  useEffect(() => {
    fetchProducts(undefined, 1);
  }, [fetchProducts]);

  // === Filter, Search, Sort ===
  useEffect(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter(
        (p) => p.kategori?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.namaProduk.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) =>
      sortOrder === "asc"
        ? a.namaProduk.localeCompare(b.namaProduk)
        : b.namaProduk.localeCompare(a.namaProduk)
    );

    setFiltered(result);
  }, [search, category, sortOrder, products]);

  // === Export ===
  const handleExport = () => {
    const csv = [
      [
        "Nama Produk",
        "Harga Beli SM",
        "Harga Beli Sales",
        "Harga Jual Ecer",
        "Harga Jual Dus",
        "Kategori",
        "Isi",
      ],
      ...filtered.map((p) => [
        p.namaProduk,
        p.hargaBeliSm,
        p.hargaBeliSales,
        p.hargaJualEcer,
        p.hargaJualDus,
        p.kategori,
        p.isi,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  // === Pagination ===
  const handleNext = () => {
    if (nextOffset) fetchProducts(nextOffset, currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) fetchProducts(undefined, currentPage - 1);
  };

  const sortedCategories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.kategori))).sort((a, b) =>
      a.localeCompare(b)
    ),
  ];

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto px-4">
      {/* === Toolbar === */}
      <ProductTableToolbar
        search={search}
        category={category}
        sortOrder={sortOrder}
        categories={sortedCategories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSortOrder}
        onExportClick={handleExport}
        onNewProductClick={() => setShowModal(true)}
      />

      {/* === Table === */}
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
          <ProductTable
            products={filtered}
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

      {/* === Pagination Control === */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="text-gray-600">
          <span className="font-medium text-gray-800">
            Halaman {currentPage}
          </span>{" "}
          dari{" "}
          <span className="font-medium text-gray-800">
            {Math.ceil(filtered.length / pageSize) || 1}
          </span>
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

      {/* === Modal === */}
      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchProducts(undefined, currentPage)}
        />
      )}
    </div>
  );
}
