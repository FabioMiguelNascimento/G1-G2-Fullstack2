import { createProductSchema } from "@/schemas/product.schema";
import { parseJsonField } from "@/utils/json";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import ArrayEditor from "./array-editor";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: z.infer<typeof createProductSchema> & { id?: string };
    onSubmit: (data: z.infer<typeof createProductSchema>) => void;
}

export default function ProductModal({ open, onOpenChange, product, onSubmit }: ProductModalProps) {
    const defaultValues = useMemo(() => ({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        withoutDiscount: product?.withoutDiscount ?? undefined,
        discountPercentage: product?.discountPercentage ?? undefined,
        rating: product?.rating ?? undefined,
        inStock: product?.inStock ?? true,
        stock: product?.stock || 0,
        isNew: product?.isNew ?? false,
        condition: product?.condition || "NEW",
        categorys: parseJsonField<string[]>(product?.categorys, []),
        specifications: parseJsonField<{ name: string; value: string }[]>(product?.specifications, []),
        mainFeatures: parseJsonField<{ name: string; value: string }[]>(product?.mainFeatures, []),
        colors: parseJsonField<string[]>(product?.colors, []),
        freeShipping: product?.freeShipping || "FREE",
        warranty: product?.warranty || "MANUFACTURER",
        returnPolicy: product?.returnPolicy || "DAYS_30",
        includes: parseJsonField<{ name: string; value: string }[]>(product?.includes, []),
        tags: product?.tags || [],
        supplierId: product?.supplierId ?? null
    }), [product]);
    
    const form = useForm<any>({
        resolver: zodResolver(createProductSchema),
        defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const handleSubmit = (data: z.infer<typeof createProductSchema>) => {
        onSubmit(data);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Editar produto" : "Criar novo produto"}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título do produto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Descrição do produto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Preço</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="withoutDiscount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Preço sem desconto (opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Porcentagem de desconto (opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" max="100" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Avaliação (opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" max="5" step="0.1" placeholder="0.0" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="inStock"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="font-bold">Em estoque</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Quantidade em estoque</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isNew"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="font-bold">É novo</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Condição</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a condição" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                                <SelectItem value="NEW">Novo</SelectItem>
                                                <SelectItem value="REFURBISHED">Recondicionado</SelectItem>
                                                <SelectItem value="USED">Usado</SelectItem>
                                                <SelectItem value="DAMAGED">Danificado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="freeShipping"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Frete</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o frete" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FREE">Grátis</SelectItem>
                                                <SelectItem value="PAID">Pago</SelectItem>
                                                <SelectItem value="EXPRESS">Expresso</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="warranty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Garantia</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a garantia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MANUFACTURER">Fabricante</SelectItem>
                                                <SelectItem value="EXTENDED">Estendida</SelectItem>
                                                <SelectItem value="REFURBISHED">Recondicionada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="returnPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Política de devolução</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a política" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="DAYS_30">30 dias</SelectItem>
                                                <SelectItem value="DAYS_60">60 dias</SelectItem>
                                                <SelectItem value="NO_RETURN">Sem devolução</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Para arrays, simplificando com inputs de texto separados por vírgula */}
                            <FormField
                                control={form.control}
                                name="categorys"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Categorias (separadas por vírgula)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Categoria1, Categoria2" value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(', ').map(s => s.trim()))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="colors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Cores (separadas por vírgula)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Vermelho, Azul" value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(', ').map(s => s.trim()))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Tags (separadas por vírgula)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tag1, Tag2" value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(', ').map(s => s.trim()))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="specifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Especificações</FormLabel>
                                        <FormControl>
                                            <ArrayEditor value={field.value || []} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mainFeatures"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Características principais</FormLabel>
                                        <FormControl>
                                            <ArrayEditor value={field.value || []} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="includes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Inclui</FormLabel>
                                        <FormControl>
                                            <ArrayEditor value={field.value || []} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Id do Fornecedor</FormLabel>
                                        <FormControl>
                                            <Input value={field.value || ""} onChange={field.onChange}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{product ? "Atualizar" : "Criar"}</Button>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    )
}