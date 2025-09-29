import DataTable, { type Column } from "@/components/data-table";
import SearchBar from "@/components/search-bar";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import type { Product } from "@/schemas/product.schema";
import { useMemo, useState } from "react";

interface ProductProps {} 
export default function Product ( {}: ProductProps ) {
    const { products, error, loading } = useFetchProducts()
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const columns: Column<Product>[] = [
       { key: 'id', header: 'ID' },
       { key: 'title', header: 'Título' },
       { key: 'price', header: 'Preço' },
       { key: 'condition', header: 'Condição' },
       { key: 'stock', header: 'Em Estoque' },
       { key: 'isNew', header: 'Novo' },
       { key: 'rating', header: 'Avaliacao'}
    ];
        return (
            <div>
                <header>
                    <SearchBar
                        placeholder="Procurar produtos"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </header>
                <div>
                    <DataTable columns={columns} data={filteredProducts} onError={error} isLoading={loading} />
                </div>
            </div>
        )
}