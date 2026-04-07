import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function AuthPage() {
  const { user, login, register, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <Icons.CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-600 mb-6">You are successfully logged in</p>
            <Link to="/account" className="inline-block bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
              Go to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      login(email, password);
      if (!error) navigate('/account');
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      register(email, password, confirmPassword);
      if (!error) navigate('/account');
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="max-w-md mx-auto px-4">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setAuthMode('login'); setError(''); }}
              className={`flex-1 py-4 font-semibold transition ${
                authMode === 'login'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icons.LogIn size={18} className="inline mr-2" />
              Login
            </button>
            <button
              onClick={() => { setAuthMode('register'); setError(''); }}
              className={`flex-1 py-4 font-semibold transition ${
                authMode === 'register'
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icons.UserPlus size={18} className="inline mr-2" />
              Register
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {authMode === 'login' ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600 mb-6">Sign in to your account to continue shopping</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6">Join ShoesHub and start shopping today</p>
              </div>
            )}

            {/* Error Message */}
            {(error || authError) && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                <p className="font-semibold mb-1">Error</p>
                <p>{error || authError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
                {authMode === 'register' && password.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {password.length >= 6 ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Icons.CheckCircle size={14} /> Password is strong
                      </span>
                    ) : (
                      <span className="text-orange-600">At least 6 characters required</span>
                    )}
                  </p>
                )}
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <Icons.AlertCircle size={14} /> Passwords do not match
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin">
                      <Icons.Loader size={18} />
                    </div>
                    {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  authMode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Footer */}
            {authMode === 'login' && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-3">Don't have an account?</p>
                <button onClick={toggleMode} className="text-rose-500 font-semibold hover:text-rose-600 transition">
                  Create one here
                </button>
              </div>
            )}

            {authMode === 'register' && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
                <button onClick={toggleMode} className="text-rose-500 font-semibold hover:text-rose-600 transition">
                  Sign in instead
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <Icons.Zap size={24} className="text-rose-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Quick Checkout</h3>
            <p className="text-xs text-gray-600">Login to save your payment details</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <Icons.Gift size={24} className="text-rose-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Exclusive Deals</h3>
            <p className="text-xs text-gray-600">Members get exclusive offers & discounts</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-semibold transition">
            <Icons.ArrowLeft size={18} className="inline mr-2" />
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
