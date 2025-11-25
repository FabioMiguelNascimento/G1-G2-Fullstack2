import { ProductCard } from "@/components/ProductCard";
import { useFetchProducts } from "@/hooks/useFetchProducts";
export default function Home() {
  const { products, loading } = useFetchProducts();

  const novidades = products.filter(prod => prod.isNew === true);

  
  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      <section className="text-center py-16 bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-md text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Tecnologia que cabe no seu bolso
        </h1>
        <p className="text-blue-100 text-lg mb-6">
          Smartphones, Notebooks e Acessórios com os melhores preços.
        </p>
        <a
          href="/products"
          className="bg-white text-blue-800 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100"
        >
          Ver Produtos
        </a>
      </section>
      <h2 className="text-3xl font-bold mb-6">Novidades</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {novidades.map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
