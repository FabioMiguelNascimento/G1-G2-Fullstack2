import DataTable, { type Column } from "@/components/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFetchSupplierProducts } from "@/hooks/useFetchSupplierProducts";
import { type Product } from "@/schemas/product.schema";

interface SupplierProductsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplierId: string;
}

export default function SupplierProductsModal({ open, onOpenChange, supplierId }: SupplierProductsModalProps) {
    const { products, loading, error } = useFetchSupplierProducts(supplierId);

    const columns: Column<Product>[] = [
        { key: 'id', header: 'ID' },
        { key: 'title', header: 'Título' },
        { key: 'price', header: 'Preço' },
        { key: 'stock', header: 'Estoque' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Produtos do Fornecedor</DialogTitle>
                    <DialogDescription>
                        Lista de produtos associados a este fornecedor.
                    </DialogDescription>
                </DialogHeader>
                <DataTable columns={columns} data={products} isLoading={loading} onError={error} />
            </DialogContent>
        </Dialog>
    );
}
