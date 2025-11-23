import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useAuthContext from '@/hooks/useAthContext';
import useFetchUserOrders from '@/hooks/useFetchUserOrders';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useState } from 'react';

export default function Orders() {
    const { user } = useAuthContext();
    const { orders, loading, error } = useFetchUserOrders(user?.id || null);
    const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});

    const toggleOrder = (orderId: string) => {
        setOpenOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    if (!user) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">Você precisa estar logado para ver seus pedidos</p>
                        <Button onClick={() => window.location.href = '/login'}>
                            Fazer Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
                <div className="text-center py-8">
                    <p>Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <p className="text-red-700">Erro ao carregar pedidos: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido</p>
                        <Button onClick={() => window.location.href = '/products'}>
                            Começar a comprar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Meus Pedidos ({orders.length})</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <Collapsible
                            open={openOrders[order.id]}
                            onOpenChange={() => toggleOrder(order.id)}
                        >
                            <CardHeader className="p-4 bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base">{order.name}</CardTitle>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Concluído
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium">Total</p>
                                            <p className="text-lg font-bold">R$ {order.totalValue.toFixed(2)}</p>
                                        </div>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                {openOrders[order.id] ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                </div>
                            </CardHeader>
                            <CollapsibleContent>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {order.products.map((item, index) => (
                                            <div key={index} className="p-4 flex items-center gap-4">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.title}
                                                        className="h-16 w-16 object-cover rounded-md border"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.product.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity}x R$ {item.product.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right font-medium">
                                                    R$ {item.total.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-gray-50 flex justify-between items-center sm:hidden border-t">
                                        <span className="font-medium">Total do Pedido</span>
                                        <span className="text-lg font-bold">R$ {order.totalValue.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}
            </div>
        </div>
    );
}
