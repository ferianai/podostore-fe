"use client";

import { Search, Moon, Sun } from "lucide-react";

export default function ProductTableToolbar({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  categories,
  onExport,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  darkMode,
  setDarkMode,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: string[];
  onExport: () => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  sortDir: "asc" | "desc";
  setSortDir: (d: "asc" | "desc") => void;
  darkMode: boolean;
  setDarkMode: (b: boolean) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex gap-3 w-full sm:w-1/2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-border rounded-lg pl-9 pr-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 bg-background"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-border rounded-lg px-2 py-1 bg-background"
        >
          <option value="">Sort by</option>
          <option value="namaProduk">Nama</option>
          <option value="hargaJualEcer">Harga Ecer</option>
          <option value="qty">Qty</option>
        </select>

        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="border border-border rounded-lg px-2 py-1"
          title="Toggle sort direction"
        >
          {sortDir === "asc" ? "Asc" : "Desc"}
        </button>

        <button
          onClick={onExport}
          className="bg-white border border-border px-3 py-1 rounded-lg hover:bg-muted"
        >
          Export CSV
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg border border-border"
          title="Toggle theme"
        >
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </div>
  );
}
