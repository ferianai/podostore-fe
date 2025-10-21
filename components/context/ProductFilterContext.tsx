// components/context/ProductFilterContext.tsx
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

// ✅ Enum agar tidak typo string
export enum SortOrder {
  ASC = "asc",
  DESC = "desc"
}

interface ProductFilterContextType {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
  categories: string[];
  loadingCategories: boolean;
  error: string | null;
}

// ✅ Context dengan type aman
const ProductFilterContext = createContext<ProductFilterContextType | undefined>(
  undefined
);

export function ProductFilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Categories dengan caching + abort + retry
  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setError(null);

        // ✅ Cek cache terlebih dahulu
        const cache = sessionStorage.getItem("product_categories");
        if (cache) {
          setCategories(JSON.parse(cache));
          setLoadingCategories(false);
          return;
        }

        const res = await fetch("/api/category", {
          signal: abortController.signal,
          cache: "no-store"
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();

        if (data.records) {
          const extractedCategories: string[] = data.records
            .map((r: { Nama_Kategori?: string }) => r.Nama_Kategori || "")
            .filter((name: string): name is string => Boolean(name));

          const sorted = Array.from(new Set(extractedCategories)).sort((a, b) =>
            a.localeCompare(b)
          );

          setCategories(sorted);
          sessionStorage.setItem("product_categories", JSON.stringify(sorted));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch kategori dibatalkan");
        } else {
          console.error("Failed to fetch categories", err);
          setError("Gagal memuat kategori. Silakan coba lagi.");
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();

    // ✅ Cleanup untuk abort fetch
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <ProductFilterContext.Provider
      value={{
        search,
        setSearch,
        category,
        setCategory,
        sortOrder,
        setSortOrder,
        categories,
        loadingCategories,
        error
      }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}

// ✅ Custom Hook
export function useProductFilter() {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error("useProductFilter must be used within ProductFilterProvider");
  }
  return context;
}
