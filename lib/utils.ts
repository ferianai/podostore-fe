import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export function formatCurrency(value: number | string | null | undefined) {
  if (value == null || value === "") return "-";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString("id-ID");
}

/** export array of objects to CSV and download */
export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows || !rows.length) {
    const blob = new Blob([""], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    return;
  }

  // create header from keys (preserve order you prefer)
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","), // header
    ...rows.map((row) =>
      keys
        .map((k) => {
          const cell = row[k] ?? "";
          const cellStr = typeof cell === "string" ? cell : String(cell);
          // escape quotes
          return `"${cellStr.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
