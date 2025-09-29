import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import buildStars from "@/utils/buildStars";
import { Link } from 'react-router-dom'

enum ProductCondition {
  PREMIUM,
  NEW,
  REFURBISHED,
  USED,
  DAMAGED,
}

export default function ProductsLists() {
  const { products } = useFetchProducts();

const buildProducts = () => {
    return products.map((prod) => {
      const conditionNames = {
        [ProductCondition.PREMIUM]: "Premium",
        [ProductCondition.NEW]: "Novo",
        [ProductCondition.REFURBISHED]: "Reformado",
        [ProductCondition.USED]: "Usado",
        [ProductCondition.DAMAGED]: "Danificado",
      };

      return (
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
      );
    });
  };

  return (
    <section className="flex flex-wrap gap-6 justify-center md:justify-start p-4">
      {buildProducts()}
    </section>
  );
}
