import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import * as Icons from 'lucide-react';

export default function ProductDetail({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
          >
            <Icons.X size={24} />
          </button>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto object-contain"
                />
              </div>
              {product.badge && (
                <span className="inline-block bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-rose-500 font-semibold mb-2">
                {product.categories?.join(' / ')}
              </p>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <p className="text-gray-600 mb-4">
                Brand: <span className="font-semibold">{product.brand}</span>
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-rose-500">
                  ${product.price.toFixed(2)}
                </span>
                <del className="text-lg text-gray-400">
                  ${product.oldPrice.toFixed(2)}
                </del>
                <span className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold">
                  -{discount}%
                </span>
              </div>

              {/* Rating (Mock) */}
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Icons.Star
                    key={i}
                    size={16}
                    fill={i < 4 ? '#f97316' : '#d1d5db'}
                    className={i < 4 ? 'text-orange-500' : 'text-gray-300'}
                  />
                ))}
                <span className="text-gray-600 text-sm">(128 reviews)</span>
              </div>

              {/* Product Description */}
              <p className="text-gray-600 text-sm mb-6">
                Experience ultimate comfort and style with our premium {product.brand} footwear.
                Crafted with precision, designed for performance. Perfect for {product.categories?.join(' and ')}.
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Icons.Minus size={18} />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Icons.Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition flex items-center justify-center gap-2 mb-3"
              >
                <Icons.ShoppingCart size={20} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <button className="flex-1 border border-rose-500 text-rose-500 py-2 rounded-lg font-semibold hover:bg-rose-50 transition flex items-center justify-center gap-2">
                  <Icons.Heart size={20} />
                  Wishlist
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Icons.Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
