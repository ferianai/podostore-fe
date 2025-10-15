"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { updateProduct } from "@/lib/airtableApi"; // pastikan path sesuai

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

interface ProductRowProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | number>("");
  const [saving, setSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const handleEdit = (field: keyof Product, value: string | number) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = async (field: keyof Product) => {
    setSaving(true);
    const updated = { ...currentProduct, [field]: tempValue };
    try {
      const { id, ...productData } = updated;
      await updateProduct(id, productData);
      setCurrentProduct(updated);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const renderCell = (field: keyof Product, isCurrency = false, align = "left") => {
    const value = currentProduct[field];

    // Jika sedang mengedit field ini
    if (editingField === field) {
      return (
        <td className={`px-4 py-3 text-${align}`}>
          <input
            type={typeof value === "number" ? "number" : "text"}
            className="border rounded-md px-2 py-1 w-full text-sm"
            value={tempValue}
            autoFocus
            onChange={(e) =>
              setTempValue(
                typeof value === "number" ? Number(e.target.value) : e.target.value
              )
            }
            onBlur={() => handleSave(field)}
            onKeyDown={(e) => e.key === "Enter" && handleSave(field)}
          />
        </td>
      );
    }

    // Jika tidak sedang mengedit
    return (
      <td
        className={`px-4 py-3 text-${align} cursor-pointer hover:bg-muted/40`}
        onClick={() => handleEdit(field, value)}
      >
        {isCurrency ? `Rp ${Number(value).toLocaleString()}` : value}
      </td>
    );
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition">
      {renderCell("namaProduk")}
      {renderCell("hargaBeliSm", true)}
      {renderCell("hargaBeliSales", true)}
      {renderCell("hargaJualEcer", true)}
      {renderCell("hargaJualDus", true)}
      {renderCell("kategori")}
      {renderCell("isi", false, "center")}
      {renderCell("persenLabaEcer", false, "center")}
      {renderCell("persenLabaDus", false, "center")}
      <td className="px-4 py-3 flex items-center gap-2 justify-end text-muted-foreground">
        {saving ? (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        ) : (
          <>
            <Edit
              size={16}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => onEdit(currentProduct)}
            />
            <Trash2
              size={16}
              className="cursor-pointer hover:text-red-600"
              onClick={() => onDelete(currentProduct.id)}
            />
          </>
        )}
      </td>
    </tr>
  );
}
