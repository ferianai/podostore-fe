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
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / perPage));
  const paginatedProducts = sortedProducts.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, sortBy, sortDir]);

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
    page,
    setPage,
    perPage,
    categories,
    filteredProducts,
    sortedProducts,
    paginatedProducts,
    totalPages,
    handleExport,
  };
}
