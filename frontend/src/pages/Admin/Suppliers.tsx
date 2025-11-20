import DataTable, { type Column } from "@/components/data-table";
import SearchBar from "@/components/search-bar";
import SupplierModal from "@/components/supplier-modal";
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
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useSupplierMutations } from "@/hooks/useSupplierMutations";
import type { Supplier } from "@/schemas/supplier.schema";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Suppliers() {
    const { suppliers, loading, error, refetch } = useFetchSuppliers();
    const { create, update, remove } = useSupplierMutations();
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

    const filteredSuppliers = useMemo(() => {
        if (!searchTerm) return suppliers;
        return suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [suppliers, searchTerm]);

    const handleRowClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            if (selectedSupplier) {
                await update.mutate(selectedSupplier.id, data);
                toast('Fornecedor atualizado com sucesso!');
            } else {
                await create.mutate(data);
                toast('Fornecedor criado com sucesso!');
            }
            setSelectedSupplier(undefined);
            refetch();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast('Erro ao salvar fornecedor');
        }
    };

    const handleAddSupplier = () => {
        setSelectedSupplier(undefined);
        setOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setSupplierToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (supplierToDelete) {
            try {
                await remove.mutate(supplierToDelete);
                toast('Fornecedor deletado com sucesso!');
                refetch();
            } catch (error) {
                console.error(error);
                toast('Erro ao deletar fornecedor');
            }
        }
        setDeleteDialogOpen(false);
        setSupplierToDelete(null);
    };

    const handleDeleteCanceled = () => {
        setDeleteDialogOpen(false)
        setSupplierToDelete(null)
    }

    const columns: Column<Supplier>[] = [
       { key: 'id', header: 'ID' },
       { key: 'name', header: 'Nome' },
       { key: 'email', header: 'Email' },
       { key: 'phone', header: 'Telefone' },
       { key: 'address', header: 'Endereço' },
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
                           Tem certeza que deseja deletar o fornecedor "{supplierToDelete ? filteredSuppliers.find(s => s.id === supplierToDelete)?.name : ''}"? Esta ação não pode ser desfeita.
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
                        placeholder="Procurar fornecedores"
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                    <Button onClick={handleAddSupplier}>Adicionar Fornecedor</Button>
                </header>
                <div>
                    <DataTable columns={columns} data={filteredSuppliers} onError={error} isLoading={loading} onRowClick={handleRowClick} />
                </div>
                <SupplierModal open={open} onOpenChange={setOpen} supplier={selectedSupplier} onSubmit={handleSubmit} />
            </div>
        )
}
