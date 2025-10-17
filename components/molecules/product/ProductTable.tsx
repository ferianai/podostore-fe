"use client";

import ProductRow from "./ProductRow";

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

interface ProductTableProps {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedProduct: Omit<Product, "id">) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onUpdate,
}: ProductTableProps) {
  return (
    <div
      className="relative w-full overflow-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{ maxHeight: "700px" }}
    >
      <table className="min-w-[1200px] w-full border-collapse text-sm text-foreground">
        {/* === Sticky Header === */}
        <thead className="bg-gray-100 text-gray-700 sticky top-0 z-30">
          <tr>
            <th
              className="px-4 py-2 text-left whitespace-nowrap sticky left-0 z-40 bg-gray-100 border-r border-gray-200"
              style={{ boxShadow: "2px 0 3px rgba(0,0,0,0.05)" }}
            >
              Nama Produk
            </th>
            <th className="px-2 py-2">Harga Beli SM</th>
            <th className="px-4 py-2">Harga Beli Sales</th>
            <th className="px-4 py-2">Harga Jual Ecer</th>
            <th className="px-4 py-2">Harga Jual Dus</th>
            <th className="px-4 py-2">Kategori</th>
            <th className="px-4 py-2 text-center">Isi</th>
            <th className="px-4 py-2 text-center">Persen Laba Ecer</th>
            <th className="px-4 py-2 text-center">Persen Laba Dus</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>

        {/* === Body === */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={10}
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                Tidak ada produk yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
