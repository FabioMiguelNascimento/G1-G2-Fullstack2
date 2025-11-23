import api from "@/utils/api";
import { useEffect, useState } from "react";

interface OrderProduct {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  products: OrderProduct[];
  totalValue: number;
}

interface GetOrdersResponse {
  code: number;
  message: string;
  data: Order[];
}

export default function useFetchUserOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<GetOrdersResponse>(`/order`, {
          signal: controller.signal,
        });
        setOrders(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === "CanceledError" || err.name === "AbortError") return;
          console.error(err);
          setError(err?.message ?? "Erro ao carregar pedidos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [userId]);

  return { orders, loading, error };
}