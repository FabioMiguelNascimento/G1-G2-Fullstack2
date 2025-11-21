export interface DashboardStats {
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

export default class DashboardResponse {
    getStats(data: DashboardStats) {
        return {
            code: 200,
            message: "Estatísticas do dashboard obtidas com sucesso",
            data: data
        };
    }
}