import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  ShoppingCart, 
  PackageSearch,
  Percent,
  Truck,
  ShieldCheck,
  HeartHandshake,
  Clock,
  ArrowRight,
  Accessibility,
  X,
  ZoomIn,
  Eye,
  ArrowUp
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Элегантная цветовая палитра для премиум B2B
  const theme = {
    bgDark: highContrast ? 'bg-black' : 'bg-[#161412]',
    bgLight: highContrast ? 'bg-white' : 'bg-[#FDFCFB]',
    bgCardLight: highContrast ? 'bg-white' : 'bg-[#FFFFFF]',
    bgCardDark: highContrast ? 'bg-gray-900' : 'bg-[#1C1A18]',
    textDark: highContrast ? 'text-black' : 'text-[#2A2622]',
    textLight: highContrast ? 'text-white' : 'text-[#FDFCFB]',
    textMutedDark: highContrast ? 'text-gray-800' : 'text-[#8C847A]',
    textMutedLight: highContrast ? 'text-gray-300' : 'text-[#A89F93]',
    accent: highContrast ? 'text-yellow-600' : 'text-[#C9A265]',
    accentBg: highContrast ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-[#C9A265] hover:bg-[#B38D52] text-white',
    accentBorder: highContrast ? 'border-yellow-600' : 'border-[#C9A265]',
    borderLight: highContrast ? 'border-black' : 'border-[#EAE5DF]',
    borderDark: highContrast ? 'border-white' : 'border-[#2A2622]',
  };

  // Типографика (с учетом доступности)
  const typo = {
    base: largeText ? 'text-lg' : 'text-base',
    sm: largeText ? 'text-base' : 'text-sm',
    xs: largeText ? 'text-sm' : 'text-xs',
    h1: largeText ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl',
    h2: largeText ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl',
    h3: largeText ? 'text-xl md:text-2xl' : 'text-lg md:text-xl',
  };

  return (
    <div className={`min-h-screen font-sans ${theme.bgLight} ${theme.textDark} transition-colors duration-300`}>
      
      {/* TOP BANNER */}
      <div className={`w-full ${theme.bgLight} border-b ${theme.borderLight} py-2 text-center ${typo.xs} tracking-widest uppercase text-gray-500`}>
        B2B Wholesale Platform — <a href="#" className="underline hover:text-black transition-colors">Apply for wholesale access →</a>
      </div>

      {/* HEADER */}
      <header className={`sticky w-full top-0 z-50 transition-all duration-300 ${isScrolled ? `${theme.bgDark} shadow-lg py-3` : `${theme.bgDark} py-5`}`}>
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px] flex justify-between items-center">
          
          {/* Logo */}
          <div className={`font-serif text-xl md:text-2xl ${theme.textLight}`}>
            Leather Parfum Wholesale
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors border-b-2 ${theme.accentBorder} pb-1`}>
              HOME
            </a>

            {/* Dropdown Menu: PERFUMES */}
            <div className="relative group py-2">
              <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors flex items-center gap-1`}>
                PERFUMES
                <svg className="w-4 h-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </a>
              
              {/* Dropdown Panel */}
              <div className="absolute top-full -left-6 hidden group-hover:block w-64 pt-4 z-50">
                <div className={`bg-[#1C1A18] border border-[#2A2622] rounded-xl shadow-2xl py-3 flex flex-col backdrop-blur-md`}>
                  {['Men\'s Collection', 'Women\'s Collection', 'Unisex Fragrances', 'Oud Exclusives', 'Wholesale Sample Kits'].map((subItem) => (
                    <a key={subItem} href="#" className={`px-6 py-3 ${theme.textLight} hover:${theme.accent} hover:bg-white/5 ${typo.xs} tracking-widest transition-colors flex items-center gap-2`}>
                      <ArrowRight size={14} className="opacity-0 -ml-4 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
                      <span className="group/link">{subItem}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Dropdown Menu: LEATHER GOODS */}
            <div className="relative group py-2">
              <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors flex items-center gap-1`}>
                LEATHER GOODS
                <svg className="w-4 h-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </a>
              
              <div className="absolute top-full -left-6 hidden group-hover:block w-64 pt-4 z-50">
                <div className={`bg-[#1C1A18] border border-[#2A2622] rounded-xl shadow-2xl py-3 flex flex-col backdrop-blur-md`}>
                  {['Wallets & Purses', 'Classic Belts', 'Bags & Briefcases', 'Cardholders', 'Accessories'].map((subItem) => (
                    <a key={subItem} href="#" className={`px-6 py-3 ${theme.textLight} hover:${theme.accent} hover:bg-white/5 ${typo.xs} tracking-widest transition-colors flex items-center gap-2`}>
                      <ArrowRight size={14} className="opacity-0 -ml-4 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
                      <span className="group/link">{subItem}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {['GIFT SETS', 'PACKAGES', 'ABOUT', 'CONTACT'].map((item) => (
              <a key={item} href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors`}>
                {item}
              </a>
            ))}
          </nav>
          
          {/* Actions & Flags */}
          <div className="flex items-center gap-5">
            {/* Флаги возвращены к оригинальному прямоугольному дизайну со скриншота */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setLanguage('EN')} 
                className={`flex items-center justify-center w-11 h-8 rounded transition-all duration-300 ${language === 'EN' ? 'bg-[#C9A265] shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                title="English"
              >
                <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="EN" className="w-7 h-5 object-cover rounded-sm shadow-sm" />
              </button>
              <button 
                onClick={() => setLanguage('CZ')} 
                className={`flex items-center justify-center w-11 h-8 rounded transition-all duration-300 ${language === 'CZ' ? 'bg-[#C9A265] shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                title="Czech"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg" alt="CZ" className="w-7 h-5 object-cover rounded-sm shadow-sm" />
              </button>
              <button 
                onClick={() => setLanguage('VN')} 
                className={`flex items-center justify-center w-11 h-8 rounded transition-all duration-300 ${language === 'VN' ? 'bg-[#C9A265] shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                title="Vietnamese"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VN" className="w-7 h-5 object-cover rounded-sm shadow-sm" />
              </button>
            </div>

            <div className="flex items-center gap-4 ml-2">
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors`} aria-label="Search"><Search size={20} /></button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors flex items-center gap-2`} aria-label="Account">
                <User size={20} />
                <span className={`hidden md:block ${typo.xs} font-bold tracking-widest uppercase`}>Account</span>
              </button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors flex items-center gap-2`} aria-label="Cart">
                <div className="relative">
                  <ShoppingCart size={20} />
                  <span className={`absolute -top-2 -right-2 bg-[#C9A265] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full`}>1</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className={`${theme.bgDark} pt-24 pb-20 text-center px-4`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-6`}>
            Wholesale Platform
          </h2>
          <h1 className={`font-serif ${typo.h1} ${theme.textLight} mb-6 leading-tight`}>
            Where Scent Meets Craft
          </h1>
          <p className={`${theme.textMutedLight} ${typo.base} max-w-2xl mx-auto mb-10`}>
            Premium fragrances and handcrafted leather goods at wholesale prices. Built for your business.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button className={`${theme.accentBg} px-8 py-4 rounded font-bold ${typo.sm} tracking-widest uppercase flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform`}>
              BROWSE CATALOG <ArrowRight size={18} />
            </button>
            <button className={`bg-transparent border border-[#4A453E] ${theme.textLight} hover:bg-white hover:text-black px-8 py-4 rounded font-bold ${typo.sm} tracking-widest uppercase hover:-translate-y-1 transition-all`}>
              VIEW PACKAGES
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-[#2A2622] pt-12">
            <div>
              <div className={`font-serif ${typo.h2} ${theme.accent} mb-2`}>200+</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase`}>Products</div>
            </div>
            <div>
              <div className={`font-serif ${typo.h2} ${theme.accent} mb-2`}>50%</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase`}>Off Retail</div>
            </div>
            <div>
              <div className={`font-serif ${typo.h2} ${theme.accent} mb-2`}>24h</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase`}>Shipping</div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY (Исправлено: Картинки на фоне вместо уродливых пустых прямоугольников) */}
      <section className="py-24 container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-12">
          <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-4`}>Shop by category</h2>
          <h3 className={`font-serif ${typo.h2} ${theme.textDark}`}>Browse Our Catalog</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Perfumes', desc: 'ONLYYOU & ChatDor Inspired fragrances', count: '6 PRODUCTS', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80' },
            { title: 'Leather Goods', desc: 'Wallets, belts & accessories by Wild Things Only', count: '19 PRODUCTS', img: 'https://images.unsplash.com/photo-1628149462111-949466ebfa9b?auto=format&fit=crop&q=80' },
            { title: 'Gift Sets', desc: 'Curated bundles for every occasion', count: '3 PRODUCTS', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80' }
          ].map((cat, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-shadow">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Элегантный градиент чтобы текст читался */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                <span className={`${theme.accent} ${typo.xs} tracking-widest uppercase font-bold mb-3 opacity-90`}>{cat.count}</span>
                <h4 className={`font-serif ${typo.h2} text-white mb-2`}>{cat.title}</h4>
                <p className={`text-gray-300 ${typo.sm} mb-6`}>{cat.desc}</p>
                <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase group-hover:text-[#C9A265] transition-colors">
                  BROWSE <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* READY-MADE SOLUTIONS (Исправлена верстка "разваливающихся" карточек) */}
      <section className={`${theme.bgLight} py-24 border-t ${theme.borderLight}`}>
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-4`}>Business Packages</h2>
            <h3 className={`font-serif ${typo.h2} ${theme.textDark} mb-4`}>Ready-Made Solutions</h3>
            <p className={`${theme.textMutedDark} ${typo.base}`}>Start or expand your retail business with our curated product packages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PackageSearch, title: 'Launch Your Boutique', desc: '60 SKU starter kit with perfumes, wallets, belts and gift sets. Recommended display layout included.', skus: '60', discount: '15%', featured: true },
              { icon: Percent, title: 'Fragrance Corner', desc: '20 bestselling perfumes to add a fragrance section to your existing store.', skus: '20', discount: '10%', featured: false },
              { icon: Clock, title: 'Seasonal Refresh', desc: '30 SKU quarterly rotation. New arrivals and seasonal bestsellers.', skus: '30', discount: '12%', featured: false },
              { icon: Percent, title: 'Clearance Bundle', desc: '3 bestsellers + 1 bonus item at massive discount. Limited availability.', skus: '4', discount: '25%', featured: false }
            ].map((pkg, i) => (
              // Добавлена flex-структура для прижатия кнопок к низу, премиум карточка выделена фоном
              <div key={i} className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 hover:shadow-xl ${pkg.featured ? `ring-2 ring-[#C9A265] shadow-lg bg-[#FAF7F2]` : `${theme.bgCardLight} border ${theme.borderLight} shadow-sm`}`}>
                
                {pkg.featured && (
                  <div className={`absolute -top-3 right-6 ${theme.accentBg} px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-md`}>
                    Best Value
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${pkg.featured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                  <pkg.icon size={24} />
                </div>
                
                <h4 className={`font-serif ${typo.h3} ${theme.textDark} mb-3`}>{pkg.title}</h4>
                <p className={`${theme.textMutedDark} ${typo.sm} mb-8 flex-grow`}>{pkg.desc}</p>
                
                {/* Аккуратная сетка для статистики (SKUS / Discount) */}
                <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100 mt-auto">
                  <div>
                    <div className={`font-serif ${typo.h2} ${theme.textDark}`}>{pkg.skus}</div>
                    <div className={`${typo.xs} ${theme.textMutedDark} tracking-widest uppercase mt-1`}>SKUS</div>
                  </div>
                  <div>
                    <div className={`font-serif ${typo.h2} ${theme.accent}`}>{pkg.discount}</div>
                    <div className={`${typo.xs} ${theme.textMutedDark} tracking-widest uppercase mt-1`}>Discount</div>
                  </div>
                </div>

                <button className={`w-full py-4 mt-2 rounded font-bold ${typo.sm} tracking-widest uppercase transition-colors ${pkg.featured ? theme.accentBg : `bg-black text-white hover:bg-gray-800`}`}>
                  VIEW PACKAGE
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS (Исправлена путаница с ценами, добавлена логика B2B) */}
      <section className={`py-24 ${theme.bgLight} container mx-auto px-4 max-w-[1400px] border-t border-gray-100`}>
        <h3 className={`font-serif ${typo.h2} ${theme.textDark} mb-12`}>Bestsellers</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { title: 'VIP Gift Box', label: '[SAMPLE]', oldPrice: '3.710,00 CZK', price: '3.400,00 CZK', sale: true },
            { title: 'Gentleman\'s Edit Gift Set', label: '[SAMPLE]', oldPrice: '2.340,00 CZK', price: '2.190,00 CZK', sale: true },
            { title: 'Artisan Belt — Brown', label: '[SAMPLE]', price: '980,00 CZK' },
            { title: 'Heritage Wallet — Black', label: '[SAMPLE]', oldPrice: '1.690,00 CZK', price: '1.450,00 CZK', sale: true },
            { title: 'Amber Royale EDP 50ml', label: '[SAMPLE]', price: '1.280,00 CZK' },
            { title: 'Belle Eternelle EDP 50ml', label: '[SAMPLE]', price: '920,00 CZK' },
            { title: 'Noir Sauvage EDP 50ml', label: '[SAMPLE]', price: '890,00 CZK' },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col p-6 rounded-2xl ${theme.bgCardLight} border ${theme.borderLight} shadow-sm hover:shadow-md transition-shadow group relative`}>
              
              {/* Красивые бейджи */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {item.sale && <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded">Sale</span>}
                <span className="bg-[#C9A265] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded">Bestseller</span>
              </div>

              {/* Плейсхолдер картинки */}
              <div className="aspect-square bg-[#F4F2EF] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" alt="placeholder" className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              <div className="flex-col flex flex-grow">
                <h4 className={`${typo.base} font-bold ${theme.textDark} mb-1 leading-tight`}>
                  {item.title} <span className="font-normal text-gray-400 text-sm">{item.label}</span>
                </h4>
                
                {/* ИСПРАВЛЕННЫЙ БЛОК ЦЕН: Четкое разделение старой и новой цены */}
                <div className="mt-4 mb-6 flex items-center gap-3">
                  {item.oldPrice && (
                    <span className="line-through text-gray-400 font-medium text-sm">
                      {item.oldPrice}
                    </span>
                  )}
                  <span className={`font-serif text-xl ${item.sale ? 'text-[#C9A265]' : theme.textDark}`}>
                    {item.price}
                  </span>
                </div>

                {/* Поле количества B2B прижато к низу и объединено с кнопкой для монолитности */}
                <div className="mt-auto flex overflow-hidden rounded-lg shadow-sm border border-gray-200 focus-within:border-[#C9A265] focus-within:ring-1 focus-within:ring-[#C9A265] transition-all">
                   <div className="flex-shrink-0 w-16 bg-gray-50 border-r border-gray-200">
                      <input 
                        type="number" 
                        min="1" 
                        defaultValue="1" 
                        className={`w-full h-full py-3 text-center bg-transparent focus:outline-none ${theme.textDark} font-bold`}
                        aria-label="Quantity"
                      />
                   </div>
                  <button className={`flex-grow py-3 px-4 bg-black text-white hover:bg-[#C9A265] transition-colors ${typo.xs} uppercase tracking-widest font-bold`}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAST CHANCE STOCK (Избавились от гигантских пустых черных квадратов) */}
      <section className={`py-24 ${theme.bgDark} px-4 border-t border-[#2A2622]`}>
        <div className="container mx-auto max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className={`bg-[#A85A32] text-white inline-block px-4 py-1 rounded text-xs font-bold tracking-widest uppercase mb-6`}>Limited Availability</h2>
            <h3 className={`font-serif ${typo.h2} ${theme.textLight} mb-4`}>Last Chance Stock</h3>
            <p className={`${theme.textMutedLight} ${typo.base} max-w-2xl mx-auto`}>Clearance lines at exceptional wholesale prices. Stock is not replenished once sold.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { title: 'Heritage Wallet - Black', price: '950,00 CZK', oldPrice: '1.690,00 CZK', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80' },
              { title: 'Bleu Nuit EDT 100ml', price: '720,00 CZK', oldPrice: '1.280,00 CZK', img: 'https://images.unsplash.com/photo-1615397323287-21950dbcc975?auto=format&fit=crop&q=80' }
            ].map((item, i) => (
              // Горизонтальная карточка вместо гигантского квадрата
              <div key={i} className="flex flex-col sm:flex-row bg-[#1C1A18] rounded-2xl overflow-hidden border border-[#2A2622] hover:border-[#C9A265] transition-colors">
                <div className="w-full sm:w-2/5 aspect-square relative">
                  <div className="absolute top-4 left-4 bg-[#A85A32] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded z-10">Last Units</div>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <h4 className={`font-serif ${typo.h3} ${theme.textLight} mb-2`}>{item.title}</h4>
                  <div className="flex items-center gap-3 mb-8">
                     <span className="line-through text-gray-500 text-sm">{item.oldPrice}</span>
                     <span className={`font-serif text-2xl text-[#C9A265]`}>{item.price}</span>
                  </div>
                  <button className={`w-full sm:w-auto py-4 px-8 border border-white text-white hover:bg-white hover:text-black rounded font-bold ${typo.xs} uppercase tracking-widest transition-colors`}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <button className="text-white hover:text-[#C9A265] font-bold text-sm tracking-widest uppercase transition-colors inline-flex items-center gap-2">
                SEE ALL LAST CHANCE PRODUCTS <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* BUSINESS FEATURES (Сделали карточки аккуратнее, без лишней обводки) */}
      <section className={`${theme.bgDark} py-24 border-t border-[#1C1A18]`}>
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h2 className={`text-center ${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-4`}>Why Wholesale With Us</h2>
          <h3 className={`text-center font-serif ${typo.h2} ${theme.textLight} mb-4`}>Built for Your Business</h3>
          <p className={`text-center ${theme.textMutedLight} ${typo.base} mb-16`}>Everything you need to stock and sell premium fragrance and leather goods.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Percent, title: '50% Off Retail', desc: 'Wholesale pricing on every product. Volume discounts available.' },
              { icon: PackageSearch, title: 'Low MOQ', desc: 'Start with as few as 10-24 units per product.' },
              { icon: Truck, title: 'Fast Shipping', desc: 'CZ: 1-3 days. EU: 3-7 days. From our Prague warehouse.' },
              { icon: HeartHandshake, title: 'Dedicated Support', desc: 'Personal account manager for orders and questions.' }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-2xl bg-[#1C1A18] text-center group hover:-translate-y-1 transition-transform`}>
                <div className={`w-16 h-16 mx-auto rounded-full bg-black flex items-center justify-center mb-6 border border-[#2A2622] group-hover:border-[#C9A265] transition-colors`}>
                  <feature.icon size={28} className={theme.accent} />
                </div>
                <h4 className={`font-bold ${typo.base} ${theme.textLight} mb-3`}>{feature.title}</h4>
                <p className={`${theme.textMutedLight} ${typo.sm}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className={`${theme.accentBg} px-10 py-4 rounded font-bold ${typo.sm} tracking-widest uppercase hover:-translate-y-1 transition-transform`}>
              APPLY FOR WHOLESALE <ArrowRight size={18} className="inline ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`${theme.bgDark} pt-20 pb-10 border-t border-[#2A2622]`}>
        <div className="container mx-auto px-4 max-w-[1400px]">
          
          {/* Subscribe Banner */}
          <div className="max-w-xl mx-auto text-center mb-20">
             <h4 className={`${theme.accent} ${typo.xs} font-bold tracking-widest uppercase mb-6`}>SUBSCRIBE TO OUR EMAILS</h4>
             <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className={`flex-grow bg-transparent border border-[#4A453E] rounded-l px-4 py-3 text-white focus:outline-none focus:border-[#C9A265]`}
                />
                <button className={`px-6 bg-[#C9A265] text-white rounded-r hover:bg-[#B38D52] transition-colors`}>
                  <ArrowRight size={20} />
                </button>
             </div>
          </div>

          <div className={`pt-8 border-t border-[#2A2622] flex flex-col md:flex-row justify-between items-center gap-6`}>
            
            {/* Флаги в футере возвращены к оригинальному дизайну */}
            <div className="flex gap-3">
               <button onClick={() => setLanguage('EN')} className={`flex items-center justify-center w-10 h-7 rounded transition-all duration-300 ${language === 'EN' ? 'bg-[#C9A265]' : 'opacity-40 hover:opacity-100'}`}>
                 <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="EN" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
               </button>
               <button onClick={() => setLanguage('CZ')} className={`flex items-center justify-center w-10 h-7 rounded transition-all duration-300 ${language === 'CZ' ? 'bg-[#C9A265]' : 'opacity-40 hover:opacity-100'}`}>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg" alt="CZ" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
               </button>
               <button onClick={() => setLanguage('VN')} className={`flex items-center justify-center w-10 h-7 rounded transition-all duration-300 ${language === 'VN' ? 'bg-[#C9A265]' : 'opacity-40 hover:opacity-100'}`}>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VN" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
               </button>
            </div>

            <div className={`text-[#8C847A] ${typo.xs} flex flex-wrap justify-center gap-4`}>
              <span>© 2026, Leather Parfum Wholesale.</span>
              <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of service</a>
              <a href="#" className="hover:text-white transition-colors">Shipping policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#1C1A18] text-white border border-[#4A453E] shadow-xl z-40 transition-all duration-300 hover:bg-[#C9A265] hover:border-[#C9A265] ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={20} />
      </button>

      {/* Accessibility Widget (Крайне важно для аудитории 50+) */}
      <div className="fixed bottom-6 left-6 z-50">
        {showA11yMenu && (
          <div className="absolute bottom-16 left-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-[300px] mb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-bold text-black">Accessibility</h3>
              <button onClick={() => setShowA11yMenu(false)} className="text-gray-500 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-black font-medium mb-3">Text Size</p>
                <div className="flex gap-2">
                  <button onClick={() => setLargeText(false)} className={`flex-1 py-2 px-3 border rounded ${!largeText ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                    Normal
                  </button>
                  <button onClick={() => setLargeText(true)} className={`flex-1 py-2 px-3 border rounded flex items-center justify-center gap-2 ${largeText ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                    <ZoomIn size={18} /> Large
                  </button>
                </div>
              </div>

              <div>
                <p className="text-black font-medium mb-3">Contrast</p>
                <div className="flex gap-2">
                  <button onClick={() => setHighContrast(false)} className={`flex-1 py-2 px-3 border rounded ${!highContrast ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                    Standard
                  </button>
                  <button onClick={() => setHighContrast(true)} className={`flex-1 py-2 px-3 border rounded flex items-center justify-center gap-2 ${highContrast ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}>
                    <Eye size={18} /> High
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setShowA11yMenu(!showA11yMenu)}
          className={`p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 flex items-center justify-center transition-transform ${showA11yMenu ? 'scale-110' : ''}`}
        >
          <Accessibility size={24} />
        </button>
      </div>

    </div>
  );
};

export default App;