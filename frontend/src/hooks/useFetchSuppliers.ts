import { useState, useEffect, useCallback } from 'react';
import { getSuppliers } from '@/services/supplier.service';
import type { Supplier } from '@/schemas/supplier.schema';

export const useFetchSuppliers = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (err) {
            setError('Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { suppliers, loading, error, refetch };
};
