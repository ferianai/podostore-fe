// hooks/useProductData.ts
import { useState, useEffect, useCallback } from 'react';

export interface Product {
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

interface AirtableRecord {
  id: string;
  fields: Omit<Product, 'id'>;
}

interface AirtableResponse {
  records: AirtableRecord[];
}

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');

      const data: AirtableResponse = await res.json();
      const mapped = data.records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
      setProducts(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sanitizeProductInput = (product: Omit<Product, 'id'>): Omit<Product, 'id'> => ({
    ...product,
    hargaBeliSm: Number(product.hargaBeliSm),
    hargaBeliSales: Number(product.hargaBeliSales),
    hargaJualEcer: Number(product.hargaJualEcer),
    hargaJualDus: Number(product.hargaJualDus),
    isi: Number(product.isi),
    hargaBeliPcs: Number(product.hargaBeliPcs),
    persenLabaEcer: Number(product.persenLabaEcer),
    labaDus: Number(product.labaDus),
  });

  const handleAddProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      const sanitized = sanitizeProductInput(product);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
      });
      if (!res.ok) throw new Error('Failed to add product');

      const newRecord: AirtableRecord = await res.json();
      setProducts((prev) => [...prev, { id: newRecord.id, ...newRecord.fields }]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  }, []);

  const handleUpdateProduct = useCallback(async (id: string, product: Omit<Product, 'id'>) => {
    try {
      const sanitized = sanitizeProductInput(product);
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sanitized }),
      });
      if (!res.ok) throw new Error('Failed to update product');

      const updatedRecord: AirtableRecord = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { id: updatedRecord.id, ...updatedRecord.fields } : p))
      );
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  }, []);

  return {
    products,
    loading,
    error,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    loadData,
  };
}
