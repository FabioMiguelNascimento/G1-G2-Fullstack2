import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SupplierForm } from "./supplier-form";
import type { Supplier } from "@/schemas/supplier.schema";

interface SupplierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier?: Supplier;
    onSubmit: (data: any) => void;
}

export default function SupplierModal({ open, onOpenChange, supplier, onSubmit }: SupplierModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{supplier ? "Editar Fornecedor" : "Adicionar Fornecedor"}</DialogTitle>
                    <DialogDescription>
                        {supplier ? "Edite os detalhes do fornecedor abaixo." : "Preencha o formulário abaixo para adicionar um novo fornecedor."}
                    </DialogDescription>
                </DialogHeader>
                <SupplierForm onSubmit={onSubmit} supplier={supplier} />
            </DialogContent>
        </Dialog>
    );
}
