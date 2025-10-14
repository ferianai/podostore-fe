"use client";

import { Edit, Trash2 } from "lucide-react";

const categoryColors: Record<string, string> = {
  makanan: "bg-orange-100 text-orange-700",
  minuman: "bg-blue-100 text-blue-700",
  aksesoris: "bg-purple-100 text-purple-700",
  kebutuhan: "bg-green-100 text-green-700",
  lainnya: "bg-gray-100 text-gray-700",
};

export default function ProductRow({ product, onEdit, onDelete }: any) {
  const categoryKey = product.category?.toLowerCase() || "lainnya";
  const colorClass = categoryColors[categoryKey] || categoryColors["lainnya"];

  return (
    <tr className="border-b hover:bg-muted/50 transition">
      <td className="px-4 py-3 font-medium">{product.namaProduk}</td>
      <td className="px-4 py-3">Rp {product.hargaJualEcer?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaJualGrosir?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaBeliSm?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaBeliSales?.toLocaleString()}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {product.category}
        </span>
      </td>
      <td className="px-4 py-3 text-center">{product.qty}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            product.status?.toLowerCase() === "available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-4 py-3 flex items-center gap-2 justify-end text-muted-foreground">
        <Edit
          size={16}
          className="cursor-pointer hover:text-blue-600"
          onClick={() => onEdit(product)}
        />
        <Trash2
          size={16}
          className="cursor-pointer hover:text-red-600"
          onClick={() => onDelete(product.id)}
        />
      </td>
    </tr>
  );
}
