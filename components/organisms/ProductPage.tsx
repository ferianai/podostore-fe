"use client";

import { useState } from "react";
import ProductTable from "@/components/molecules/product/ProductTable";
import ProductFormModal from "@/components/molecules/product/ProductFormModal";
import ProductTableToolbar from "@/components/molecules/product/ProductTableToolbar";
import ProductSkeleton from "@/components/molecules/product/ProductSkeleton";
import { useProductData } from "@/hooks/useProductData";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useDarkMode } from "@/hooks/useDarkMode";
import { usePagination } from "@/hooks/usePagination";

interface ProductForm {
  nama_produk: string;
  harga_beli_sm: string;
  harga_beli_sales: string;
  harga_jual_ecer: string;
  harga_jual_grosir: string;
  kategori: string;
  isi: string;
}

interface Product {
  id: number;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualGrosir: number;
  kategori: string;
  isi: number;
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
    categories,
    sortedProducts,
    handleExport,
  } = useProductFilters(products);

  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    paginatedData,
  } = usePagination(sortedProducts, 10);

  const handleAddProduct = async (productForm: ProductForm) => {
    const product = {
      namaProduk: productForm.nama_produk,
      hargaBeliSm: Number(productForm.harga_beli_sm),
      hargaBeliSales: Number(productForm.harga_beli_sales),
      hargaJualEcer: Number(productForm.harga_jual_ecer),
      hargaJualGrosir: Number(productForm.harga_jual_grosir),
      kategori: productForm.kategori,
      isi: Number(productForm.isi),
    };
    try {
      await addProduct(product);
      setModalOpen(false);
      setEditingProduct(null);
      await loadData(); // Ensure loadData is awaited
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleEditProduct = async (productForm: ProductForm) => {
    if (!editingProduct) return;
    const product = {
      namaProduk: productForm.nama_produk,
      hargaBeliSm: Number(productForm.harga_beli_sm),
      hargaBeliSales: Number(productForm.harga_beli_sales),
      hargaJualEcer: Number(productForm.harga_jual_ecer),
      hargaJualGrosir: Number(productForm.harga_jual_grosir),
      kategori: productForm.kategori,
      isi: Number(productForm.isi),
    };
    try {
      await updateProduct(editingProduct.id, product);
      setModalOpen(false);
      setEditingProduct(null);
      await loadData(); // Ensure loadData is awaited
    } catch (error) {
      console.error("Failed to edit product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        await loadData(); // Ensure loadData is awaited
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
          products={paginatedData}
          onEdit={(p) => {
            setEditingProduct(p);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* pagination control */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground border-t pt-3">
        {/* Left info */}
        <div>
          {`${(page - 1) * rowsPerPage + 1} - ${Math.min(page * rowsPerPage, sortedProducts.length)} of ${sortedProducts.length} items`}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Rows per page selector */}
          <div className="flex items-center gap-1">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded-md px-2 py-1 bg-background"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <span>The page on</span>
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="border rounded-md px-2 py-1 bg-background"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border rounded-md px-2 py-1 hover:bg-muted disabled:opacity-50"
          >
            ‹
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border rounded-md px-2 py-1 hover:bg-muted disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          initialData={editingProduct || undefined}
        />
      )}
    </div>
  );
}
