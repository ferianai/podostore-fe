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
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
      <table className="min-w-full text-sm text-foreground">
        <thead className="bg-muted text-muted-foreground text-left">
          <tr>
            <th className="px-4 py-3 ">Nama Produk</th>
            <th className="px-4 py-3">Harga Beli SM</th>
            <th className="px-4 py-3">Harga Beli Sales</th>
            <th className="px-4 py-3">Harga Jual Ecer</th>
            <th className="px-4 py-3">Harga Jual Dus</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3 text-center">Isi</th>
            <th className="px-4 py-3 text-center">Persen Laba Ecer</th>
            <th className="px-4 py-3 text-center">Persen Laba Dus</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
