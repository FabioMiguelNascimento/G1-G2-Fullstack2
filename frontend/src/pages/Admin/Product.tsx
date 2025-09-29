import DataTable, { type Column } from "@/components/data-table";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import type { Product } from "@/schemas/product.schema";

interface ProductProps {} 
export default function Product ( {}: ProductProps ) {
    const { products, error, loading } = useFetchProducts()

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
            <DataTable columns={columns} data={products} onError={error} isLoading={loading} />
        )
}