import type { User } from '@/types/user.type';
import api from '@/utils/api';
import { useEffect, useState } from 'react';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

  return { users, loading, error };
};