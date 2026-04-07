import content from '../content.json';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function CollectionPage() {
  const { id } = useParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const { addToCart } = useCart();

  const collectionName = id?.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const collectionImage = content.collection.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id)?.image;

  // Filter products based on collection
  let collectionProducts = content.products.items;
  if (id === 'mens-footwear') {
    collectionProducts = collectionProducts.filter(p => p.categories.includes('Men'));
  } else if (id === 'womens-footwear') {
    collectionProducts = collectionProducts.filter(p => p.categories.includes('Women'));
  } else if (id === 'sports-footwear') {
    collectionProducts = collectionProducts.filter(p => p.categories.includes('Sports'));
  }

  const filteredProducts = collectionProducts.filter((product) => {
    const matchesBrand = activeFilter === 'All' || product.brand === activeFilter;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesBrand && matchesPrice;
  });

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      {/* Collection Hero */}
      {collectionImage && (
        <div className="relative h-80 bg-cover bg-center mb-12" style={{ backgroundImage: `url(${collectionImage})` }}>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white text-center">{collectionName}</h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter Products</h2>
          
          {/* Brand Filter */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Brand</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Nike', 'Adidas', 'Puma', 'New Balance'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveFilter(brand)}
                  className={`px-4 py-2 rounded-full transition ${activeFilter === brand ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <p className="text-gray-600 mb-6">{filteredProducts.length} products found</p>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                  <div className="bg-gray-100 p-4 h-64 flex items-center justify-center overflow-hidden group">
                    <img src={product.image} alt={product.title} className="h-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-rose-500 font-bold">${product.price.toFixed(2)}</p>
                      {product.oldPrice && (
                        <del className="text-gray-400 text-sm">${product.oldPrice.toFixed(2)}</del>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product);
                        alert('Added to cart!');
                      }}
                      className="mt-3 w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition flex items-center justify-center gap-2"
                    >
                      <Icons.ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
