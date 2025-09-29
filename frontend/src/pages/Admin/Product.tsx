import DataTable, { type Column } from "@/components/data-table";
import ProductModal from "@/components/product-modal";
import SearchBar from "@/components/search-bar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import type { Product } from "@/schemas/product.schema";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface ProductProps {} 
export default function Product ( {}: ProductProps ) {
    const { products, loading, error, refetch } = useFetchProducts()
    const { create, update, remove } = useProductMutations();
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleRowClick = (product: Product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            if (selectedProduct) {
                await update.mutate(selectedProduct.id, data);
                toast('Produto atualizado com sucesso!');
            } else {
                await create.mutate(data);
                toast('Produto criado com sucesso!');
            }
            setSelectedProduct(undefined);
            refetch();
        } catch (error) {
            console.error(error);
            toast('Erro ao salvar produto');
        }
    };

    const handleAddProduct = () => {
        setSelectedProduct(undefined);
        setOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (productToDelete) {
            try {
                await remove.mutate(productToDelete);
                toast('Produto deletado com sucesso!');
                refetch();
            } catch (error) {
                console.error(error);
                toast('Erro ao deletar produto');
            }
        }
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleDeleteCanceled = () => {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
    }

    const columns: Column<Product>[] = [
       { key: 'id', header: 'ID' },
       { key: 'title', header: 'Título' },
       { key: 'price', header: 'Preço' },
       { key: 'condition', header: 'Condição' },
       { key: 'stock', header: 'Em Estoque' },
       { key: 'isNew', header: 'Novo' },
       { key: 'rating', header: 'Avaliacao' },
       { key: 'actions', header: 'Ações', render: (value, item) => (
           <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
               <AlertDialogTrigger asChild>
                   <Button variant="destructive" size="sm" type="button" disabled={remove.loading} onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}>
                       {remove.loading ? <Spinner /> : <Trash />}
                   </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                   <AlertDialogHeader>
                       <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                       <AlertDialogDescription>
                           Tem certeza que deseja deletar o produto "{productToDelete ? filteredProducts.find(p => p.id === productToDelete)?.title : ''}"? Esta ação não pode ser desfeita.
                       </AlertDialogDescription>
                   </AlertDialogHeader>
                   <AlertDialogFooter>
                       <AlertDialogCancel onClick={(e) => { e.stopPropagation(); handleDeleteCanceled() }}>Cancelar</AlertDialogCancel>
                       <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDeleteConfirmed(); }}>Deletar</AlertDialogAction>
                   </AlertDialogFooter>
               </AlertDialogContent>
           </AlertDialog>
       ) }
    ];
        return (
            <div>
                <header className="flex justify-between items-center mb-4 gap-4">
                    <SearchBar
                        placeholder="Procurar produtos"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                    <Button onClick={handleAddProduct}>Adicionar Produto</Button>
                </header>
                <div>
                    <DataTable columns={columns} data={filteredProducts} onError={error} isLoading={loading} onRowClick={handleRowClick} />
                </div>
                <ProductModal open={open} onOpenChange={setOpen} product={selectedProduct} onSubmit={handleSubmit} />
            </div>
        )
}