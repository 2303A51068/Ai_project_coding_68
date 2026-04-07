import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-gray-600 mb-6">Please log in to view your account information.</p>
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Icons.User size={32} className="text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <Link to="/account" className="block px-4 py-2 bg-rose-100 text-rose-700 rounded-lg font-semibold">
                  Profile
                </Link>
                <Link to="/account/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  My Orders
                </Link>
                <Link to="/account/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Wishlist
                </Link>
                <Link to="/account/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Settings
                </Link>
              </nav>

              <button onClick={logout} className="w-full mt-6 border border-red-300 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition">
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={user.name} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={user.email} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <input type="text" value={user.createdAt?.toLocaleDateString()} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-8 border-t">
                <div className="text-center">
                  <Icons.ShoppingBag size={32} className="text-rose-500 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-center">
                  <Icons.Heart size={32} className="text-rose-500 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-2">Wishlist Items</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
