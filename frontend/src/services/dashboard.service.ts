import api from "@/utils/api";

interface DashboardStats {
    totalSales: number;
    bestSellingProduct: {
        id: string;
        title: string;
        price: number;
        totalSold: number;
    } | null;
    lowStockProducts: {
        id: string;
        title: string;
        stock: number;
        price: number;
    }[];
}

interface DashboardResponse {
    code: number;
    message: string;
    data: DashboardStats;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardResponse>('/dashboard/stats');
    return response.data.data;
};