import type { User } from "@/types/user.type";
import api from "@/utils/api";
import { useEffect, useState } from "react";

interface GetUserResponse {
  code: number,
  message: string,
  data: User
}

export default function useFetchUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<GetUserResponse>(`/user/profile/`, {
          signal: controller.signal,
        });
        setUser(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === "CanceledError" || err.name === "AbortError") return;
          console.error(err);
          setError(err?.message ?? "Erro ao carregar usuário");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [userId]);

  return { user, loading, error };
}