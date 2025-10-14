import { useState, useEffect, useMemo } from 'react';
import { exportToCsv } from '@/lib/utils';

interface Product {
  id: number;
  namaProduk: string;
  hargaJualEcer: number;
  hargaJualGrosir: number;
  hargaBeliSm: number;
  hargaBeliSales: number;
  category: string;
  qty: number;
  status: string;
}

export function useProductFilters(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // Removed pagination logic; handle externally

  const categories = useMemo(() => {
    const all = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(all));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category ? p.category === category : true;
      const name = (p.namaProduk || '').toString().toLowerCase();
      const matchSearch = name.includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, searchTerm, category]);

  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;
    const arr = [...filteredProducts];
    arr.sort((a, b) => {
      const va = a[sortBy as keyof Product] ?? '';
      const vb = b[sortBy as keyof Product] ?? '';
      const na = Number(va);
      const nb = Number(vb);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return sortDir === 'asc' ? na - nb : nb - na;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredProducts, sortBy, sortDir]);

  // Pagination removed; handle externally

  const handleExport = () => {
    const toExport = sortedProducts.map((p) => ({
      NamaProduk: p.namaProduk,
      HargaJualEcer: p.hargaJualEcer,
      HargaJualGrosir: p.hargaJualGrosir,
      HargaBeliSM: p.hargaBeliSm,
      HargaBeliSales: p.hargaBeliSales,
      Category: p.category,
      Qty: p.qty,
      Status: p.status,
    }));
    exportToCsv(`product-export-${new Date().toISOString().slice(0, 10)}.csv`, toExport);
  };

  return {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    categories,
    filteredProducts,
    sortedProducts,
    handleExport,
  };
}
