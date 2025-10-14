"use client";

import { Edit, Trash2 } from "lucide-react";

export default function ProductRow({ product, onEdit, onDelete }: any) {

  return (
    <tr className="border-b hover:bg-muted/50 transition">
      <td className="px-4 py-3 font-medium">{product.namaProduk}</td>
      <td className="px-4 py-3">Rp {product.hargaJualEcer?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaJualGrosir?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaBeliSm?.toLocaleString()}</td>
      <td className="px-4 py-3">Rp {product.hargaBeliSales?.toLocaleString()}</td>
      <td className="px-4 py-3">{product.category}</td>
      <td className="px-4 py-3 text-center">{product.qty}</td>
      <td className="px-4 py-3 text-center">
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
