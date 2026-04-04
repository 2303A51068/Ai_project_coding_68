import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as Icons from 'lucide-react';

export default function Auth() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'login') {
      login(email, password);
    } else {
      register(email, password, confirmPassword);
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Icons.X size={24} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white py-2 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={toggleMode}
              className="text-rose-500 font-semibold hover:text-rose-600"
            >
              {authMode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
