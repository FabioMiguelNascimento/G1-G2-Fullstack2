import type { CartItem } from "@/types/cart.type";
import api from "@/utils/api";
import { useEffect, useState } from "react";

interface GetCartResponse {
  code: number,
  message: string,
  data: CartItem[]
}

export default function useFetchUserCart(userId: string | null) {
  console.log('🛒 HOOK useFetchUserCart chamado com userId:', userId);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCart(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<GetCartResponse>(`/cart`, {
          signal: controller.signal,
        });
        setCart(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === "CanceledError" || err.name === "AbortError") return;
          console.error(err);
          setError(err?.message ?? "Erro ao carregar carrinho");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    return () => controller.abort();
  }, [userId]);

  return { cart, loading, error };
}