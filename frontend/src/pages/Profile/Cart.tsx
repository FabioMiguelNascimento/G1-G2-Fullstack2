
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthContext from '@/hooks/useAthContext';
import useCartActions from '@/hooks/useCartActions';
import useCheckout from '@/hooks/useCheckout';
import useFetchUserCart from '@/hooks/useFetchUserCart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const [cartTrigger, setCartTrigger] = useState(0);
  const { cart, loading, error } = useFetchUserCart(user?.id || null, cartTrigger);
  const { updateQuantity, removeFromCart, loading: actionLoading } = useCartActions();
  const { checkout, loading: checkoutLoading, error: checkoutError } = useCheckout();
  const navigate = useNavigate();

  // Estado local para o carrinho (para atualização em tempo real)
  const [localCart, setLocalCart] = useState<Cart | null>(null);

  // Estados para o modal de checkout
  const [checkoutPassword, setCheckoutPassword] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  // Fazer cast do tipo para a estrutura real
  const cartData = cart as unknown as Cart | null;

  // Usar carrinho local se disponível, senão usar o do servidor
  const currentCart = localCart || cartData;

  // Sincronizar carrinho local com dados do servidor quando carregarem
  useEffect(() => {
    if (cartData && !localCart) {
      setLocalCart(cartData);
    }
  }, [cartData, localCart]);

  // Calcular valores derivados do carrinho
  const items = (currentCart && Array.isArray(currentCart.products)) ? currentCart.products : [];
  const total = currentCart?.totalCart || 0;
  const itemsCount = items.reduce((sum: number, item: CartProduct) => sum + item.quantity, 0);

  // Função para atualizar quantidade localmente
  const updateLocalQuantity = (productId: string, newQuantity: number) => {
    if (!currentCart) return;

    const updatedProducts = currentCart.products.map(item => {
      if (item.product.id === productId) {
        const newTotal = item.product.price * newQuantity;
        return { ...item, quantity: newQuantity, total: newTotal };
      }
      return item;
    });

    const newTotalCart = updatedProducts.reduce((sum, item) => sum + item.total, 0);

    setLocalCart({
      products: updatedProducts,
      totalCart: newTotalCart
    });
  };

  // Função para remover produto localmente
  const removeLocalProduct = (productId: string) => {
    if (!currentCart) return;

    const updatedProducts = currentCart.products.filter(item => item.product.id !== productId);
    const newTotalCart = updatedProducts.reduce((sum, item) => sum + item.total, 0);

    setLocalCart({
      products: updatedProducts,
      totalCart: newTotalCart
    });
  };

  // Função para lidar com o checkout
  const handleCheckout = async () => {
    if (!checkoutPassword.trim()) {
      return;
    }

    const result = await checkout(checkoutPassword);

    if (result) {
      setCheckoutSuccess(result.data);
      setLocalCart({ products: [], totalCart: 0 }); // Limpar carrinho local
      setCartTrigger(prev => prev + 1); // Forçar recarregamento do carrinho
      setCheckoutPassword("");
      setCheckoutModalOpen(false);
    }
  };

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
                <div className="flex items-start gap-4">
                  {item.product.image && (
                    <img 
                      src={item.product.image} 
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Preço unitário: R$ {item.product.price.toFixed(2)}
                    </p>
                    
                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Quantidade:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const newQuantity = item.quantity - 1;
                            if (newQuantity > 0) {
                              // Atualizar localmente primeiro (otimistic update)
                              updateLocalQuantity(item.product.id, newQuantity);
                              
                              // Tentar atualizar no servidor
                              const success = await updateQuantity(item.product.id, newQuantity);
                              
                              // Se falhou, reverter mudança local
                              if (!success) {
                                updateLocalQuantity(item.product.id, item.quantity);
                              }
                            }
                          }}
                          disabled={item.quantity <= 1 || actionLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={async (e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            if (newQuantity > 0 && newQuantity !== item.quantity) {
                              const originalQuantity = item.quantity;
                              
                              // Atualizar localmente primeiro
                              updateLocalQuantity(item.product.id, newQuantity);
                              
                              // Tentar atualizar no servidor
                              const success = await updateQuantity(item.product.id, newQuantity);
                              
                              // Se falhou, reverter mudança local
                              if (!success) {
                                updateLocalQuantity(item.product.id, originalQuantity);
                              }
                            }
                          }}
                          className="w-16 text-center"
                          disabled={actionLoading}
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const newQuantity = item.quantity + 1;
                            
                            // Atualizar localmente primeiro
                            updateLocalQuantity(item.product.id, newQuantity);
                            
                            // Tentar atualizar no servidor
                            const success = await updateQuantity(item.product.id, newQuantity);
                            
                            // Se falhou, reverter mudança local
                            if (!success) {
                              updateLocalQuantity(item.product.id, item.quantity);
                            }
                          }}
                          disabled={actionLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Botão Remover com Modal */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={actionLoading}
                          className="text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover produto do carrinho</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover "{item.product.title}" do carrinho? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              // Salvar referência do produto para possível reverter
                              const removedItem = { ...item };
                              
                              // Remover localmente primeiro
                              removeLocalProduct(item.product.id);
                              
                              // Tentar remover no servidor
                              const success = await removeFromCart(item.product.id);
                              
                              // Se falhou, restaurar o produto localmente
                              if (!success && currentCart) {
                                setLocalCart({
                                  ...currentCart,
                                  products: [...currentCart.products, removedItem],
                                  totalCart: currentCart.totalCart + removedItem.total
                                });
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sim, remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      R$ {item.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × R$ {item.product.price.toFixed(2)}
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
              <AlertDialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" size="lg" disabled={items.length === 0}>
                    Finalizar Compra
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finalizar Compra</AlertDialogTitle>
                    <AlertDialogDescription>
                      Digite sua senha para confirmar a compra de{" "}
                      {itemsCount} {itemsCount === 1 ? "item" : "itens"}{" "}
                      no valor total de R$ {total.toFixed(2)}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="checkout-password">Senha</Label>
                    <Input
                      id="checkout-password"
                      type="password"
                      value={checkoutPassword}
                      onChange={(e) => setCheckoutPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      className="mt-2"
                    />
                    {checkoutError && (
                      <p className="text-red-600 text-sm mt-2">
                        {checkoutError}
                      </p>
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setCheckoutPassword("");
                        setCheckoutModalOpen(false);
                      }}
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutLoading || !checkoutPassword.trim()}
                    >
                      {checkoutLoading ? "Processando..." : "Confirmar Compra"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link to="/products">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Continuar Comprando
              </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <AlertDialog open={!!checkoutSuccess} onOpenChange={() => setCheckoutSuccess(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Compra Realizada com Sucesso! 🎉</AlertDialogTitle>
            <AlertDialogDescription>
              Seu pedido foi criado com sucesso. Você pode acompanhar seus pedidos na seção "Meus Pedidos".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID do Pedido:</strong>{" "}
                {checkoutSuccess?.orderId}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {checkoutSuccess
                  ? new Date(checkoutSuccess.createdAt).toLocaleString("pt-BR")
                  : ""}
              </p>
              <p>
                <strong>Produtos:</strong>{" "}
                {checkoutSuccess?.productsCount}
              </p>
            </div>
          </div>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogAction
              onClick={() => {
                setCheckoutSuccess(null);
                navigate("/account/orders");
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ver Meus Pedidos
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => setCheckoutSuccess(null)}
            >
              Continuar Comprando
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}