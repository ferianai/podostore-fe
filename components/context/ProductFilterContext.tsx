"use client";

import { createContext, useContext, useState } from "react";

interface ProductFilterContextType {
    search: string;
    setSearch: (value: string) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function ProductFilterProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");

    return (
        <ProductFilterContext.Provider value={{ search, setSearch }}>
        {children}
        </ProductFilterContext.Provider>
    );
}

export function useProductFilter() {
    const context = useContext(ProductFilterContext);
    if (!context) {
        throw new Error("useProductFilter must be used within a ProductFilterProvider");
    }
    return context;
}
