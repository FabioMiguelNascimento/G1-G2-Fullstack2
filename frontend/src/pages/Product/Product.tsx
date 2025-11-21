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
import { Skeleton } from "@/components/ui/skeleton";
import useFetchProduct from "@/hooks/useFetchProduct";
import buildPrice from "@/utils/buildPrice";
import buildStars from "@/utils/buildStars";
import { parseJsonField } from "@/utils/json";
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
import { useNavigate, useParams } from "react-router-dom";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCartContext } from "@/contexts/CartContext";
import useAddToCart from "@/hooks/useAddToCart";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

const tagIconMap: Record<string, any> = {
  destaque: BadgeCheckIcon,
  bestseller: Star,
  fretegratis: Truck,
};

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <section className="w-full lg:w-3/5 order-1 lg:order-1 flex flex-col gap-6">
          <Skeleton className="w-full h-104" />
          <div className="flex flex-row gap-4 justify-center items-center">
            <Skeleton className="w-32 h-32" />
            <Skeleton className="w-32 h-32" />
            <Skeleton className="w-32 h-32" />
          </div>
        </section>

        <section className="w-full lg:w-2/5 order-2 lg:order-2 flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-12 w-40" />
          
          <Card className="flex flex-col gap-4">
            <CardHeader className="justify-start items-start mb-5">
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-5 w-24 ml-2" />
            </div>
          </div>

          <div className="flex gap-4 flex-col">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="w-full h-[1px] bg-border"></div>
          
          <div className="flex self-center justify-center items-center gap-4">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
          </div>
        </section>
      </div>

      <div className="flex gap-10 h-full">
        <Card className="w-2/5 h-full flex flex-col">
          <CardHeader className="justify-start items-start mb-5">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="w-3/5 h-full flex flex-col">
          <CardHeader className="justify-start items-start mb-5">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { product, loading } = useFetchProduct(id ?? null);
  const { addToCart, loading: loadingCart } = useAddToCart();
  const { refetchCart } = useCartContext();

  const formSchema = z.object({
    cep: z.string().min(8, {
      message: "CEP deve conter 8 números.",
    }),
    district: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cep: "",
      district: "",
      city: "",
      street: "",
    },
  });

  const redirect = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await axios.get(
      `https://viacep.com.br/ws/${values.cep}/json/`
    );

    form.setValue("district", response.data.bairro || values.district);
    form.setValue("city", response.data.localidade || values.city);
    form.setValue("street", response.data.logradouro || values.street);

    console.log(values);

    const valuesExists = values.cep && values.city && values.district && values.street

   if (valuesExists) {
      redirect("/payment");
    } 
  }

  if (loading) {
    return <ProductSkeleton />;
  }

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
      REFURBISHED: {
        icon: RefreshCw,
        text: "Garantia para Produtos Reformados",
      },

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
            <span className="text-sm font-medium text-primary">
              {policy.text}
            </span>
          </div>
        );
      })
      .filter(Boolean);
  };

  const buildColors = () => {
    const colorsArr = parseJsonField<string[]>(product.colors, []);

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
        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <section className="w-full lg:w-3/5 order-1 lg:order-1 flex flex-col gap-6">
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
            <section className="w-full lg:w-2/5 order-2 lg:order-2 flex flex-col gap-4">
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
                    {parseJsonField<{ name: string; value: string }[]>(
                      product.mainFeatures,
                      []
                    ).map((item, index) => (
                      <div key={index} className="flex">
                        <span className="text-muted-foreground">
                          {item.name}:{" "}
                        </span>
                        <span className="font-bold ml-auto overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {parseJsonField<string[]>(product.colors, []).length > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg">Cores Disponíveis</h2>
                  <div className="flex gap-4">{buildColors()}</div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity" className="font-bold text-lg">
                  Quantidade
                </Label>
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
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="grow-1 shrink-0 font-bold"
                        size="lg"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? "Comprar Agora" : "Indisponível"}
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <h2 className="font-semibold">
                        Para onde iremos enviar?
                      </h2>

                      <div className="space-y-2">
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                          >
                            <FormField
                              control={form.control}
                              name="cep"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CEP</FormLabel>
                                  <FormControl>
                                    <Input placeholder="64071-790" {...field} />
                                  </FormControl>
                                  <FormDescription className="text-sm">
                                    {" "}
                                    Através de seu CEP iremos buscar seu
                                    endereço.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Digite seu bairro."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                      Certifique-se que seu bairro está correto.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Digite sua cidade"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                      Certifique-se que sua cidade está correta.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Rua</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Digite sua rua."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                      Certifique-se que sua rua está correta.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button type="submit" className="cursor-pointer">
                              Continuar
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      console.log(
                        `${quantity} produto(s) adicionado(s) ao carrinho!`
                      );
                      refetchCart();
                    }
                  }}
                  disabled={!product.inStock || loadingCart}
                >
                  {loadingCart
                    ? "Adicionando..."
                    : product.inStock
                    ? `Adicionar ${quantity} ao Carrinho`
                    : "Indisponível"}
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
                  {parseJsonField<{ name: string; value: string }[]>(
                    product.specifications,
                    []
                  ).map((item, index) => (
                    <div key={index} className="flex">
                      <span className="text-muted-foreground">
                        {item.name}:{" "}
                      </span>
                      <span className="font-bold ml-auto overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.value}
                      </span>
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
