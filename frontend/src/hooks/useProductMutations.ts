import type { CreateProductInput } from '@/schemas/product.schema';
import api from '@/utils/api';
import { useState } from 'react';

export const useProductMutations = () => {
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const create = {
        mutate: async (data: CreateProductInput) => {
            setCreateLoading(true);
            try {
                const res = await api.post('/product', data);
                return res.data.data;
            } finally {
                setCreateLoading(false);
            }
        },
        loading: createLoading,
    };

    const update = {
        mutate: async (id: string, data: Partial<CreateProductInput>) => {
            setUpdateLoading(true);
            try {
                const res = await api.put(`/product/${id}`, data);
                return res.data.data;
            } finally {
                setUpdateLoading(false);
            }
        },
        loading: updateLoading,
    };

    const remove = {
        mutate: async (id: string) => {
            setDeleteLoading(true);
            try {
                const res = await api.delete(`/product/${id}`);
                return res.data.data;
            } finally {
                setDeleteLoading(false);
            }
        },
        loading: deleteLoading,
    };

    return { create, update, remove };
};