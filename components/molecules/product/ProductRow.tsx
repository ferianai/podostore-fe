"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { calculateHargaBeliPcs } from "@/lib/productCalculations"; 
import { updateProduct } from "@/lib/products-api";

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

interface ProductRowProps {
  product: Product;
  index: number;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({
  product,
  index,
  onEdit,
  onDelete,
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

    // 🔁 Perhitungan otomatis hargaBeliPcs
    if (field === "hargaBeliSm" || field === "isi") {
      const hargaBeliSm =
        field === "hargaBeliSm" ? Number(tempValue) : currentProduct.hargaBeliSm;
      const isi =
        field === "isi" ? Number(tempValue) : currentProduct.isi;

      const hargaBeliPcs = calculateHargaBeliPcs(hargaBeliSm, isi);
      updated.hargaBeliPcs = hargaBeliPcs;
    }

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

  const renderCell = (
    field: keyof Product,
    isCurrency = false,
    align: "left" | "center" | "right" = "left",
    isSticky = false,
    editable = true
  ) => {
    const value = currentProduct[field];
    const baseClasses = `px-2 py-1 text-${align} cursor-pointer hover:bg-muted/40 whitespace-nowrap`;
    const stickyClasses = isSticky
      ? "sticky left-[3rem] z-20 bg-white font-medium shadow-sm"
      : "";

    if (editingField === field) {
      return (
        <td className={`${baseClasses} ${stickyClasses}`}>
          <input
            type={typeof value === "number" ? "number" : "text"}
            className="py-1 w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
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
          if (!editable) return;
          handleEditInline(field, value);
        }}
      >
        {isCurrency ? `${Number(value).toLocaleString()}` : value}
      </td>
    );
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      {/* Nomor urut */}
      <td className="py-1 text-center sticky left-0 bg-white border-r border-border shadow-sm">
        {index + 1}
      </td>

      {renderCell("namaProduk", false, "left", false, false)}
      {renderCell("hargaBeliSm", true, "right")}
      {renderCell("hargaBeliPcs", true, "right", false, false)}
      {renderCell("isi", false, "right")}
      {renderCell("hargaJualEcer", true, "right", false, false)}
      {renderCell("hargaJualDus", true, "right", false, false)}
      {renderCell("hargaBeliSales", true, "right", false, false)}
      {renderCell("persenLabaEcer", false, "right")}
      {renderCell("labaDus", false, "right")}
      {renderCell("kategori")}

      <td className="px-2 py-1 flex items-center gap-2 justify-end text-muted-foreground min-w-[100px]">
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
