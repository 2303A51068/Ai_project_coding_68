import content from '../content.json';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Collections', href: '/collection/mens-footwear' },
    { label: 'Store', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 z-50 w-full bg-white transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link to="/" className="text-[26px] font-bold text-black cursor-pointer">
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-semibold text-gray-800 hover:text-rose-500 cursor-pointer transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Icons.Search className="h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && window.location.pathname !== '/') {
                    navigate('/');
                  }
                }}
                className="ml-2 bg-transparent outline-none w-32 text-sm"
              />
            </div>
            <button onClick={() => navigate(user ? '/account' : '/auth')} className="relative group">
              <Icons.User className="h-5 w-5 cursor-pointer hover:text-rose-500" />
              {user && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block whitespace-nowrap text-sm">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-gray-600 text-xs">{user.email}</p>
                </div>
              )}
            </button>
            <button onClick={() => navigate('/wishlist')} className="relative cursor-pointer">
              <Icons.Heart className="h-5 w-5 hover:text-rose-500" />
            </button>
            <button onClick={() => navigate('/cart')} className="relative flex items-center gap-2">
              <Icons.ShoppingBag className="h-5 w-5 cursor-pointer hover:text-rose-500" />
              {getCartCount() > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
            <Icons.Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenuOpen(false)} />}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-72 bg-white p-6 transition-transform lg:hidden ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button className="absolute right-4 top-4 cursor-pointer" onClick={() => setMenuOpen(false)}>
            <Icons.X />
          </button>
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-[26px] font-bold text-black cursor-pointer">
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </Link>
          <nav className="mt-12 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b py-2 font-semibold text-gray-800 hover:text-rose-500 cursor-pointer w-full text-left"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className="mt-8 pt-6 border-t space-y-3">
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-800 hover:text-rose-500 font-semibold"
            >
              <Icons.ShoppingCart size={18} /> Cart
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-800 hover:text-rose-500 font-semibold"
            >
              <Icons.Heart size={18} /> Wishlist
            </Link>
            <button
              onClick={() => {
                navigate(user ? '/account' : '/auth');
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-rose-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-rose-600 transition"
            >
              <Icons.User size={18} /> {user ? 'My Account' : 'Login / Register'}
            </button>
          </div>
        </aside>
      </header>

      {/* Main Content */}
      <main className="mt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="text-xl font-bold text-white">
                <span className="text-rose-500">{content.footer.brand.highlight1}</span>
                hoes
                <span className="text-rose-500">{content.footer.brand.highlight2}</span>
                ub
              </Link>
              <p className="mt-2 text-sm">Premium footwear for every lifestyle</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/account" className="hover:text-rose-500">My Account</Link></li>
                <li><Link to="/cart" className="hover:text-rose-500">View Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-rose-500">Wishlist</Link></li>
                <li><Link to="/" className="hover:text-rose-500">New Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-sm">{content.footer.contact.phone}</p>
              <p className="text-sm">{content.footer.contact.email}</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>{content.footer.copyright.textMain}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
