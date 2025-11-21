import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/schemas/product.schema";
import buildStars from "@/utils/buildStars";
import { BadgeCheckIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const conditionNames: Record<string, string> = {
  PREMIUM: "Premium",
  NEW: "Novo",
  REFURBISHED: "Reformado",
  USED: "Usado",
  DAMAGED: "Danificado",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="no-underline group"
    >
      <Card className="relative w-full h-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg overflow-hidden border-0 shadow-md">
        {product.discountPercentage ? (
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 z-10">
            <div className="flex-shrink-0">{buildStars(product, "compact")}</div>
            <Badge className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              -{product.discountPercentage}% OFF
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 left-3 z-10">
            {buildStars(product, "compact")}
          </div>
        )}

        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 mb-3">
            {product.isNew && (
              <Badge className="bg-blue-500 text-white font-mono text-xs px-2 py-1">
                <BadgeCheckIcon className="mr-1 h-3 w-3" /> Novo
              </Badge>
            )}
            {product.condition !== undefined && conditionNames[product.condition] && (
              <Badge variant="outline" className="text-gray-600 text-xs border-gray-300">
                {conditionNames[product.condition]}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex flex-col justify-end flex-1">
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-bold text-blue-600 leading-none">
              R$ {product.price.toFixed(2)}
            </span>
            {product.withoutDiscount && (
              <span className="text-sm font-medium text-muted-foreground line-through">
                R$ {product.withoutDiscount.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="w-full h-auto overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}