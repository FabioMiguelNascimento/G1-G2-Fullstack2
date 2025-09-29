import SearchBar from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import buildStars from "@/utils/buildStars";
import { BadgeCheckIcon } from "lucide-react";
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ProductsLists() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');
  const { products, loading, error, refetch } = useFetchProducts();

  useEffect(() => {
    const title = searchParams.get('title') || '';
    setSearchTerm(title);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      refetch({ title: value.trim() });
    } else {
      refetch({});
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro ao carregar produtos: {error}</div>;
  }

  const buildProducts = () => {
    const conditionNames: Record<string, string> = {
      PREMIUM: "Premium",
      NEW: "Novo",
      REFURBISHED: "Reformado",
      USED: "Usado",
      DAMAGED: "Danificado",
    };

    return products.map((prod) => (
      <Link
        key={prod.id}
        to={`/product/${prod.id}`}
        className="no-underline"
      >
        <Card
          className="relative w-80 h-auto cursor-pointer transition-all 200 hover:scale-101 overflow-hidden"
        >
          {prod.discountPercentage ? (
            <div className="absolute top-3 right-3 left-3 flex items-center justify-around gap-2">
              <div className="flex-shrink-0 mr-auto">{buildStars(prod, "compact")}</div>
              <Badge
                variant="secondary"
                className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full"
              >
                -{prod.discountPercentage}% OFF
              </Badge>
            </div>
          ) : null}

          <CardHeader className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {prod.isNew && (
                <Badge className="bg-blue-400 text-white font-mono text-xs">
                  <BadgeCheckIcon className="mr-1 h-3 w-3" /> Novo
                </Badge>
              )}
              {prod.condition !== undefined &&
                conditionNames[prod.condition] && (
                  <Badge variant="outline" className="text-black text-xs">
                    {conditionNames[prod.condition]}
                  </Badge>
                )}
            </div>
            <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
              {prod.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {prod.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 flex flex-col items-center justify-between gap-4">
            <div className="min-w-0 w-full flex items-center justify-start">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-3xl font-bold text-blue-600 leading-none">
                  $ {prod.price.toFixed(2)}
                </span>

                {prod.withoutDiscount ? (
                  <span className="text-sm font-medium text-muted-foreground line-through ml-3">
                    $ {prod.withoutDiscount.toFixed(2)}
                  </span>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <SearchBar
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
        />
      </div>
      <section className="flex flex-wrap gap-6 justify-center md:justify-start p-4">
        {buildProducts()}
      </section>
    </div>
  );
}
