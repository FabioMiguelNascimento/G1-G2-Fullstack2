import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthContext from "@/hooks/useAthContext";
import useFetchUser from "@/hooks/useFetchUser";
import { updateSchema, type UpdateInput } from "@/schemas/user.schema";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    
    // Usar o ID dos parâmetros da URL ou o ID do usuário logado
    const userId = id || currentUser?.id || null;
    const { user, loading, error } = useFetchUser(userId);
    
    const [isUpdating, setIsUpdating] = useState(false);

    const form = useForm<UpdateInput>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // Atualizar o formulário quando os dados do usuário carregarem
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                password: "", // Sempre vazio por segurança
            });
        }
    }, [user, form]);

    // Verificar autenticação
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/login");
            return;
        }

        // Se está tentando editar outro usuário e não é admin
        if (id && id !== currentUser?.id && currentUser?.role !== "ADMIN") {
            toast.error("Você não tem permissão para editar este usuário");
            navigate("/profile");
            return;
        }
    }, [isAuthenticated, id, currentUser, navigate]);

    const onSubmit = async (data: UpdateInput) => {
        try {
            setIsUpdating(true);
            
            // Remover campos vazios
            const updateData: Partial<UpdateInput> = {};
            if (data.name && data.name.trim()) updateData.name = data.name.trim();
            if (data.email && data.email.trim()) updateData.email = data.email.trim();
            if (data.password && data.password.trim()) updateData.password = data.password.trim();

            // Se não há dados para atualizar
            if (Object.keys(updateData).length === 0) {
                toast.warning("Nenhuma alteração foi feita");
                return;
            }

            // Decidir endpoint baseado se é admin editando outro usuário ou próprio usuário
            const endpoint = id && id !== currentUser?.id 
                ? `/user/${id}` 
                : "/user/";

            const response = await api.put(endpoint, updateData);

            if (response.data.code === 200) {
                toast.success("Usuário atualizado com sucesso!");
                
                // Se editou próprio perfil, redirecionar para perfil
                if (!id || id === currentUser?.id) {
                    if (user) {
                        navigate(`/account/${user.id}`);
                    }
                } else {
                    // Se admin editou outro usuário, voltar para lista de usuários
                    navigate("/admin/users");
                }
            }
        } catch (error: any) {
            console.error("Erro ao atualizar usuário:", error);
            const errorMessage = error?.response?.data?.message || "Erro ao atualizar usuário";
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 max-w-2xl">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-destructive text-lg mb-4">{error}</p>
                        <Button onClick={() => navigate(-1)} variant="outline">
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto py-8 max-w-2xl">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground text-lg mb-4">Usuário não encontrado</p>
                        <Button onClick={() => navigate(-1)} variant="outline">
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isEditingOwnProfile = !id || id === currentUser?.id;

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {isEditingOwnProfile ? "Editar Meu Perfil" : `Editar Usuário: ${user.name}`}
                    </CardTitle>
                    <CardDescription>
                        {isEditingOwnProfile 
                            ? "Atualize suas informações pessoais"
                            : "Edite as informações do usuário selecionado"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Nome</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Digite seu nome"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email"
                                                placeholder="Digite seu email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">
                                            Nova Senha (opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password"
                                                placeholder="Digite uma nova senha (deixe em branco para manter a atual)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="flex-1"
                                >
                                    {isUpdating ? "Atualizando..." : "Atualizar"}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    disabled={isUpdating}
                                >
                                    <Link to={`/account/${user.id}`}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
