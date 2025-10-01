import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartContext } from "@/contexts/CartContext";
import useAuthContext from "@/hooks/useAthContext";
import useCartActions from "@/hooks/useCartActions";
import useFetchUserCart from "@/hooks/useFetchUserCart";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";

export default function CartSheet() {
  const { user } = useAuthContext();
  const { trigger } = useCartContext();
  const { cart, loading, error } = useFetchUserCart(user?.id || null, trigger);
  const {
    updateQuantity,
    removeFromCart,
    loading: actionLoading,
  } = useCartActions();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [onCancel, setOnCancel] = useState<() => void>(() => {});
  const [onContinue, setOnContinue] = useState<() => void>(() => {});

  const increaseQuantity = async (id: string, currentQuantity: number) => {
    await updateQuantity(id, currentQuantity + 1);
  };

  const decreaseQuantity = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
    currentQuantity: number
  ) => {
    if (e.ctrlKey) {
      removeProduct(id);
      return;
    }

    if (currentQuantity > 1) {
      await updateQuantity(id, currentQuantity - 1);
    } else {
      removeProduct(id);
    }
  };

  const confirmDelete = (
    title: string,
    description: string,
    onCancelCallback: () => void,
    onContinueCallback: () => void
  ) => {
    if (isDialogOpen) return;

    setDialogTitle(title);
    setDialogDescription(description);
    setOnCancel(() => onCancelCallback);
    setOnContinue(() => onContinueCallback);
    setDialogOpen(true);
  };

  const removeProduct = (id: string) => {
    confirmDelete(
      "Tem certeza que deseja excluir produto",
      "Essa ação vai excluir o produto por completo do seu carrinho",
      () => {
        setDialogOpen(false);
      },
      async () => {
        await removeFromCart(id);
        setDialogOpen(false);
      }
    );
  };

  const clearCart = () => {
    confirmDelete(
      "Tem certeza que deseja esvaziar o carrinho?",
      "Essa ação vai remover todos os produtos do seu carrinho",
      () => {
        setDialogOpen(false);
      },
      async () => {
        if (!Array.isArray(cart?.products)) return;
        for (const item of cart.products) {
          await removeFromCart(item.product.id);
        }
        setDialogOpen(false);
      }
    );
  };

  const buildProducts = () => {
    if (!Array.isArray(cart?.products)) return [];

    const products = (cart?.products || []).map((prod) => {
      const quantity = prod.quantity;

      return (
        <Card key={prod.product.id}>
          <CardHeader>
            <CardTitle>{prod.product.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <h2>Preço: R$ {prod.product.price.toFixed(2)}</h2>
            <h2>Total: R$ {prod.total.toFixed(2)}</h2>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {quantity === 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProduct(prod.product.id)}
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => decreaseQuantity(e, prod.product.id, quantity)}
                disabled={actionLoading}
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
            <span className="font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => increaseQuantity(prod.product.id, quantity)}
              disabled={actionLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      );
    });

    return products;
  };

  const hasItems = Array.isArray(cart?.products) && cart.products.length > 0;

  const totalItems = Array.isArray(cart?.products)
    ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <>
      <Sheet>
        <SheetTrigger className="cursor-pointer relative">
          <ShoppingBag />
          {totalItems > 0 && (
            <Badge className="absolute bg-green-300 text-black top-[-10px] right-[-10px] flex items-center justify-center text-xs font-bold">
              {totalItems}
            </Badge>
          )}
        </SheetTrigger>
        <SheetContent className="pb-15">
          <SheetHeader>
            <SheetTitle>Carrinho de Produtos</SheetTitle>
            <SheetDescription>
              Aqui você vê, remove e altera produtos do seu carrinho
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-scroll p-4 gap-4 flex flex-col">
            {loading ? (
              <p>Carregando carrinho...</p>
            ) : error ? (
              <p>Erro ao carregar carrinho: {error}</p>
            ) : (
              buildProducts()
            )}
          </div>
          <SheetFooter className="grid grid-cols-2 gap-4 absolute bottom-0 right-0 left-0">
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={!hasItems || actionLoading}
              onClick={clearCart}
            >
              Esvaziar
            </Button>
            <Button
              variant="default"
              className="cursor-pointer"
              disabled={!hasItems || actionLoading}
            >
              <Link to={'/payment'}>Comprar</Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={isDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        onCancel={onCancel}
        onContinue={onContinue}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
