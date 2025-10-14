"use client";

import ProductRow from "./ProductRow";

interface ProductTableProps {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (id: number) => void;
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
            <th className="px-4 py-3">Nama Produk</th>
            <th className="px-4 py-3">Harga Ecer</th>
            <th className="px-4 py-3">Harga Grosir</th>
            <th className="px-4 py-3">Beli SM</th>
            <th className="px-4 py-3">Beli Sales</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Status</th>
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
