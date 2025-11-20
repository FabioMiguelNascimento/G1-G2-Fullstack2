import { useState, useCallback } from "react";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "@/services/supplier.service";
import { z } from "zod";

const createSupplierSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

const updateSupplierSchema = createSupplierSchema.partial();

export const useSupplierActions = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchSuppliers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addSupplier = async (newSupplier: z.infer<typeof createSupplierSchema>) => {
        setIsLoading(true);
        try {
            await createSupplier(newSupplier);
            await fetchSuppliers();
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const editSupplier = async (id: string, updatedSupplier: z.infer<typeof updateSupplierSchema>) => {
        setIsLoading(true);
        try {
            await updateSupplier(id, updatedSupplier);
            await fetchSuppliers();
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const removeSupplier = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteSupplier(id);
            await fetchSuppliers();
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        suppliers,
        isLoading,
        isError,
        fetchSuppliers,
        addSupplier,
        editSupplier,
        removeSupplier,
    };
};
