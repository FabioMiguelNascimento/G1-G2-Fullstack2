import { useState, useEffect, useCallback } from 'react';
import { getProductsBySupplierId } from '@/services/product.service';
import { type Product } from '@/schemas/product.schema';

export const useFetchSupplierProducts = (supplierId: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!supplierId) return;
        setLoading(true);
        try {
            const data = await getProductsBySupplierId(supplierId);
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch supplier products');
        } finally {
            setLoading(false);
        }
    }, [supplierId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { products, loading, error, refetch };
};
