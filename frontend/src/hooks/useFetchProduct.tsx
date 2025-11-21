import type { Product } from "@/schemas/product.schema";
import api from "@/utils/api";
import { useEffect, useState } from "react";

interface GetProductResponse {
  code: number,
  message: string,
  data: Product
}

export default function useFetchProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get<GetProductResponse>(`/product/${id}`);
        setProduct(response.data.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}