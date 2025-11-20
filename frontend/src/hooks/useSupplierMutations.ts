import { useState } from 'react';
import { createSupplier, updateSupplier, deleteSupplier } from '@/services/supplier.service';
import type { Supplier } from '@/schemas/supplier.schema';

export const useSupplierMutations = () => {
    const [loading, setLoading] = useState(false);

    const create = {
        mutate: async (data: Omit<Supplier, 'id'>) => {
            setLoading(true);
            try {
                await createSupplier(data);
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        loading,
    };

    const update = {
        mutate: async (id: string, data: Partial<Omit<Supplier, 'id'>>) => {
            setLoading(true);
            try {
                await updateSupplier(id, data);
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        loading,
    };

    const remove = {
        mutate: async (id: string) => {
            setLoading(true);
            try {
                await deleteSupplier(id);
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        loading,
    };

    return { create, update, remove };
};
