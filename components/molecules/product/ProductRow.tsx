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
  index: number;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, product: Omit<Product, "id">) => void;
}

export default function ProductRow({
  product,
  index,
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

  const renderCell = (
    field: keyof Product,
    isCurrency = false,
    align: "left" | "center" | "right" = "left",
    isSticky = false
  ) => {
    const value = currentProduct[field];
    const baseClasses = `px-4 py-2 text-${align} cursor-pointer hover:bg-muted/40 whitespace-nowrap`;
    const stickyClasses = isSticky
      ? "sticky left-[3rem] z-20 bg-white font-medium border-r border-border shadow-sm"
      : "";

    if (editingField === field) {
      return (
        <td className={`${baseClasses} ${stickyClasses}`}>
          <input
            type={typeof value === "number" ? "number" : "text"}
            className="border rounded-md py-1 w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={tempValue}
            autoFocus
            onChange={(e) =>
              setTempValue(
                typeof value === "number"
                  ? Number(e.target.value)
                  : e.target.value
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
        className={`${baseClasses} ${stickyClasses}`}
        onClick={(e) => {
          e.stopPropagation();
          handleEditInline(field, value);
        }}
      >
        {isCurrency ? `Rp ${Number(value).toLocaleString()}` : value}
      </td>
    );
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      {/* Nomor urut global */}
      <td
        className="px-3 py-2 text-center sticky left-0 z-30 bg-white border-r border-gray-100 font-medium"
        style={{ boxShadow: "2px 0 3px rgba(0,0,0,0.05)" }}
      >
        {index + 1}
      </td>

      {renderCell("namaProduk", false, "left", true)}
      {renderCell("hargaBeliSm", true)}
      {renderCell("hargaBeliSales", true)}
      {renderCell("hargaJualEcer", true)}
      {renderCell("hargaJualDus", true)}
      {renderCell("kategori")}
      {renderCell("isi", false, "center")}
      {renderCell("persenLabaEcer", false, "center")}
      {renderCell("persenLabaDus", false, "center")}

      <td className="px-4 py-1 flex items-center gap-2 justify-end text-muted-foreground min-w-[100px]">
        {saving ? (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        ) : (
          <>
            <Edit
              size={16}
              className="cursor-pointer hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
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
