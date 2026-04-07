import content from '../content.json';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatCurrency';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = content.products.items.filter((product) => {
    const matchesBrand = activeFilter === 'All' || product.brand === activeFilter;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = categoryFilter === 'All' || product.categories.includes(categoryFilter);
    
    return matchesBrand && matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cover bg-center h-96 flex items-center justify-center relative overflow-hidden" style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-rose-400">{content.hero.titleLight}</span> {content.hero.titleBold}
          </h1>
          <p className="text-lg mb-8">{content.hero.description}</p>
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
            {content.hero.buttonText}
          </button>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Our Collections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.collection.map((col, idx) => (
            <Link key={idx} to={`/collection/${col.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="group relative overflow-hidden rounded-lg cursor-pointer">
                <img src={col.image} alt={col.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 flex items-center justify-center transition">
                  <h3 className="text-2xl font-bold text-white text-center">{col.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-3">
            {['All', 'Nike', 'Adidas', 'Puma', 'New Balance'].map((brand) => (
              <button key={brand} onClick={() => setActiveFilter(brand)} className={`px-4 py-2 rounded-full transition ${activeFilter === brand ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {brand}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {['All', 'Men', 'Women', 'Kids'].map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-2 rounded-full transition ${categoryFilter === cat ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {cat}
              </button>
            ))}
          </div>

          <input type="range" min="0" max="30000" step="500" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full" />
          <p className="text-sm text-gray-600">Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <div className="bg-gray-100 p-4 h-64 flex items-center justify-center overflow-hidden group cursor-pointer">
                <img src={product.image} alt={product.title} className="h-full object-contain group-hover:scale-110 transition-transform" onClick={() => setSelectedProduct(product)} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-rose-500 font-bold">{formatPrice(product.price)}</p>
                <button onClick={() => { addToCart(product); alert('Added to cart!'); }} className="mt-3 w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
