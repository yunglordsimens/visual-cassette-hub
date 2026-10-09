import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, User, ShoppingBag, Phone, Accessibility, X, Type, Contrast, 
  Link as LinkIcon, Menu, ChevronDown, CheckCircle2, Package, Clock, 
  Percent, Image as ImageIcon, Lock, ShieldCheck, MapPin, Sparkles, Star,
  Globe, ChevronUp
} from 'lucide-react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  
  // Language Flag Mapping
  const langFlags = {
    'EN': '🇬🇧',
    'CS': '🇨🇿',
    'VI': '🇻🇳'
  };

  // Scroll to Top State
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 500) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  // Accessibility State
  const [a11yOpen, setA11yOpen] = useState(false);
  const [textSize, setTextSize] = useState('standard'); // 'small', 'standard', 'large'
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);

  // --- DYNAMIC ACCESSIBILITY CLASSES ---
  const getBodyTextSize = () => {
    switch(textSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg md:text-xl';
      default: return 'text-base';
    }
  };

  const getHeadingSize = (baseClass, largeClass) => {
    return textSize === 'large' ? largeClass : baseClass;
  };

  const appClasses = `min-h-screen font-sans transition-all duration-300 ease-in-out flex flex-col ${highContrast ? 'bg-white text-black' : 'bg-[#FAFAF9] text-stone-900'}`;
  const linkClasses = highlightLinks ? 'underline decoration-2 underline-offset-4 font-bold' : '';
  const btnClasses = highContrast 
    ? 'bg-black text-white hover:bg-stone-800 border-2 border-black' 
    : 'bg-stone-900 text-white hover:bg-amber-700 shadow-md transition-colors duration-300';
  const cardClasses = highContrast 
    ? 'bg-white border-4 border-black' 
    : 'bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300';

  return (
    <div className={appClasses}>
      
      {/* --- ACCESSIBILITY PANEL --- */}
      <div className={`fixed inset-y-0 right-0 w-80 md:w-96 bg-stone-900 text-white z-[100] transform transition-transform duration-300 shadow-2xl ${a11yOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-stone-800">
          <h2 className="text-xl font-bold flex items-center gap-2"><Accessibility className="w-6 h-6 text-amber-500" /> Accessibility</h2>
          <button onClick={() => setA11yOpen(false)} className="p-2 hover:bg-stone-800 rounded-md transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-8">
          {/* Text Size Control */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-stone-300 mb-4 flex items-center gap-3"><Type className="w-5 h-5"/> Text Size</h3>
            <div className="flex flex-col gap-2 bg-stone-800 rounded-xl p-2 font-bold">
              <button onClick={() => setTextSize('small')} className={`w-full py-3 rounded-lg transition-colors ${textSize === 'small' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}>Small</button>
              <button onClick={() => setTextSize('standard')} className={`w-full py-3 rounded-lg transition-colors ${textSize === 'standard' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}>Standard</button>
              <button onClick={() => setTextSize('large')} className={`w-full py-3 rounded-lg transition-colors ${textSize === 'large' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}>Large</button>
            </div>
          </div>
          {/* Contrast Control */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-stone-300 mb-4 flex items-center gap-3"><Contrast className="w-5 h-5"/> Contrast</h3>
            <label className="flex items-center justify-between cursor-pointer bg-stone-800 p-5 rounded-xl font-bold hover:bg-stone-700 transition-colors">
              <span>High Contrast (B/W)</span>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${highContrast ? 'bg-amber-500' : 'bg-stone-600'}`}>
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : ''}`}></div>
              </div>
              <input type="checkbox" className="hidden" checked={highContrast} onChange={() => setHighContrast(!highContrast)}/>
            </label>
          </div>
          {/* Links Control */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-stone-300 mb-4 flex items-center gap-3"><LinkIcon className="w-5 h-5"/> Navigation</h3>
            <label className="flex items-center justify-between cursor-pointer bg-stone-800 p-5 rounded-xl font-bold hover:bg-stone-700 transition-colors">
              <span>Highlight Links</span>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${highlightLinks ? 'bg-amber-500' : 'bg-stone-600'}`}>
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${highlightLinks ? 'translate-x-6' : ''}`}></div>
              </div>
              <input type="checkbox" className="hidden" checked={highlightLinks} onChange={() => setHighlightLinks(!highlightLinks)}/>
            </label>
          </div>
        </div>
      </div>
      {a11yOpen && <div className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm transition-opacity" onClick={() => setA11yOpen(false)}></div>}

      {/* --- TOP B2B NOTIFICATION --- */}
      <div className={`py-2.5 text-center text-xs font-bold uppercase tracking-[0.2em] ${highContrast ? 'bg-black text-white border-b-2 border-white' : 'bg-amber-800 text-amber-50'}`}>
        For verified wholesale partners only
      </div>

      {/* --- HEADER --- */}
      <header className={`sticky top-0 z-50 transition-colors ${highContrast ? 'bg-white border-black border-b-4' : 'bg-white border-b border-stone-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}><Menu className="w-8 h-8" /></button>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold cursor-pointer">Leather Parfum</h1>
            
            <nav className="hidden lg:flex items-center gap-8 font-bold h-24 text-sm uppercase tracking-wider">
              <button className={`text-amber-700 transition-colors ${linkClasses}`}>Home</button>
              
              {/* Mega Menu Trigger */}
              <div className="relative h-full flex items-center cursor-pointer group" onMouseEnter={() => setActiveMegaMenu('catalog')} onMouseLeave={() => setActiveMegaMenu(null)}>
                <button className={`flex items-center gap-1 hover:text-amber-700 transition-colors ${linkClasses}`}>
                  Catalog <ChevronDown className="w-5 h-5"/>
                </button>
                
                {/* Mega Menu Dropdown */}
                {activeMegaMenu === 'catalog' && (
                  <div className={`absolute top-24 left-0 w-[700px] rounded-b-2xl p-10 grid grid-cols-2 gap-12 shadow-2xl cursor-default ${highContrast ? 'bg-white border-4 border-t-0 border-black' : 'bg-white border border-t-0 border-stone-200'}`}>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-stone-200 text-stone-900">Perfumes</h3>
                      <ul className="space-y-4 text-base normal-case tracking-normal font-medium text-stone-600">
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>All Fragrances</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Women's Collection</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Men's Collection</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Unisex</a></li>
                        <li className="pt-2"><a href="#" className={`text-amber-700 flex items-center gap-2 ${linkClasses}`}><Sparkles className="w-4 h-4"/> Tester Sets (B2B)</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-stone-200 text-stone-900">Leather Goods</h3>
                      <ul className="space-y-4 text-base normal-case tracking-normal font-medium text-stone-600">
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>All Leather Goods</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Premium Belts</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Wallets & Purses</a></li>
                        <li><a href="#" className={`hover:text-amber-700 ${linkClasses}`}>Cardholders</a></li>
                      </ul>
                    </div>
                    <div className="col-span-2 pt-6 mt-2 border-t border-stone-100">
                      <button className={`w-full py-4 text-center text-sm font-bold uppercase tracking-widest rounded-xl ${highContrast ? 'bg-black text-white' : 'bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors'}`}>
                        View Full Catalog
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className={`hover:text-amber-700 transition-colors ${linkClasses}`}>Wholesale Packages</button>
              <button className={`hover:text-amber-700 transition-colors ${linkClasses}`}>Contact</button>
            </nav>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Language Switcher */}
            <div className="relative hidden md:block" onMouseEnter={() => setLangMenuOpen(true)} onMouseLeave={() => setLangMenuOpen(false)}>
              <button className={`flex items-center gap-1.5 font-bold text-sm uppercase tracking-wider p-2 hover:text-amber-700 transition-colors ${linkClasses}`}>
                <span className="text-lg leading-none">{langFlags[currentLang]}</span> {currentLang} <ChevronDown className="w-4 h-4"/>
              </button>
              {langMenuOpen && (
                <div className={`absolute top-full right-0 mt-2 w-32 rounded-xl shadow-lg overflow-hidden ${highContrast ? 'bg-white border-4 border-black' : 'bg-white border border-stone-200'}`}>
                  <button onClick={() => setCurrentLang('EN')} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-100 transition-colors flex items-center justify-between">English <span>🇬🇧</span></button>
                  <button onClick={() => setCurrentLang('CS')} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-100 transition-colors flex items-center justify-between">Čeština <span>🇨🇿</span></button>
                  <button onClick={() => setCurrentLang('VI')} className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-stone-100 transition-colors flex items-center justify-between">Tiếng Việt <span>🇻🇳</span></button>
                </div>
              )}
            </div>

            <button onClick={() => setA11yOpen(true)} className={`p-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 font-bold ${highContrast ? 'border-2 border-black hover:bg-gray-100' : 'bg-stone-100 hover:bg-stone-200 transition-colors'}`}>
              <Accessibility className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
            <div className={`w-px h-8 hidden md:block ${highContrast ? 'bg-black' : 'bg-stone-300'}`}></div>
            <button className={`hidden sm:flex items-center gap-2 font-bold hover:text-amber-700 transition-colors text-sm uppercase tracking-wider ${linkClasses}`}>
              <User className="w-5 h-5" /> <span className="hidden xl:inline">Log In</span>
            </button>
            <button className={`relative p-2 font-bold hover:text-amber-700 transition-colors ${linkClasses}`}>
              <ShoppingBag className="w-7 h-7 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section className={`${highContrast ? 'bg-white border-b-4 border-black' : 'bg-stone-900'} relative overflow-hidden`}>
          {!highContrast && (
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          )}
          
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className={`inline-flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-widest text-xs rounded-md mb-8 ${highContrast ? 'bg-black text-white border border-black' : 'bg-stone-800 text-amber-500'}`}>
                <Star className="w-4 h-4 fill-current" /> B2B Partnership
              </div>
              
              <h2 className={`font-serif ${getHeadingSize('text-5xl md:text-6xl lg:text-7xl', 'text-6xl md:text-7xl lg:text-8xl')} leading-[1.1] mb-8 ${highContrast ? 'text-black font-black' : 'text-white'}`}>
                Your trusted supplier of niche perfumery.
              </h2>
              
              <p className={`mb-12 max-w-xl ${getBodyTextSize()} ${highContrast ? 'text-black font-medium' : 'text-stone-300'}`}>
                Official portal for boutique owners. Recommended retail markup from 100%, dispatch from our Prague warehouse in 24 hours. Catalog access is restricted to verified partners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className={`px-8 py-5 rounded-xl font-bold flex items-center justify-center gap-3 text-lg ${btnClasses}`}>
                  Apply for Partnership <ArrowRight className="w-5 h-5" />
                </button>
                <button className={`px-8 py-5 rounded-xl font-bold flex items-center justify-center text-lg ${highContrast ? 'border-4 border-black text-black hover:bg-black hover:text-white' : 'border border-stone-600 text-white hover:bg-stone-800 transition-colors'}`}>
                  Log in to portal
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className={`relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden ${highContrast ? 'border-4 border-black bg-white' : 'bg-stone-800 shadow-2xl'}`}>
                 <div className="absolute inset-0 flex items-center justify-center flex-col gap-6">
                    <ImageIcon className={`w-24 h-24 ${highContrast ? 'text-black' : 'text-stone-600'}`} strokeWidth={1} />
                    <span className={`font-bold uppercase tracking-widest text-sm border-b pb-2 ${highContrast ? 'text-black border-black' : 'text-stone-500 border-stone-600'}`}>
                      L.P. Wholesale
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRUST BAR (B2B PREFERENCES) --- */}
        <section className={`border-b ${highContrast ? 'border-black border-b-4' : 'border-stone-200 bg-white'} py-16`}>
          <div className="max-w-7xl mx-auto px-6">
            <h3 className={`text-center font-bold uppercase tracking-widest text-sm mb-12 ${highContrast ? 'text-black' : 'text-stone-400'}`}>Why 200+ stores work with us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              
              <div className="flex flex-col items-center text-center pt-6 md:pt-0 md:px-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${highContrast ? 'border-4 border-black' : 'bg-amber-50'}`}>
                  <Percent className={`w-8 h-8 ${highContrast ? 'text-black' : 'text-amber-700'}`} />
                </div>
                <h4 className={`font-serif ${getHeadingSize('text-2xl', 'text-3xl')} font-bold mb-3`}>High Margin</h4>
                <p className={`${getBodyTextSize()} ${highContrast ? 'font-medium' : 'text-stone-600'}`}>
                  Special wholesale pricing allows for a retail markup of 100% to 150%, ensuring rapid return on investment.
                </p>
              </div>

              <div className="flex flex-col items-center text-center pt-10 md:pt-0 md:px-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${highContrast ? 'border-4 border-black' : 'bg-amber-50'}`}>
                  <Clock className={`w-8 h-8 ${highContrast ? 'text-black' : 'text-amber-700'}`} />
                </div>
                <h4 className={`font-serif ${getHeadingSize('text-2xl', 'text-3xl')} font-bold mb-3`}>Fast Shipping</h4>
                <p className={`${getBodyTextSize()} ${highContrast ? 'font-medium' : 'text-stone-600'}`}>
                  Our central warehouse is located in Prague. We assemble and dispatch confirmed orders within 1 business day.
                </p>
              </div>

              <div className="flex flex-col items-center text-center pt-10 md:pt-0 md:px-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${highContrast ? 'border-4 border-black' : 'bg-amber-50'}`}>
                  <Package className={`w-8 h-8 ${highContrast ? 'text-black' : 'text-amber-700'}`} />
                </div>
                <h4 className={`font-serif ${getHeadingSize('text-2xl', 'text-3xl')} font-bold mb-3`}>Flexible Orders</h4>
                <p className={`${getBodyTextSize()} ${highContrast ? 'font-medium' : 'text-stone-600'}`}>
                  We don't force massive bulk purchases. Our Minimum Order Quantity (MOQ) is tailored for easy and frequent restocking.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- GIANT CATALOG BUTTONS --- */}
        <section className={`py-24 ${highContrast ? 'bg-white border-b-4 border-black' : 'bg-stone-50 border-b border-stone-200'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className={`font-bold uppercase tracking-widest text-sm mb-4 block ${highContrast ? 'text-black' : 'text-amber-700'}`}>Our Collections</span>
              <h2 className={`font-serif ${getHeadingSize('text-4xl md:text-5xl', 'text-5xl md:text-6xl')} font-bold`}>
                Explore the Catalog
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Category: Perfumes */}
              <div className={`${cardClasses} p-10 md:p-16 rounded-3xl flex flex-col items-center text-center group`}>
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 ${highContrast ? 'border-4 border-black bg-white' : 'bg-stone-100 border border-stone-200'}`}>
                  <ImageIcon className={`w-12 h-12 ${highContrast ? 'text-black' : 'text-stone-400'}`} strokeWidth={1.5} />
                </div>
                <h3 className={`font-serif ${getHeadingSize('text-3xl', 'text-4xl')} font-bold mb-6`}>Perfumes</h3>
                <p className={`${getBodyTextSize()} mb-12 opacity-80 max-w-sm`}>
                  Premium men's, women's, and unisex fragrances. Available in 50ml, 100ml retail formats and B2B tester sets.
                </p>
                <button className={`w-full mt-auto py-5 text-xl font-bold rounded-xl flex items-center justify-center gap-3 transition-colors ${btnClasses}`}>
                  Browse Perfumes <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              {/* Category: Leather Goods */}
              <div className={`${cardClasses} p-10 md:p-16 rounded-3xl flex flex-col items-center text-center group`}>
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 ${highContrast ? 'border-4 border-black bg-white' : 'bg-stone-100 border border-stone-200'}`}>
                  <Package className={`w-12 h-12 ${highContrast ? 'text-black' : 'text-stone-400'}`} strokeWidth={1.5} />
                </div>
                <h3 className={`font-serif ${getHeadingSize('text-3xl', 'text-4xl')} font-bold mb-6`}>Leather Goods</h3>
                <p className={`${getBodyTextSize()} mb-12 opacity-80 max-w-sm`}>
                  Handcrafted belts, wallets, and cardholders made from premium leather. The perfect high-margin cross-sell items.
                </p>
                <button className={`w-full mt-auto py-5 text-xl font-bold rounded-xl flex items-center justify-center gap-3 transition-colors ${btnClasses}`}>
                  Browse Leather <ArrowRight className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* --- EDITORIAL BLOCK (Heritage/Quality) --- */}
        <section className={`py-24 ${highContrast ? 'bg-white' : 'bg-white'} overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`font-serif ${getHeadingSize('text-4xl md:text-5xl', 'text-5xl md:text-6xl')} font-bold mb-8`}>
                Made to be a bestseller.
              </h2>
              <div className={`space-y-6 ${getBodyTextSize()} ${highContrast ? 'font-medium' : 'text-stone-600'}`}>
                <p>
                  Leather Parfum is more than just fragrance. It is an anchor product for your retail business. We use the highest quality ingredients to create lasting, memorable compositions that keep clients coming back.
                </p>
                <p>
                  Every bottle and leather item comes in premium packaging designed to look stunning on the shelves of boutiques and concept stores. We provide our partners with all necessary marketing materials for visual merchandising.
                </p>
              </div>
              <ul className="mt-10 space-y-4">
                <li className="flex items-center gap-3 font-bold text-lg"><CheckCircle2 className="w-6 h-6 text-green-600"/> European quality certification</li>
                <li className="flex items-center gap-3 font-bold text-lg"><CheckCircle2 className="w-6 h-6 text-green-600"/> Full-size testers for retail partners</li>
              </ul>
            </div>
            <div className="relative h-[400px] md:h-[600px] w-full">
               <div className={`absolute inset-0 rounded-2xl flex items-center justify-center z-10 ${highContrast ? 'border-4 border-black bg-white' : 'bg-stone-100 border border-stone-200'}`}>
                  <ImageIcon className="w-16 h-16 text-stone-400" />
               </div>
               {!highContrast && <div className="absolute top-8 left-8 w-full h-full bg-amber-700/10 rounded-2xl z-0"></div>}
            </div>
          </div>
        </section>

        {/* --- WHOLESALE PACKAGES --- */}
        <section className={`py-24 ${highContrast ? 'bg-white border-t-4 border-black' : 'bg-stone-900 text-white'}`}>
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <span className={`font-bold uppercase tracking-widest text-sm mb-4 block ${highContrast ? 'text-black' : 'text-amber-500'}`}>Getting Started</span>
              <h2 className={`font-serif ${getHeadingSize('text-4xl md:text-5xl', 'text-5xl md:text-6xl')} font-bold mb-6`}>
                Ready-Made Solutions
              </h2>
              <p className={`max-w-2xl mx-auto ${getBodyTextSize()} ${highContrast ? 'font-medium' : 'text-stone-400'}`}>
                We've designed optimal packages for a quick sales launch. Choose the one that best fits your retail format.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              
              {/* Package 1 */}
              <div className={`p-10 md:p-12 rounded-3xl flex flex-col ${highContrast ? 'border-4 border-black text-black' : 'bg-stone-800 border border-stone-700'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className={`font-serif ${getHeadingSize('text-3xl', 'text-4xl')} font-bold mb-4`}>Fragrance Corner</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md ${highContrast ? 'border-2 border-black' : 'bg-stone-900 text-stone-300'}`}>20 SKUs</span>
                      <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md ${highContrast ? 'border-2 border-black' : 'bg-amber-900/50 text-amber-500'}`}>10% Discount</span>
                    </div>
                  </div>
                </div>
                <p className={`${getBodyTextSize()} mb-10 flex-grow ${highContrast ? 'font-medium' : 'text-stone-400'}`}>
                  Ideal for existing clothing or shoe boutiques. A compact display featuring the most popular fragrances for cross-selling. Includes a basic tester set.
                </p>
                <div className="border-t border-stone-700 pt-8 mt-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                     <p className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-1">Investment</p>
                     <p className={`font-serif ${getHeadingSize('text-2xl', 'text-3xl')} font-bold`}>from 25,000 CZK</p>
                  </div>
                  <button className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-colors ${highContrast ? 'bg-black text-white hover:bg-stone-800' : 'bg-white text-stone-900 hover:bg-stone-200'}`}>
                    Learn More
                  </button>
                </div>
              </div>

              {/* Package 2 (Highlighted) */}
              <div className={`p-10 md:p-12 rounded-3xl flex flex-col relative ${highContrast ? 'border-8 border-black text-black' : 'bg-amber-700 text-white shadow-2xl shadow-amber-900/20'}`}>
                {!highContrast && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-amber-900 px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-md">
                    Best Value
                  </div>
                )}
                {highContrast && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-full">
                    Best Value
                  </div>
                )}

                <div className="flex justify-between items-start mb-8 pt-4">
                  <div>
                    <h3 className={`font-serif ${getHeadingSize('text-3xl', 'text-4xl')} font-bold mb-4`}>Boutique Launch</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md ${highContrast ? 'border-2 border-black' : 'bg-amber-800 text-amber-50'}`}>60 SKUs</span>
                      <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md ${highContrast ? 'border-2 border-black' : 'bg-white text-amber-900'}`}>15% Discount</span>
                    </div>
                  </div>
                </div>
                <p className={`${getBodyTextSize()} mb-10 flex-grow ${highContrast ? 'font-medium' : 'text-amber-100'}`}>
                  Full inventory for a new store. Includes the entire fragrance line, leather accessories, gift sets, and extensive marketing support with a dedicated manager.
                </p>
                <div className={`border-t pt-8 mt-auto flex flex-col sm:flex-row justify-between items-center gap-6 ${highContrast ? 'border-black' : 'border-amber-600'}`}>
                  <div>
                     <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${highContrast ? 'text-stone-500' : 'text-amber-200'}`}>Investment</p>
                     <p className={`font-serif ${getHeadingSize('text-2xl', 'text-3xl')} font-bold`}>from 50,000 CZK</p>
                  </div>
                  <button className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-colors ${highContrast ? 'bg-black text-white hover:bg-stone-800' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* --- MORE PACKAGES BUTTON --- */}
            <div className="text-center">
              <button className={`px-10 py-5 rounded-xl font-bold text-lg inline-flex items-center gap-3 transition-colors ${highContrast ? 'border-4 border-black text-black hover:bg-black hover:text-white' : 'border border-stone-600 text-white hover:bg-stone-800'}`}>
                View more wholesale packages <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </section>

        {/* --- BOTTOM CTA (APPLY FOR PARTNERSHIP) --- */}
        <section className={`py-20 md:py-32 ${highContrast ? 'bg-white border-t-4 border-black' : 'bg-amber-800 text-white'}`}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`font-serif ${getHeadingSize('text-4xl md:text-5xl', 'text-5xl md:text-6xl')} font-bold mb-6 ${highContrast ? 'text-black' : 'text-white'}`}>
              Ready to elevate your retail space?
            </h2>
            <p className={`${getBodyTextSize()} mb-10 ${highContrast ? 'text-black font-medium' : 'text-amber-100'}`}>
              Join our network of premium retail partners and get access to exclusive wholesale pricing, priority shipping, and dedicated support.
            </p>
            <button className={`px-10 py-5 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-3 transition-colors ${highContrast ? 'bg-black text-white hover:bg-stone-800 border-2 border-black' : 'bg-stone-900 text-white hover:bg-black shadow-xl'}`}>
              Apply for Partnership <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

      </main>

      {/* --- SCROLL TO TOP BUTTON --- */}
      {showScroll && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 z-[80] p-4 rounded-full shadow-2xl transition-all hover:-translate-y-1 focus:outline-none ${highContrast ? 'bg-black text-white border-2 border-white' : 'bg-stone-900 text-white hover:bg-amber-700'}`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* --- FOOTER --- */}
      <footer className={`${highContrast ? 'bg-white border-t-4 border-black text-black' : 'bg-stone-900 text-stone-300'} py-16 md:py-24 mt-auto`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <h4 className="font-serif text-3xl font-bold mb-6 text-white">Leather Parfum</h4>
            <p className={`${getBodyTextSize()} font-medium opacity-80 mb-8`}>
              Your premium wholesale partner. Exclusive terms for retail businesses.
            </p>
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${highContrast ? 'border-2 border-black hover:bg-black hover:text-white' : 'bg-stone-800 hover:bg-amber-700 text-white transition-colors'}`}>In</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${highContrast ? 'border-2 border-black hover:bg-black hover:text-white' : 'bg-stone-800 hover:bg-amber-700 text-white transition-colors'}`}>Fb</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-8 uppercase tracking-widest text-stone-500">Navigation</h4>
            <ul className={`space-y-5 font-bold ${getBodyTextSize()}`}>
              <li><button className={`hover:text-amber-500 transition-colors ${linkClasses}`}>Perfume Catalog</button></li>
              <li><button className={`hover:text-amber-500 transition-colors ${linkClasses}`}>Wholesale Packages</button></li>
              <li><button className={`hover:text-amber-500 transition-colors ${linkClasses}`}>About Us</button></li>
              <li><button className={`hover:text-amber-500 transition-colors ${linkClasses}`}>Partner Login</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-8 uppercase tracking-widest text-stone-500">Contact</h4>
            <ul className={`space-y-5 font-bold ${getBodyTextSize()}`}>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 opacity-50"/> +420 123 456 789</li>
              <li className="flex items-center gap-3"><MapPin className="w-5 h-5 opacity-50"/> Prague, Czechia</li>
              <li className="flex items-center gap-3">b2b@leatherparfum.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-8 uppercase tracking-widest text-stone-500">Legal</h4>
            <ul className={`space-y-5 font-bold ${getBodyTextSize()}`}>
              <li><a href="#" className={`hover:text-amber-500 transition-colors ${linkClasses}`}>B2B Terms of Service</a></li>
              <li><a href="#" className={`hover:text-amber-500 transition-colors ${linkClasses}`}>Privacy Policy</a></li>
              <li><a href="#" className={`hover:text-amber-500 transition-colors ${linkClasses}`}>Returns & Claims</a></li>
            </ul>
          </div>
        </div>
        
        <div className={`max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold uppercase tracking-wider ${highContrast ? 'border-t-2 border-black' : 'border-t border-stone-800'}`}>
          <p className="opacity-60">&copy; 2026 Leather Parfum Wholesale. All rights reserved.</p>
          <div className="flex gap-6 opacity-60">
            <span>Made in Europe</span>
          </div>
        </div>
      </footer>

    </div>
  );
}