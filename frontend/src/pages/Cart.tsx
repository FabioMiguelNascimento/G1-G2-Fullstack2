

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthContext from '@/hooks/useAthContext';
import useFetchUserCart from '@/hooks/useFetchUserCart';

// Tipo para o item do carrinho baseado na estrutura real
interface CartProduct {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
  };
  quantity: number;
  total: number;
}

// Tipo para o carrinho completo
interface Cart {
  products: CartProduct[];
  totalCart: number;
}

export default function Cart() {
  const { user } = useAuthContext();
  const { cart, loading, error } = useFetchUserCart(user?.id || null);

  // Fazer cast do tipo para a estrutura real
  const cartData = cart as unknown as Cart | null;

  // Calcular valores derivados do carrinho
  const items = (cartData && Array.isArray(cartData.products)) ? cartData.products : [];
  const total = cartData?.totalCart || 0;
  const itemsCount = items.reduce((sum: number, item: CartProduct) => sum + item.quantity, 0);

  // Se o usuário não estiver logado
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Você precisa estar logado para ver seu carrinho</p>
            <Button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
        <div className="text-center py-8">
          <p>Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700 mb-4">Erro ao carregar carrinho: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => window.location.href = '/products'}>
              Continuar comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Carrinho ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Lista de itens do carrinho */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item: CartProduct) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {item.product.image && (
                    <img 
                      src={item.product.image} 
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.title}</h3>
                    <p className="text-gray-600">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Preço unitário: R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      R$ {item.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo do carrinho */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Finalizar Compra
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/products'}
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}