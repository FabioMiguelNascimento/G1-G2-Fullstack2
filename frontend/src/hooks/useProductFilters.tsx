import { useEffect, useState } from 'react';

interface UseProductFiltersProps {
  onFiltersChange: (filters: Record<string, string>) => void;
}

export const useProductFilters = ({ onFiltersChange }: UseProductFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedCondition('');
    onFiltersChange({});
  };

  const applyFilters = () => {
    const filters: Record<string, string> = {};

    if (activeFilters.includes('novidades')) {
      filters.isNew = 'true';
    }
    if (activeFilters.includes('estoque')) {
      filters.inStock = 'true';
    }

    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (selectedCondition) filters.condition = selectedCondition;

    onFiltersChange(filters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilters, minPrice, maxPrice, selectedCondition]);

  const sortProducts = (products: any[]) => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  const hasActiveFilters = () => {
    return activeFilters.length > 0 || minPrice || maxPrice || selectedCondition;
  };

  const getSortText = () => {
    switch (sortBy) {
      case 'price_asc': return 'Menor Preço';
      case 'price_desc': return 'Maior Preço';
      case 'rating': return 'Melhor Avaliação';
      default: return 'Relevância';
    }
  };

  return {
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
  };
};