import type { Product } from '@/schemas/product.schema';
import api from '@/utils/api';
import { useEffect, useState } from 'react';

export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/product');
      setProducts(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};