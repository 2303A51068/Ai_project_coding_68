import { useCart } from '../hooks/useCart';
import * as Icons from 'lucide-react';

export default function Cart() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <Icons.X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Icons.ShoppingBag size={48} className="mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 object-contain bg-gray-100 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        <Icons.Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        <Icons.Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-rose-500 hover:text-rose-700"
                      >
                        <Icons.Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-rose-500">${getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="w-full bg-rose-500 text-white py-3 rounded font-semibold hover:bg-rose-600 transition">
              Checkout
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full border border-gray-300 py-3 rounded font-semibold hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
