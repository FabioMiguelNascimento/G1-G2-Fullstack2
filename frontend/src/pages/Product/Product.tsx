import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetchProduct from "@/hooks/useFetchProduct";
import buildPrice from "@/utils/buildPrice";
import buildStars from "@/utils/buildStars";
import {
  BadgeCheckIcon,
  CheckCircle,
  Codesandbox,
  Heart,
  HeartCrack,
  RefreshCw,
  Share,
  ShieldCheck,
  Star,
  TextIcon,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCartContext } from "@/contexts/CartContext";
import useAddToCart from "@/hooks/useAddToCart";

const tagIconMap: Record<string, any> = {
  destaque: BadgeCheckIcon,
  bestseller: Star,
  fretegratis: Truck,
};

export default function Product() {
  const { id } = useParams();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { product } = useFetchProduct(id ?? null);
  const { addToCart, loading } = useAddToCart();
  const { refetchCart } = useCartContext();

  if (!product) {
    return (
      <div className="flex gap-2 text-4xl h-full items-center justify-center">
        <HeartCrack className="h-16 w-16" /> Produto nao encontrado
      </div>
    );
  }

  const buildTags = () => {
    const badges = [];

    if (product.isNew) {
      badges.push(
        <Badge key="new" className="bg-blue-400 text-white font-mono">
          <BadgeCheckIcon className="mr-1 h-4 w-4" /> Novo Produto
        </Badge>
      );
    }

    const conditionNames: Record<string, string> = {
      PREMIUM: "Premium",
      NEW: "Novo",
      REFURBISHED: "Reformado",
      USED: "Usado",
      DAMAGED: "Danificado",
    };

    const conditionName = conditionNames[product.condition ?? ""];
    if (conditionName) {
      badges.push(
        <Badge key="condition" variant="outline" className="text-black">
          {conditionName}
        </Badge>
      );
    }

    return badges;
  };

  const buildPolicies = () => {
    const policyConfig: Record<string, { icon: any; text: string }> = {
      FREE: { icon: Truck, text: "Frete Grátis" },
      PAID: { icon: Truck, text: "Frete Pago" },
      EXPRESS: { icon: Truck, text: "Entrega Expressa" },

      MANUFACTURER: { icon: ShieldCheck, text: "Garantia do Fabricante" },
      EXTENDED: { icon: ShieldCheck, text: "Garantia Estendida" },
      REFURBISHED: { icon: RefreshCw, text: "Garantia para Produtos Reformados" },

      DAYS_30: { icon: CheckCircle, text: "Devolução em 30 dias" },
      DAYS_60: { icon: CheckCircle, text: "Devolução em 60 dias" },
      NO_RETURN: { icon: CheckCircle, text: "Sem Devolução" },
    };

    const policyKeys = [
      product.freeShipping,
      product.warranty,
      product.returnPolicy,
    ];

    return policyKeys
      .map((key, index) => {
        if (!key) return null;
        const policy = policyConfig[key as string];
        if (!policy) return null;

        const Icon = policy.icon;
        return (
          <div key={index} className="flex items-center gap-2 flex-col">
            <Icon className="text-blue-500" />
            <span className="text-sm font-medium text-primary">{policy.text}</span>
          </div>
        );
      })
      .filter(Boolean);
  };

  const buildColors = () => {
    const colorsArr = product.colors ?? [];
    const colors = colorsArr.map((color, index) => (
      <div
        key={index}
        className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-200 data-[active='true']:border-4 data-[active='true']:border-blue-500"
        data-active={selectedColorIndex === index ? "true" : "false"}
        style={{ backgroundColor: color }}
        onClick={() => handleSelectColor(index)}
      ></div>
    ));

    return colors;
  };

  const handleSelectColor = (index: number) => {
    setSelectedColorIndex(index);
  };  

  return (
    <>
      {product && product ? (
        <div className="flex flex-col gap-10 ">
          <div className="flex gap-10">
            <section className="flex gap-4 flex-col w-2/5">
              <Card className="w-full h-104 flex items-center justify-center   ">
                <Codesandbox width={64} height={64} />
              </Card>
              <div className="flex flex-row gap-4 justify-center items-center">
                {product.tags &&
                  product.tags.map((tagStr, index) => {
                    const TagIcon = tagIconMap[tagStr] ?? Codesandbox;
                    return (
                      <Card
                        key={index}
                        className="w-32 h-32 flex items-center justify-center"
                      >
                        <CardTitle>
                          <TagIcon />
                        </CardTitle>
                        <CardDescription className="font-bold">
                          {tagStr}
                        </CardDescription>
                      </Card>
                    );
                  })}
              </div>
            </section>
            <section className="flex gap-6 flex-col w-3/5">
              <div className="flex flex-row gap-2">{buildTags()}</div>
              <div className="text-sm flex gap-1 flex-col">
                <h1 className="font-bold text-3xl text-gray-800 tracking-tight">
                  {product.title}
                </h1>
                <div className="flex gap-2">
                  {buildStars(product)}{" "}
                  <span className="text-muted-foreground">
                    ({product.rating})
                  </span>
                </div>
              </div>
              {buildPrice(product)}
              <Card className="flex flex-col gap-4">
                <CardHeader className="justify-start items-start mb-5">
                  <CardTitle className="text-lg font-bold flex gap-2 items-center justify-start">
                    <CheckCircle className="text-blue-500" />
                    <h2>Principais Características</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-5">
                    {(product.mainFeatures ?? []).map((item, index) => (
                      <div key={index} className="flex">
                        <span className="text-muted-foreground">{item.name}: </span>
                        <span className="font-bold ml-auto overflow-hidden text-ellipsis whitespace-nowrap">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {(product.colors ?? []).length > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg">Cores Disponíveis</h2>
                  <div className="flex gap-4">{buildColors()}</div>
                </div>
              )}
              
              {/* Seletor de Quantidade */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity" className="font-bold text-lg">Quantidade</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(value, 99)));
                    }}
                    className="w-20 text-center"
                    disabled={!product.inStock}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    disabled={quantity >= 99 || !product.inStock}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.inStock ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 flex-col">
                <div className="flex gap-2 ">
                  <Button
                    className="grow-1 shrink-0 font-bold"
                    size="lg"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Comprar Agora" : "Indisponível"}
                  </Button>
                  <Button className="" variant="outline">
                    <Heart />
                  </Button>
                  <Button className="" variant="outline">
                    <Share />
                  </Button>
                </div>
                <Button
                  className=" font-bold"
                  variant="outline"
                  size="lg"
                  onClick={async () => {
                    const success = await addToCart(product.id, quantity);

                    if (success) {
                      console.log(`${quantity} produto(s) adicionado(s) ao carrinho!`);
                      refetchCart();
                      // Opcional: Resetar quantidade para 1 após adicionar
                      // setQuantity(1);
                    }
                  }}
                  disabled={!product.inStock || loading}
                >
                  {loading 
                    ? "Adicionando..." 
                    : product.inStock 
                      ? `Adicionar ${quantity} ao Carrinho` 
                      : "Indisponível"
                  }
                </Button>
              </div>
              <div className="w-full h-[1px] bg-border"></div>
              <div className="flex self-center justify-center items-center gap-4">
                {buildPolicies()}
              </div>
            </section>
          </div>
          <div className="flex gap-10 h-full">
            <Card className="w-2/5 h-full flex flex-col">
              <CardHeader className="justify-start items-start mb-5">
                <CardTitle className="text-lg font-bold flex gap-2 items-center justify-start">
                  <BadgeCheckIcon className="text-blue-500" />
                  <h2>Especificações</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {(product.specifications ?? []).map((item, index) => (
                    <div key={index} className="flex">
                      <span className="text-muted-foreground">{item.name}: </span>
                      <span className="font-bold ml-auto overflow-hidden text-ellipsis whitespace-nowrap">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="w-3/5 h-full flex flex-col">
              <CardHeader className="justify-start items-start mb-5">
                <CardTitle className="text-lg font-bold flex gap-2 items-center justify-start">
                  <TextIcon className="text-primary" />
                  <h2>Descrição</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-justify">{product.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 text-4xl h-full items-center justify-center">
          <HeartCrack className="h-16 w-16" /> Produto nao encontrado
        </div>
      )}
    </>
  );
}
