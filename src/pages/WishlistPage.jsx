import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const wishlistItems = []; // This will be connected to a wishlist context

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icons.Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Add your favorite shoes to your wishlist and find them here.</p>
            <Link to="/" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-rose-500 font-bold">${item.price}</p>
                  <button className="w-full mt-2 bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
