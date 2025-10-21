// ProductTable.tsx
"use client";

import ProductRow from "./ProductRow";
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

interface ProductTableProps {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedProduct: Omit<Product, "id">) => void;
  currentPage: number;
  pageSize: number;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onUpdate,
  currentPage,
  pageSize,
}: ProductTableProps) {
  const { sortOrder } = useProductFilter();

  // ✅ Sorting dilakukan sebelum mapping
  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "asc"
      ? a.namaProduk.localeCompare(b.namaProduk)
      : b.namaProduk.localeCompare(a.namaProduk)
  );

  return (
    <div
      className="relative w-full overflow-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{ maxHeight: "700px" }}
    >
      <table className="min-w-[700px] w-full border-collapse text-xs text-foreground">
        <thead className="bg-gray-100 text-gray-700 sticky top-0 z-30">
          <tr>
            <th
              className="py-2 text-center whitespace-nowrap sticky left-0 z-[55] bg-gray-100 border-r border-gray-200 w-10"
              style={{ boxShadow: "2px 0 3px rgba(0,0,0,0.08)" }}
            >
              No
            </th>
            {/* <th
              className="px-2 py-2 text-left whitespace-nowrap sticky left-[60px] z-[55] bg-gray-100 border-r border-gray-200 min-w-[180px]"
              style={{ boxShadow: "2px 0 3px rgba(0,0,0,0.05)" }}
            >
              Nama Produk
            </th> */}
            <th className="px-2 py-2 text-left">Nama Produk</th>
            <th className="px-2 py-2 text-left">Hrg SM</th>
            <th className="px-2 py-2 text-left">Hrg Pcs</th>
            <th className="px-2 py-2 text-center">Isi</th>
            <th className="px-2 py-2 text-left">Jual_Ecer</th>
            <th className="px-2 py-2 text-left">Jual_Dus</th>
            <th className="px-2 py-2 text-left">Hrg_Sales</th>
            <th className="px-2 py-2 text-center">%Ecer</th>
            <th className="px-2 py-2 text-center">Laba_Dus</th>
            <th className="px-2 py-2 text-left">Kategori</th>
            <th className="px-2 py-2 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={(currentPage - 1) * pageSize + index}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={12}
                className="px-2 py-6 text-center text-gray-500 italic"
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
