
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCheckout() {
    try {
        console.log("Iniciando teste de checkout...");

        // 1. Pegar usuário de teste
        const user = await prisma.user.findUnique({
            where: { email: 'user@g1g2.com' },
            include: { cart: true }
        });

        if (!user) {
            console.error("Usuário não encontrado");
            return;
        }
        console.log("Usuário encontrado:", user.id);

        // 2. Pegar um produto com estoque
        const product = await prisma.product.findFirst({
            where: { stock: { gt: 0 } }
        });

        if (!product) {
            console.error("Nenhum produto com estoque encontrado");
            return;
        }
        console.log("Produto encontrado:", product.id, "Estoque:", product.stock);

        // 3. Adicionar ao carrinho (simulando)
        // Limpar carrinho antes
        await prisma.productInCart.deleteMany({ where: { cartId: user.cartId } });
        
        await prisma.productInCart.create({
            data: {
                cartId: user.cartId,
                productId: product.id,
                quantity: 1,
                assignedBy: user.id
            }
        });
        console.log("Produto adicionado ao carrinho");

        // 4. Tentar fazer checkout chamando o repositório diretamente (simulando o controller)
        // Precisamos instanciar o repositório. Como ele usa imports relativos, vamos copiar a lógica aqui para testar.
        
        console.log("Simulando lógica do CheckoutRepository...");
        
        // Lógica do Repo
        const userWithCart = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                cart: {
                    include: {
                        product: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!userWithCart || !userWithCart.cart) {
            console.log("Repo: Usuário ou carrinho não encontrado");
            return;
        }

        // Validar senha (simulada - assumindo que a senha '123456' está correta pois acabamos de seedar)
        // const isPasswordValid = decodePassword(user.password, password); 
        // Vamos pular a validação de senha aqui pois queremos testar a lógica de criação do pedido
        
        if (userWithCart.cart.product.length === 0) {
            console.log("Repo: Carrinho vazio");
            return;
        }

        console.log(`Repo: Criando pedido para usuário ${user.id} com ${userWithCart.cart.product.length} produtos`);

        // Verificar estoque
        const productIds = userWithCart.cart.product.map(item => item.productId);
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const insufficientStock = userWithCart.cart.product.filter(cartItem => {
            const p = existingProducts.find(prod => prod.id === cartItem.productId);
            return !p || p.stock < cartItem.quantity;
        });

        if (insufficientStock.length > 0) {
            console.log("Repo: Produtos com estoque insuficiente:", insufficientStock);
            return;
        }

        // Transação
        try {
            const order = await prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        name: `Pedido Teste ${new Date().toISOString()}`,
                        userId: user.id,
                        product: {
                            create: userWithCart.cart.product.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                assignedBy: user.id,
                            })),
                        },
                    },
                    include: { product: true }
                });

                console.log("Repo: Pedido criado:", newOrder.id);

                await tx.productInCart.deleteMany({
                    where: { cartId: userWithCart.cart.id },
                });
                console.log("Repo: Carrinho limpo");

                await tx.cart.update({
                    where: { id: userWithCart.cart.id },
                    data: { totalValue: "0" },
                });

                return newOrder;
            });

            console.log("SUCESSO! Pedido criado e carrinho limpo.");
        } catch (error) {
            console.error("ERRO NA TRANSAÇÃO:", error);
        }

    } catch (e) {
        console.error("Erro geral:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testCheckout();
