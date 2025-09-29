import useAuthContext from '@/hooks/useAthContext';
import api from '@/utils/api';
import { useState } from 'react';

interface AddToCartData {
  productId: string;
  quantity?: number;
}

interface AddToCartResponse {
  code: number;
  message: string;
  data?: {
    cartId?: string;
    productId?: string;
    quantity?: number;
  };
}

interface UseAddToCartReturn {
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export default function useAddToCart(): UseAddToCartReturn {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    // Verificar se usuário está logado
    if (!user) {
      setError('Você precisa estar logado para adicionar produtos ao carrinho');
      return false;
    }

    // Validar dados
    if (!productId || quantity <= 0) {
      setError('Dados inválidos para adicionar ao carrinho');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const data: AddToCartData = {
        productId,
        quantity
      };

      const response = await api.post<AddToCartResponse>('/cart', data);

      if (response.data.code === 200 || response.data.code === 201) {
        setSuccess(true);
        setError(null);
        
        return true;
      } else {
        throw new Error(response.data.message || 'Erro ao adicionar produto ao carrinho');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao adicionar produto ao carrinho');
      }
      
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToCart,
    loading,
    error,
    success,
  };
}
