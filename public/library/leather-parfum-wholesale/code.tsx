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
  ArrowUp,
  ChevronDown,
  Menu
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const theme = {
    bgDark: highContrast ? 'bg-black' : 'bg-[#121110]',
    bgLight: highContrast ? 'bg-white' : 'bg-[#FDFCFB]',
    bgCard: highContrast ? 'bg-white border-black' : 'bg-white border-[#EAE5DF]',
    textDark: highContrast ? 'text-black' : 'text-[#2A2622]',
    textLight: highContrast ? 'text-white' : 'text-[#FDFCFB]',
    accent: highContrast ? 'text-yellow-600' : 'text-[#C9A265]',
    accentBg: highContrast ? 'bg-yellow-600 text-white' : 'bg-[#C9A265] text-white',
    border: highContrast ? 'border-black' : 'border-[#EAE5DF]',
  };

  const typo = {
    base: largeText ? 'text-lg' : 'text-base',
    sm: largeText ? 'text-base' : 'text-sm',
    xs: largeText ? 'text-sm' : 'text-[11px]',
    h1: largeText ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl',
    h2: largeText ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl',
    h3: largeText ? 'text-xl md:text-2xl' : 'text-lg md:text-xl',
  };

  return (
    <div className={`min-h-screen selection:bg-[#C9A265] selection:text-white font-sans ${theme.bgLight} ${theme.textDark} transition-all duration-300`}>
      
      {/* ANNOUNCEMENT */}
      <div className={`w-full ${theme.bgLight} border-b ${theme.border} py-2.5 text-center ${typo.xs} tracking-[0.2em] uppercase font-bold text-gray-500`}>
        Prague Central Warehouse — <a href="#" className="underline hover:text-black transition-colors">Register for B2B pricing →</a>
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? `${theme.bgDark} shadow-2xl py-3` : `${theme.bgDark} py-6`}`}>
        <div className="container mx-auto px-6 max-w-[1440px] flex justify-between items-center">
          
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
             </button>
             <div className={`font-serif text-2xl md:text-3xl tracking-tight ${theme.textLight}`}>
               Leather<span className={theme.accent}>Parfum</span>
             </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {['Home', 'Perfumes', 'Leather Goods', 'Packages', 'Contact'].map((item) => (
              <div key={item} className="relative group cursor-pointer">
                <span className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 hover:${theme.accent} transition-colors`}>
                  {item}
                  {['Perfumes', 'Leather Goods'].includes(item) && <ChevronDown size={12} className="opacity-40" />}
                </span>
                <div className={`absolute -bottom-1 left-0 w-0 h-[1px] ${theme.accentBg} transition-all duration-300 group-hover:w-full`}></div>
              </div>
            ))}
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 border-r border-white/10 pr-6 mr-2">
              {[
                { id: 'EN', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg' },
                { id: 'CZ', flag: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg' },
                { id: 'VN', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg' }
              ].map((lang) => (
                <button 
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)} 
                  className={`w-8 h-5 overflow-hidden rounded-sm transition-all ${language === lang.id ? 'ring-2 ring-[#C9A265] scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                  <img src={lang.flag} alt={lang.id} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors`}><Search size={20} /></button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors flex items-center gap-2`}>
                <User size={20} />
                <span className={`hidden md:block ${typo.xs} font-bold tracking-widest uppercase`}>Portal</span>
              </button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors relative`}>
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#C9A265] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={`${theme.bgDark} relative overflow-hidden pt-32 pb-40`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A265] filter blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.4em] uppercase mb-8`}>
            Official B2B Distribution
          </h2>
          <h1 className={`font-serif ${typo.h1} ${theme.textLight} mb-8 leading-[1.1] tracking-tight`}>
            Premium Essence <br/> & Master Craft
          </h1>
          <p className={`${theme.textMutedLight} ${typo.base} max-w-2xl mx-auto mb-12 text-gray-400 font-light leading-relaxed`}>
            Direct wholesale access to exclusive perfume collections and artisan leather goods. 
            Optimized for European retailers and boutique owners.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className={`${theme.accentBg} px-10 py-5 rounded-sm font-bold ${typo.xs} tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-[#B38D52] transition-all transform hover:-translate-y-1 shadow-xl`}>
              Catalog Access <ArrowRight size={16} />
            </button>
            <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-sm font-bold ${typo.xs} tracking-[0.2em] uppercase hover:bg-white/10 transition-all transform hover:-translate-y-1">
              Wholesale Terms
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-32 container mx-auto px-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.3em] uppercase mb-4`}>Market Segments</h2>
            <h3 className={`font-serif ${typo.h2} ${theme.textDark}`}>Curated Wholesale Collections</h3>
          </div>
          <button className={`pb-2 border-b-2 ${theme.border} ${typo.xs} font-bold tracking-widest uppercase hover:border-[#C9A265] transition-colors`}>
            View All Categories
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Fine Fragrances', desc: 'ONLYYOU & ChatDor Licensed Series', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', count: '142 SKU' },
            { title: 'Artisan Leather', desc: 'Handcrafted Wild Things Only series', img: 'https://images.unsplash.com/photo-1628149462111-949466ebfa9b?auto=format&fit=crop&q=80', count: '86 SKU' },
            { title: 'Corporate Gifts', desc: 'Customizable luxury gift sets', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80', count: '12 SKU' }
          ].map((cat, i) => (
            <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer shadow-2xl">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className={`${theme.accent} ${typo.xs} font-bold tracking-widest uppercase mb-3`}>{cat.count}</p>
                <h4 className={`font-serif text-3xl text-white mb-4`}>{cat.title}</h4>
                <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.desc}</p>
                <div className="flex items-center gap-2 text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                  Explore <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BESTSELLERS GRID */}
      <section className={`py-32 ${theme.bgLight} border-t ${theme.border}`}>
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="mb-16 text-center">
            <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.3em] uppercase mb-4`}>Stock Performance</h2>
            <h3 className={`font-serif ${typo.h2} ${theme.textDark}`}>Retail Bestsellers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Oud Noir EDP', category: 'Perfume', price: '890 CZK', oldPrice: '1.200 CZK', badge: 'High Margin', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80' },
              { title: 'Classic Bifold', category: 'Leather', price: '450 CZK', badge: 'Top Seller', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80' },
              { title: 'Silk Blossom', category: 'Perfume', price: '720 CZK', oldPrice: '950 CZK', badge: 'New', img: 'https://images.unsplash.com/photo-1544467328-345179a4573b?auto=format&fit=crop&q=80' },
              { title: 'Business Belt', category: 'Leather', price: '380 CZK', badge: 'Restocked', img: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80' }
            ].map((item, i) => (
              <div key={i} className={`group ${theme.bgCard} p-5 border rounded-sm hover:shadow-2xl transition-all duration-500`}>
                <div className="relative aspect-square overflow-hidden mb-6 bg-[#F4F2EF]">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">{item.category}</span>
                    <span className="bg-[#C9A265] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">{item.badge}</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className={`font-serif text-xl ${theme.accent}`}>{item.price}</span>
                  {item.oldPrice && <span className="text-gray-400 text-sm line-through">{item.oldPrice}</span>}
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3 bg-gray-50 border border-gray-200 rounded-sm">
                    <input type="number" defaultValue="12" min="12" className="w-full h-full text-center bg-transparent py-3 text-sm font-bold focus:outline-none" />
                  </div>
                  <button className="flex-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-[#C9A265] transition-colors rounded-sm">
                    Bulk Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROP */}
      <section className={`${theme.bgDark} py-32`}>
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Percent, title: 'B2B Pricing', desc: 'Tiered discounts based on volume.' },
              { icon: Truck, title: 'EU Logistics', desc: 'Daily shipping from Prague warehouse.' },
              { icon: ShieldCheck, title: 'Certified', desc: '100% authentic licensed production.' },
              { icon: HeartHandshake, title: 'Support', desc: 'Personal manager for every account.' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-white/10 flex items-center justify-center text-[#C9A265] group-hover:bg-[#C9A265] group-hover:text-white transition-all duration-500">
                  <item.icon size={24} />
                </div>
                <h5 className="text-white font-bold mb-3 tracking-widest uppercase text-sm">{item.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`${theme.bgDark} pt-24 pb-12 border-t border-white/5`}>
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-2">
              <div className="font-serif text-3xl text-white mb-8">Leather<span className={theme.accent}>Parfum</span></div>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                Strategic partner for retail businesses across Europe. Premium quality, competitive margins, and reliable delivery.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'LinkedIn'].map(s => (
                  <a key={s} href="#" className="text-gray-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h6 className="text-white font-bold tracking-[0.2em] uppercase text-xs mb-8">Company</h6>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Wholesale Portal</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Press Inquiries</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-white font-bold tracking-[0.2em] uppercase text-xs mb-8">Service</h6>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Returns & Claims</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-[#C9A265] transition-colors">Terms of Trade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-[10px] tracking-widest uppercase">© 2026 Leather Parfum s.r.o. All Rights Reserved.</p>
            <div className="flex items-center gap-8">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-20 hover:opacity-100 transition-opacity" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-20 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </footer>

      {/* ACCESSIBILITY FLOATER */}
      <div className="fixed bottom-8 left-8 z-[100]">
        {showA11yMenu && (
          <div className="absolute bottom-16 left-0 w-80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8">
               <h4 className="font-serif text-xl">Preferences</h4>
               <button onClick={() => setShowA11yMenu(false)} className="text-gray-400 hover:text-black transition-colors"><X size={20}/></button>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-4">Reading Comfort</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setLargeText(false)} 
                    className={`py-3 rounded-lg border transition-all ${!largeText ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setLargeText(true)} 
                    className={`py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${largeText ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    <ZoomIn size={16}/> Large
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-4">Visual Clarity</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setHighContrast(false)} 
                    className={`py-3 rounded-lg border transition-all ${!highContrast ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    Natural
                  </button>
                  <button 
                    onClick={() => setHighContrast(true)} 
                    className={`py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${highContrast ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                  >
                    <Eye size={16}/> Contrast
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowA11yMenu(!showA11yMenu)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-300"
          aria-label="Accessibility Settings"
        >
          <Accessibility size={28} />
        </button>
      </div>

      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#C9A265] transition-all duration-500 transform ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
};

export default App;