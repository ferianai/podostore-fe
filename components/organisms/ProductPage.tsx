"use client";

import { useState } from "react";
import ProductTable from "@/components/molecules/product/ProductTable";
import ProductFormModal from "@/components/molecules/product/ProductFormModal";
import ProductTableToolbar from "@/components/molecules/product/ProductTableToolbar";
import ProductSkeleton from "@/components/molecules/product/ProductSkeleton";
import { useProductData } from "@/hooks/useProductData";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useDarkMode } from "@/hooks/useDarkMode";

interface Product {
  id: number;
  namaProduk: string;
  hargaJualEcer: number;
  hargaJualGrosir: number;
  hargaBeliSm: number;
  hargaBeliSales: number;
  category: string;
  qty: number;
  status: string;
}

export default function ProductPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, loading, addProduct, updateProduct, deleteProduct, loadData } = useProductData();
  const { darkMode, setDarkMode } = useDarkMode();

  const {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    page,
    setPage,
    categories,
    paginatedProducts,
    totalPages,
    handleExport,
  } = useProductFilters(products);

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addProduct(product);
      setModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleEditProduct = async (product: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, product);
      setModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error("Failed to edit product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Product Dashboard</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Produk
        </button>
      </div>

      <ProductTableToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onExport={handleExport}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {loading ? (
        <ProductSkeleton />
      ) : (
        <ProductTable
          products={paginatedProducts}
          onEdit={(p) => {
            setEditingProduct(p);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* pagination control */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}
