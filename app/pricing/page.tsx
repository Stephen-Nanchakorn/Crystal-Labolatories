import PriceDisplay from '@/app/components/PriceDisplay';

export default function PricingPage() {
  const plugins = [
    { id: 'compressor', name: 'Crystal Compressor', priceUSD: 49.99 },
    { id: 'reverb', name: 'Crystal Reverb', priceUSD: 79.99 },
    { id: 'eq', name: 'Crystal EQ', priceUSD: 59.99 },
    { id: 'bundle', name: 'All Plugins Bundle', priceUSD: 149.99 },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Pricing <span className="text-cyan-400">แผนราคา</span>
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">{plugin.name}</h3>
              <PriceDisplay usdPrice={plugin.priceUSD} />
              <a
                href={`/checkout/${plugin.id}`}
                className="block mt-4 text-center bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-3 rounded-lg"
              >
                ซื้อทันที
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}