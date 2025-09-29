import type { Product } from '@/schemas/product.schema';
import api from '@/utils/api';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProducts = async (filters?: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters || {});
      if (!filters) {
        searchParams.forEach((value, key) => {
          if (!params.has(key)) {
            params.set(key, value);
          }
        });
      }
      const response = await api.get(`/product?${params.toString()}`);
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
  }, [searchParams]);

  const refetch = (filters: Record<string, string>) => {
    setSearchParams(filters);
  };

  return { products, loading, error, refetch };
};