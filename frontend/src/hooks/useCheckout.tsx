import api from "@/utils/api";
import { useState } from "react";

interface CheckoutResponse {
  code: number;
  message: string;
  data: {
    orderId: string;
    orderName: string;
    createdAt: string;
    productsCount: number;
  };
}

export default function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (password: string): Promise<CheckoutResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<CheckoutResponse>("/checkout", {
        password
      });

      return response.data;
    } catch (err: unknown) {
      let errorMessage = "Erro ao finalizar compra";

      if (err instanceof Error && typeof err.message === "string" && err.message.length > 0) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        const maybeErr = err as { response?: { data?: { message?: unknown } }; message?: unknown };
        const respMsg = maybeErr.response?.data?.message;
        if (typeof respMsg === "string" && respMsg.length > 0) {
          errorMessage = respMsg;
        } else if (typeof maybeErr.message === "string" && maybeErr.message.length > 0) {
          errorMessage = maybeErr.message;
        }
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}