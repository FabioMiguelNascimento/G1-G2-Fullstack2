export default function Home() {
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
    </div>
  );
}
