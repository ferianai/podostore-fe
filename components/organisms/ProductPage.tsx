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
  kategori: string;
  isi: string;
  persen_laba_ecer: string;
  persen_laba_dus: string;
}

interface Product {
  id: string;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  persenLabaEcer: string;
  persenLabaDus: string;
}

export default function ProductPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, loading, error, addProduct, updateProduct, deleteProduct, loadData } = useProductData();
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
    const hargaBeliSm = Number(productForm.harga_beli_sm);
    const isi = Number(productForm.isi);
    const persenLabaEcer = Number(productForm.persen_laba_ecer) / 100;
    const persenLabaDus = Number(productForm.persen_laba_dus) / 100;

    const calculatedHargaJualDus = hargaBeliSm + (hargaBeliSm * persenLabaDus);
    const calculatedHargaJualEcer = (hargaBeliSm / isi) + ((hargaBeliSm * persenLabaEcer) / isi);

    // Rounding function
    const roundUpTo = (value: number, to: number) => Math.ceil(value / to) * to;

    // Round harga_jual_dus: if < 100000, round up to next 500, else to next 1000
    const hargaJualDus = calculatedHargaJualDus < 100000 ? roundUpTo(calculatedHargaJualDus, 500) : roundUpTo(calculatedHargaJualDus, 1000);

    // Round harga_jual_ecer: always round up to next 1000
    const hargaJualEcer = roundUpTo(calculatedHargaJualEcer, 1000);

    const product = {
      namaProduk: productForm.nama_produk,
      hargaBeliSm: hargaBeliSm,
      hargaBeliSales: Number(productForm.harga_beli_sales),
      hargaJualEcer: hargaJualEcer,
      hargaJualDus: hargaJualDus,
      kategori: productForm.kategori,
      isi: isi,
      persenLabaEcer: productForm.persen_laba_ecer,
      persenLabaDus: productForm.persen_laba_dus,
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
    const hargaBeliSm = Number(productForm.harga_beli_sm);
    const isi = Number(productForm.isi);
    const persenLabaEcer = Number(productForm.persen_laba_ecer) / 100;
    const persenLabaDus = Number(productForm.persen_laba_dus) / 100;

    const calculatedHargaJualDus = hargaBeliSm + (hargaBeliSm * persenLabaDus);
    const calculatedHargaJualEcer = (hargaBeliSm / isi) + ((hargaBeliSm * persenLabaEcer) / isi);

    // Rounding function
    const roundUpTo = (value: number, to: number) => Math.ceil(value / to) * to;

    // Round harga_jual_dus: if < 100000, round up to next 500, else to next 1000
    const hargaJualDus = calculatedHargaJualDus < 100000 ? roundUpTo(calculatedHargaJualDus, 500) : roundUpTo(calculatedHargaJualDus, 1000);

    // Round harga_jual_ecer: always round up to next 1000
    const hargaJualEcer = roundUpTo(calculatedHargaJualEcer, 1000);

    const product = {
      namaProduk: productForm.nama_produk,
      hargaBeliSm: hargaBeliSm,
      hargaBeliSales: Number(productForm.harga_beli_sales),
      hargaJualEcer: hargaJualEcer,
      hargaJualDus: hargaJualDus,
      kategori: productForm.kategori,
      isi: isi,
      persenLabaEcer: productForm.persen_laba_ecer,
      persenLabaDus: productForm.persen_laba_dus,
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

  const handleDelete = async (id: string) => {
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

      {error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading products: {error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
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
