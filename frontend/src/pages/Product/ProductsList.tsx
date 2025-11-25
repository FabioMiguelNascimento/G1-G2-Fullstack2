import { ProductCard, ProductsGridSkeleton } from "@/components/ProductCard";
import SearchBar from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ChevronDown, Filter, Grid3X3, Package, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ProductsLists() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');
  const { products, loading, error, refetch } = useFetchProducts();

  const {
    activeFilters,
    minPrice,
    maxPrice,
    selectedCondition,
    sortBy,
    showFilters,
    showSortOptions,
    setMinPrice,
    setMaxPrice,
    setSelectedCondition,
    setSortBy,
    setShowFilters,
    setShowSortOptions,
    addFilter,
    removeFilter,
    clearAllFilters,
    sortProducts,
    hasActiveFilters,
    getSortText,
  } = useProductFilters({
    onFiltersChange: (filters) => {
      if (searchTerm) {
        filters.title = searchTerm;
      }
      refetch(filters);
    }
  });

  useEffect(() => {
    const title = searchParams.get('title') || '';
    setSearchTerm(title);
  }, [searchParams]);

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
    const sortedProducts = sortProducts(products);

    if (sortedProducts.length === 0) {
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

    return sortedProducts.map((prod) => (
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
              />
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters() && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <Grid3X3 className="h-4 w-4" />
                Ordenar: {getSortText()}
              </Button>
            </div>
          </div>

          {showSortOptions && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSortBy('relevance');
                    setShowSortOptions(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === 'relevance' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Relevância
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_asc');
                    setShowSortOptions(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === 'price_asc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Menor Preço
                </button>
                <button
                  onClick={() => {
                    setSortBy('price_desc');
                    setShowSortOptions(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === 'price_desc' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Maior Preço
                </button>
                <button
                  onClick={() => {
                    setSortBy('rating');
                    setShowSortOptions(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === 'rating' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Melhor Avaliação
                </button>
              </div>
            </div>
          )}

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Faixa de Preço</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Condição</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedCondition ? selectedCondition : "Todas as condições"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent >
                      <DropdownMenuItem onClick={() => setSelectedCondition("")}>
                        Todas as condições
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCondition("NEW")}>
                        Novo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCondition("PREMIUM")}>
                        Premium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCondition("REFURBISHED")}>
                        Reformado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCondition("USED")}>
                        Usado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCondition("DAMAGED")}>
                        Danificado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className=" flex items-center gap-2"
                    disabled={!hasActiveFilters() && !searchTerm}
                  >
                    <X className="h-4 w-4" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge 
              variant={!hasActiveFilters() && !searchTerm ? "default" : "secondary"} 
              className="cursor-pointer transition-colors"
              onClick={() => {
                clearAllFilters();
                setSearchTerm('');
              }}
            >
              Todos os produtos
            </Badge>
            <Badge 
              variant={activeFilters.includes('estoque') ? "default" : "secondary"} 
              className="cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => activeFilters.includes('estoque') ? removeFilter('estoque') : addFilter('estoque')}
            >
              Em Estoque
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
