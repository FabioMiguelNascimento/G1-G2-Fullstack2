import { useCartContext } from '@/contexts/CartContext';
import useAuthContext from '@/hooks/useAthContext';
import api from '@/utils/api';
import { useState } from 'react';

interface UpdateCartData {
  productId: string;
  quantity: number;
}

interface CartActionResponse {
  code: number;
  message: string;
  data?: {
    cartId?: string;
    productId?: string;
    quantity?: number;
  };
}

interface UseCartActionsReturn {
  updateQuantity: (productId: string, quantity: number, onSuccess?: () => void) => Promise<boolean>;
  removeFromCart: (productId: string, onSuccess?: () => void) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export default function useCartActions(): UseCartActionsReturn {
  const { user } = useAuthContext();
  const { refetchCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuantity = async (productId: string, quantity: number, onSuccess?: () => void): Promise<boolean> => {
    if (!user) {
      setError('Você precisa estar logado');
      return false;
    }

    if (quantity <= 0) {
      setError('Quantidade deve ser maior que zero');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const data: UpdateCartData = { productId, quantity };
      
      const response = await api.put<CartActionResponse>('/cart/', data);

      if (response.data.code === 200) {
        onSuccess?.();
        refetchCart();
        return true;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar quantidade');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao atualizar quantidade');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string, onSuccess?: () => void): Promise<boolean> => {
    if (!user) {
      setError('Você precisa estar logado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.delete<CartActionResponse>(`/cart/${productId}`);

      if (response.data.code === 200) {
        onSuccess?.();
        refetchCart();
        return true;
      } else {
        throw new Error(response.data.message || 'Erro ao remover produto');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao remover produto');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateQuantity,
    removeFromCart,
    loading,
    error,
  };
}