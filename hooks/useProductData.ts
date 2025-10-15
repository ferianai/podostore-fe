import { useState, useEffect, useCallback } from 'react';
import { getProductList, addProduct, updateProduct, deleteProduct } from '@/lib/airtableApi';

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

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductList();
      setProducts(data.records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await addProduct(product);
      setProducts(prev => [...prev, newProduct.fields]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  }, []);

  const handleUpdateProduct = useCallback(async (id: string, product: Omit<Product, 'id'>) => {
    try {
      const updatedProduct = await updateProduct(id, product);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct.fields : p));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
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
