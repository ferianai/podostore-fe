// components/molecules/product/ProductRow.tsx
"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";

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
  onUpdate: (id: string, product: Omit<Product, "id">) => void;
}

export default function ProductRow({
  product,
  onEdit,
  onDelete,
  onUpdate,
}: ProductRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | number>("");
  const [saving, setSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const handleEditInline = (field: keyof Product, value: string | number) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = async (field: keyof Product) => {
    setSaving(true);
    const updated = { ...currentProduct, [field]: tempValue };
    try {
      const { id, ...productData } = updated;
      await onUpdate(id, productData);
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

    return (
      <td
        className={`px-4 py-3 text-${align} cursor-pointer hover:bg-muted/40`}
        onClick={(e) => {
          e.stopPropagation(); // mencegah event sampai ke icon edit/modal
          handleEditInline(field, value);
        }}
      >
        {isCurrency ? `Rp ${Number(value).toLocaleString()}` : value}
      </td>
    );
  };

  return (
    <tr
      className="border-b hover:bg-muted/50 transition"
      onClick={(e) => e.stopPropagation()} // cegah bubble ke parent
    >
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
              onClick={(e) => {
                e.stopPropagation(); // hanya buka modal edit
                onEdit(currentProduct);
              }}
            />
            <Trash2
              size={16}
              className="cursor-pointer hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(currentProduct.id);
              }}
            />
          </>
        )}
      </td>
    </tr>
  );
}
