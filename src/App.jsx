import content from './content.json';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import Cart from './components/Cart';
import Auth from './components/Auth';
import ProductDetail from './components/ProductDetail';
import Payment from './components/Payment';

function AppContent() {
  // ─── State management for UI interactions
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showGoTop, setShowGoTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  
  const { addToCart, getCartCount, setIsCartOpen, clearCart } = useCart();
  const { setIsAuthModalOpen, user } = useAuth();

  // ─── Track scroll position for header shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── Filter products based on selected brand, search, price, and category
  const filteredProducts = content.products.items.filter((product) => {
    const matchesBrand = activeFilter === 'All' || product.brand === activeFilter;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = categoryFilter === 'All' || product.categories.includes(categoryFilter);
    
    return matchesBrand && matchesSearch && matchesPrice && matchesCategory;
  });

  // ─── Map service icon names to Lucide components
  const serviceIcons = {
    truck: Icons.Truck,
    'credit-card': Icons.CreditCard,
    'rotate-ccw': Icons.RotateCcw,
    headphones: Icons.Headphones,
  };

  // ─── Map social media icon names to Lucide components
  const socialIcons = {
    facebook: Icons.Facebook,
    twitter: Icons.Twitter,
    pinterest: Icons.Pin,
    linkedin: Icons.Linkedin,
  };

  // ─── Show go-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ────────────────────────────────────────────────── [ Site Header ] */}
      <header className={`fixed top-0 z-50 w-full bg-white transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          {/* ─── Site logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[26px] font-bold text-black cursor-pointer"
          >
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </button>

          {/* ─── Desktop navigation menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {content.header.menu.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  // Scroll to different sections based on menu item
                  if (item.label === 'Home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item.label === 'Store' || item.label === 'Collections') {
                    document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    alert(`${item.label} section coming soon!`);
                  }
                }}
                className="font-semibold text-gray-800 hover:text-rose-500 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* ─── Desktop action icons */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Icons.Search className="h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none w-32 text-sm"
              />
            </div>
            <button onClick={() => setIsAuthModalOpen(true)} className="relative group">
              <Icons.User className="h-5 w-5 cursor-pointer hover:text-rose-500" />
              {user && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block whitespace-nowrap text-sm">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-gray-600 text-xs">{user.email}</p>
                </div>
              )}
            </button>

            <button 
              onClick={() => {
                alert('Wishlist feature coming soon!');
              }}
              className="relative cursor-pointer"
            >
              <Icons.Heart className="h-5 w-5 hover:text-rose-500" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                {content.header.actions.wishlistCount}
              </span>
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2">
              <Icons.ShoppingBag className="h-5 w-5 cursor-pointer hover:text-rose-500" />
              <span className="text-sm font-medium text-rose-500">${(getCartCount() * 50).toFixed(2)}</span>
              {getCartCount() > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          {/* ─── Mobile menu toggle button */}
          <button
            className="lg:hidden rounded bg-rose-500 p-2 text-white cursor-pointer"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icons.Menu />
          </button>
        </div>

        {/* ─── Mobile menu overlay */}
        {menuOpen && <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMenuOpen(false)} />}

        {/* ─── Mobile slide-out menu */}
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-72 bg-white p-6 transition-transform ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            className="absolute right-4 top-4 cursor-pointer"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icons.X />
          </button>

          {/* ─── Mobile logo */}
          <button 
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[26px] font-bold text-black cursor-pointer"
          >
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </button>

          {/* ─── Mobile navigation links */}
          <nav className="mt-12 space-y-4">
            {content.header.menu.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMenuOpen(false);
                  // Scroll to different sections based on menu item
                  if (item.label === 'Home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item.label === 'Store' || item.label === 'Collections') {
                    document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    alert(`${item.label} section coming soon!`);
                  }
                }}
                className="block border-b py-2 font-semibold text-gray-800 hover:text-rose-500 cursor-pointer w-full text-left"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
      </header>

      {/* ────────────────────────────────────────────────── [ Hero Section ] */}
      <section
        className="flex min-h-125 xl:min-h-165 items-center bg-cover bg-center mt-20"
        style={{
          backgroundImage: `url(${content.hero.backgroundImage})`,
        }}
      >
        <div className="ml-[5%] sm:ml-[10%] 2xl:ml-[15%] max-w-7xl px-4">
          <h1 className="text-[40px] font-semibold leading-tight text-gray-900 md:text-5xl xl:text-6xl">
            {content.hero.titleLight}
            <span className="block font-bold text-rose-500">{content.hero.titleBold}</span>
          </h1>

          <p className="mt-4 max-w-107.5 xl:max-w-120 font-semibold leading-relaxed text-gray-600 xl:text-lg">
            {content.hero.description}
          </p>

          <button 
            className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-rose-500 px-6 py-3 text-sm xl:text-lg font-semibold text-white transition hover:bg-rose-600 hover:-translate-y-0.5"
            onClick={() => {
              // Scroll to products section
              document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {content.hero.buttonText}
            <Icons.ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Collection Section ] */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex gap-6 overflow-x-auto pb-6">
            {content.collection.map((item) => (
              <li key={item.title} className="min-w-full sm:min-w-[48%] lg:min-w-[32%]">
                <div
                  className="flex h-87.5 flex-col items-center justify-between bg-cover bg-center py-10"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                >
                  <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>

                  <button
                    onClick={() => {
                      // Scroll to products section
                      document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 border border-black px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white cursor-pointer"
                  >
                    Explore All
                    <Icons.ArrowRight size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Products Section ] */}
      <section id="products-section" className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-semibold text-gray-900">{content.products.title}</h2>

          {/* ─── Brand filter buttons */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {content.products.filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-2 text-sm font-medium cursor-pointer hover:shadow-xl transition ${
                  activeFilter === filter
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-rose-500'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* ─── Category and Price Filters */}
          <div className="mb-10 flex flex-wrap gap-6 justify-center">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Categories</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* ─── Product grid with hover actions */}
          <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="group relative overflow-hidden bg-gray-100">
                  {/* ─── Product image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-87.5 w-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  />

                  {/* ─── Product badge */}
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs text-white">
                      {product.badge}
                    </span>
                  )}

                  {/* ─── Quick action buttons */}
                  <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                    <button 
                      onClick={() => {
                        addToCart(product);
                        alert('Added to cart!');
                      }}
                      className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white transition"
                      title="Add to Cart"
                    >
                      <Icons.ShoppingCart size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        alert('Added to wishlist!');
                      }}
                      className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white transition" 
                      title="Add to Wishlist"
                    >
                      <Icons.Heart size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white transition" 
                      title="View Details"
                    >
                      <Icons.Eye size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        alert('Added to compare!');
                      }}
                      className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white transition" 
                      title="Compare"
                    >
                      <Icons.Repeat size={20} />
                    </button>
                  </div>
                </div>

                {/* ─── Product details */}
                <div className="mt-4 text-center">
                  <p className="mb-1 font-semibold text-rose-500">{product.categories.join(' / ')}</p>

                  <h3 className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-rose-500" onClick={() => setSelectedProduct(product)}>
                    {product.title}
                  </h3>

                  <p className="mt-1 font-semibold text-rose-500">
                    ${product.price.toFixed(2)}
                    <del className="ml-2 text-sm text-gray-400">${product.oldPrice.toFixed(2)}</del>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ CTA Section ] */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {content.cta.map((item) => (
              <div
                key={item.title}
                className="bg-cover bg-center px-6 py-12 text-center text-white md:text-left"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              >
                <p className="mb-3 font-semibold">{item.subtitle}</p>

                <h3 className="mb-5 text-2xl font-semibold leading-snug">{item.title}</h3>

                <button
                  onClick={() => {
                    // Scroll to products section
                    document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-semibold transition hover:border-rose-500 cursor-pointer"
                >
                  {item.buttonText}
                  <Icons.ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Special Section ] */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:flex md:gap-6">
          {/* ─── Left promotional banner */}
          <div
            className="flex min-h-127.5 flex-col items-center justify-between bg-cover bg-center px-6 py-6 text-white md:w-1/3 xl:w-[29%]"
            style={{
              backgroundImage: `url(${content.special.banner.image})`,
            }}
          >
            <h3 className="text-xl font-semibold">{content.special.banner.title}</h3>

            <button
              onClick={() => {
                // Scroll to products section
                document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-semibold transition hover:border-rose-500 cursor-pointer"
            >
              {content.special.banner.buttonText}
              <Icons.ArrowRight size={16} />
            </button>
          </div>

          {/* ─── Right products carousel */}
          <div className="mt-10 md:mt-0 md:w-2/3 xl:w-auto">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-[28px] font-semibold text-gray-900">{content.special.title}</h2>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <ul className="flex gap-6 overflow-x-auto pb-6">
              {content.special.products.map((product) => (
                <li key={product.id} className="min-w-[80%] sm:min-w-[45%] lg:min-w-[30%]">
                  <div className="group relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-87.5 w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />

                    {product.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs text-white">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                      <button 
                        onClick={() => {
                          addToCart(product);
                          alert('Added to cart!');
                        }}
                        className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white"
                        title="Add to Cart"
                      >
                        <Icons.ShoppingCart size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          alert('Added to wishlist!');
                        }}
                        className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white" 
                        title="Add to Wishlist"
                      >
                        <Icons.Heart size={20} />
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white" 
                        title="View Details"
                      >
                        <Icons.Eye size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          alert('Added to compare!');
                        }}
                        className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white" 
                        title="Compare"
                      >
                        <Icons.Repeat size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="mb-1 font-semibold text-rose-500">{product.categories.join(' / ')}</p>

                    <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>

                    <p className="mt-1 font-semibold text-rose-500">${product.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Service Section ] */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-wrap justify-center gap-12 xl:justify-between">
            {content.service.map((item) => {
              const Icon = serviceIcons[item.icon];

              return (
                <li key={item.title}>
                  <div className="flex items-center gap-4">
                    <div className="flex size-18 items-center justify-center rounded-full bg-rose-500 text-white">
                      <Icon size={33} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-[15px]">{item.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Instagram Section ] */}
      <section className="py-16">
        <ul className="flex overflow-x-auto">
          {content.instagram.map((item, index) => (
            <li
              key={index}
              className="group relative min-w-[33.33%] sm:min-w-[25%] md:min-w-[20%] lg:min-w-[16.66%] mb-4"
            >
              <img src={item.image} alt="Instagram post" className="aspect-square w-full object-cover" />

              <a
                href={item.link}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                aria-label="View on Instagram"
              >
                <Icons.Instagram className="text-white" size={36} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ────────────────────────────────────────────────── [ Site Footer ] */}
      <footer className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-16">
          {/* Brand */}
          <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b pb-8 md:flex-row">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[26px] font-bold cursor-pointer"
            >
              <span className="text-rose-500">{content.footer.brand.highlight1}</span>
              hoes
              <span className="text-rose-500">{content.footer.brand.highlight2}</span>
              ub
            </button>

            <ul className="flex gap-3">
              {content.footer.socials.map((item) => {
                const Icon = socialIcons[item.icon];
                return (
                  <li key={item.icon}>
                    <button
                      onClick={() => {
                        alert(`Opening ${item.icon} page...`);
                        // In a real app, this would open the social media link
                        // window.open(item.link, '_blank');
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded bg-gray-300 text-gray-700 transition hover:bg-rose-500 hover:text-white cursor-pointer"
                      aria-label={item.icon}
                    >
                      <Icon size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ─── Footer information grid */}
          <div className="gap-10 flex flex-wrap justify-between">
            {/* ─── Contact information */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>

              <p className="mb-3 flex items-start gap-2 text-sm text-gray-600 sm:max-w-50">
                <Icons.MapPin size={26} className="mt-1 text-rose-500" />
                {content.footer.contact.address}
              </p>

              <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <Icons.Phone size={16} className="text-rose-500" />
                {content.footer.contact.phone}
              </p>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Icons.Mail size={16} className="text-rose-500" />
                {content.footer.contact.email}
              </p>
            </div>

            {/* ─── Account links */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">My Account</h4>
              <ul className="space-y-2">
                {content.footer.accountLinks.map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => {
                        if (item === 'View Cart') {
                          setIsCartOpen(true);
                        } else if (item === 'My Account') {
                          setIsAuthModalOpen(true);
                        } else {
                          alert(`${item} feature coming soon!`);
                        }
                      }}
                      className="text-sm text-gray-600 hover:text-rose-500 cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Opening hours */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Opening Time</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {content.footer.openingTime.map((item) => (
                  <li key={item.day} className="flex gap-x-4">
                    <span>{item.day}</span>
                    <span>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Newsletter subscription */}
            <div className="sm:max-w-75">
              <h4 className="mb-4 text-lg font-semibold">Newsletter</h4>
              <p className="mb-4 text-sm text-gray-600">{content.footer.newsletter.text}</p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (email) {
                    alert(`Thank you for subscribing! We'll send updates to ${email}`);
                    e.target.reset();
                  }
                }}
                className="flex"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  required
                />
                <button type="submit" className="bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-400">
                  {content.footer.newsletter.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ─── Copyright notice */}
        <div className="bg-gray-900 py-4 text-center font-semibold text-white">
          {content.footer.copyright.textMain}
          <span className="text-rose-500 text-lg">{content.footer.copyright.textHighlight}</span>
          {content.footer.copyright.textEnd}
        </div>
      </footer>

      {/* ─── Scroll to top button */}
      {showGoTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Go to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-rose-500 text-white shadow-lg transition hover:bg-rose-400"
        >
          <Icons.ArrowUp size={20} />
        </button>
      )}

      {/* ─── Cart Component */}
      <Cart onCheckout={() => setIsPaymentOpen(true)} />

      {/* ─── Auth Modal Component */}
      <Auth />

      {/* ─── Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* ─── Payment Modal Component */}
      {isPaymentOpen && (
        <Payment 
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={(order) => {
            setOrderConfirmation(order);
            clearCart();
            // Show success message
            alert(`Order placed successfully! Order ID: ${order.orderId}`);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CartProvider>
  );
}
