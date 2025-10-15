"use client";

import { useState, useEffect } from "react";

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

interface ProductFormModalProps {
  onClose: () => void;
  onSubmit: (p: ProductForm) => void;
  initialData?: Product;
}

export default function ProductFormModal({
  onClose,
  onSubmit,
  initialData,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductForm>({
    nama_produk: "",
    harga_jual_ecer: "",
    harga_jual_grosir: "",
    harga_beli_sm: "",
    harga_beli_sales: "",
    kategori: "",
    isi: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nama_produk: initialData.namaProduk || "",
        harga_beli_sm: String(initialData.hargaBeliSm || ""),
        harga_beli_sales: String(initialData.hargaBeliSales || ""),
        harga_jual_ecer: String(initialData.hargaJualEcer || ""),
        harga_jual_grosir: String(initialData.hargaJualGrosir || ""),
        kategori: initialData.kategori || "",
        isi: String(initialData.isi || ""),
      });
    } else {
      setForm({
        nama_produk: "",
        harga_beli_sm: "",
        harga_beli_sales: "",
        harga_jual_ecer: "",
        harga_jual_grosir: "",
        kategori: "",
        isi: "",
      });
    }
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nama Produk</label>
            <input
              type="text"
              name="nama_produk"
              value={form.nama_produk}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Harga Beli SM</label>
            <input
              type="number"
              name="harga_beli_sm"
              value={form.harga_beli_sm}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Harga Beli Sales</label>
            <input
              type="number"
              name="harga_beli_sales"
              value={form.harga_beli_sales}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Harga Jual Ecer</label>
            <input
              type="number"
              name="harga_jual_ecer"
              value={form.harga_jual_ecer}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Harga Jual Grosir</label>
            <input
              type="number"
              name="harga_jual_grosir"
              value={form.harga_jual_grosir}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kategori</label>
            <input
              type="text"
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Isi</label>
            <input
              type="number"
              name="isi"
              value={form.isi}
              onChange={handleChange}
              className="w-full border border-border rounded-md p-2 bg-background"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-muted rounded-md hover:bg-muted/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
