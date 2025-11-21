import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/services/dashboard.service";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getDashboardStats();
                setStats(stats);
            } catch (err) {
                setError('Erro ao carregar estatísticas do dashboard');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Carregando dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Visão geral das vendas e estoque do mês atual
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Vendas (Mês Atual)
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSales || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            unidades vendidas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Produto Mais Vendido
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {stats?.bestSellingProduct ? (
                            <div>
                                <div className="text-2xl font-bold truncate">
                                    {stats.bestSellingProduct.title}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.bestSellingProduct.totalSold} unidades vendidas
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    R$ {stats.bestSellingProduct.price.toFixed(2)}
                                </p>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                Nenhum produto vendido ainda
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Produtos com Baixo Estoque
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.lowStockProducts.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            produtos com menos de 10 unidades
                        </p>
                    </CardContent>
                </Card>
            </div>

            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Alerta de Estoque Baixo</CardTitle>
                        <CardDescription>
                            Produtos que precisam de reposição urgente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.lowStockProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{product.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            R$ {product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                                        {product.stock} em estoque
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}