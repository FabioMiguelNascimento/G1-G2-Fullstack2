import { ProductCard, ProductsGridSkeleton } from "@/components/ProductCard";
import SearchBar from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { Filter, Grid3X3, Package, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
            <p className="text-gray-600">Erro ao carregar produtos: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const buildProducts = () => {
    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
        </div>
      );
    }

    return products.map((prod) => (
      <ProductCard key={prod.id} product={prod} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-8 w-8" />
              <h1 className="text-4xl font-bold">OsGuriShop</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Descubra produtos incríveis com os melhores preços do mercado
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar
                placeholder="Buscar produtos, marcas, categorias..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Ordenar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100 transition-colors">
              Todos os produtos
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 transition-colors">
              Novidades
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 transition-colors">
              Ofertas
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 transition-colors">
              Mais vendidos
            </Badge>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {loading ? 'Carregando...' : `${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
            </h2>
            <div className="text-sm text-gray-600">
              {!loading && products.length > 0 && (
                <span>Mostrando todos os resultados</span>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <ProductsGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {buildProducts()}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="text-center mt-12 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Não encontrou o que procura?
              </h3>
              <p className="text-gray-600 mb-4">
                Temos muito mais produtos disponíveis. Entre em contato conosco!
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Fale Conosco
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
