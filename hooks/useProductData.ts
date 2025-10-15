import { useState, useEffect } from 'react';
import { getProductList, addProduct, updateProduct, deleteProduct } from '@/lib/sheetyApi';

interface Product {
  id: number;
  namaProduk: string;
  hargaJualEcer: number;
  hargaJualGrosir: number;
  hargaBeliSm: number;
  hargaBeliSales: number;
  kategori: string;
  isi: number;
}

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProductList();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    loadData,
  };
}
