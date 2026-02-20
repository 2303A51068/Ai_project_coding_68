import content from './content.json';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function App() {
  // ─── State management for UI interactions
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showGoTop, setShowGoTop] = useState(false);

  // ─── Track scroll position for header shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ─── Filter products based on selected brand
  const filteredProducts =
    activeFilter === 'All'
      ? content.products.items
      : content.products.items.filter((product) => product.brand === activeFilter);

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
          <a href="#" className="text-[26px] font-bold text-black">
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </a>

          {/* ─── Desktop navigation menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {content.header.menu.map((item) => (
              <a key={item.label} href={item.href} className="font-semibold text-gray-800 hover:text-rose-500">
                {item.label}
              </a>
            ))}
          </nav>

          {/* ─── Desktop action icons */}
          <div className="hidden lg:flex items-center gap-5">
            <Icons.Search className="h-5 w-5 cursor-pointer" />
            <Icons.User className="h-5 w-5 cursor-pointer" />

            <div className="relative">
              <Icons.Heart className="h-5 w-5 cursor-pointer" />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                {content.header.actions.wishlistCount}
              </span>
            </div>

            <div className="relative flex items-center gap-2">
              <Icons.ShoppingBag className="h-5 w-5 cursor-pointer" />
              <span className="text-sm font-medium text-rose-500">${content.header.actions.cartTotal.toFixed(2)}</span>
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                {content.header.actions.cartCount}
              </span>
            </div>
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
          <a href="#" className="text-[26px] font-bold text-black">
            <span className="text-rose-500">{content.header.logo.textHighlight1}</span>
            {content.header.logo.textMain}
            <span className="text-rose-500">{content.header.logo.textHighlight2}</span>
            {content.header.logo.textEnd}
          </a>

          {/* ─── Mobile navigation links */}
          <nav className="mt-12 space-y-4">
            {content.header.menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block border-b py-2 font-semibold text-gray-800 hover:text-rose-500"
              >
                {item.label}
              </a>
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

          <button className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-rose-500 px-6 py-3 text-sm xl:text-lg font-semibold text-white transition hover:bg-rose-600 hover:-translate-y-0.5">
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

                  <a
                    href={item.link}
                    className="inline-flex items-center gap-2 border border-black px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                  >
                    Explore All
                    <Icons.ArrowRight size={16} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────────────────────────────────────────── [ Products Section ] */}
      <section className="py-16">
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

          {/* ─── Product grid with hover actions */}
          <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="group relative overflow-hidden bg-gray-100">
                  {/* ─── Product image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-87.5 w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* ─── Product badge */}
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs text-white">
                      {product.badge}
                    </span>
                  )}

                  {/* ─── Quick action buttons */}
                  <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                    <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                      <Icons.ShoppingCart size={20} />
                    </button>
                    <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                      <Icons.Heart size={20} />
                    </button>
                    <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                      <Icons.Eye size={20} />
                    </button>
                    <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                      <Icons.Repeat size={20} />
                    </button>
                  </div>
                </div>

                {/* ─── Product details */}
                <div className="mt-4 text-center">
                  <p className="mb-1 font-semibold text-rose-500">{product.categories.join(' / ')}</p>

                  <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>

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

                <a
                  href={item.link}
                  className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-semibold transition hover:border-rose-500"
                >
                  {item.buttonText}
                  <Icons.ArrowRight size={16} />
                </a>
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

            <a
              href={content.special.banner.link}
              className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm font-semibold transition hover:border-rose-500"
            >
              {content.special.banner.buttonText}
              <Icons.ArrowRight size={16} />
            </a>
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
                      <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                        <Icons.ShoppingCart size={20} />
                      </button>
                      <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                        <Icons.Heart size={20} />
                      </button>
                      <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
                        <Icons.Eye size={20} />
                      </button>
                      <button className="rounded-full text-rose-500 bg-white p-3 hover:bg-rose-500 hover:text-white">
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
            <a href="#" className="text-[26px] font-bold">
              <span className="text-rose-500">{content.footer.brand.highlight1}</span>
              hoes
              <span className="text-rose-500">{content.footer.brand.highlight2}</span>
              ub
            </a>

            <ul className="flex gap-3">
              {content.footer.socials.map((item) => {
                const Icon = socialIcons[item.icon];
                return (
                  <li key={item.icon}>
                    <a
                      href={item.link}
                      className="flex h-10 w-10 items-center justify-center rounded bg-gray-300 text-gray-700 transition hover:bg-rose-500 hover:text-white"
                      aria-label={item.icon}
                    >
                      <Icon size={18} />
                    </a>
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
                    <a href="#" className="text-sm text-gray-600 hover:text-rose-500">
                      {item}
                    </a>
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

              <form className="flex">
                <input
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
    </>
  );
}
