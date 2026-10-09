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
  LayoutGrid,
  List
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('RU');
  // Добавляем переключатель вида для B2B клиентов
  const [viewMode, setViewMode] = useState('grid'); 

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

  // Элегантная цветовая палитра
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

  // Типографика с учетом a11y (используем кастомные шрифты через arbitrary values Tailwind)
  const typo = {
    base: largeText ? 'text-lg' : 'text-base',
    sm: largeText ? 'text-base' : 'text-sm',
    xs: largeText ? 'text-sm' : 'text-xs',
    h1: largeText ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl',
    h2: largeText ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl',
    h3: largeText ? 'text-xl md:text-2xl' : 'text-lg md:text-xl',
    // Подключаем шрифты (Cormorant Garamond для заголовков, Manrope для интерфейса)
    serif: "font-['Cormorant_Garamond',_serif]",
    sans: "font-['Manrope',_sans-serif]",
  };

  const bestsellers = [
    { id: 'sku-001', title: 'Подарочный набор VIP', label: '[ПРОБНИК]', oldPrice: '3.710,00 CZK', price: '3.400,00 CZK', sale: true, stock: 120 },
    { id: 'sku-002', title: 'Набор Gentleman\'s Edit', label: '[ПРОБНИК]', oldPrice: '2.340,00 CZK', price: '2.190,00 CZK', sale: true, stock: 85 },
    { id: 'sku-003', title: 'Ремень Artisan — Коричневый', label: '[ПРОБНИК]', price: '980,00 CZK', stock: 300 },
    { id: 'sku-004', title: 'Кошелек Heritage — Черный', label: '[ПРОБНИК]', oldPrice: '1.690,00 CZK', price: '1.450,00 CZK', sale: true, stock: 42 },
    { id: 'sku-005', title: 'Amber Royale EDP 50ml', label: '[ПРОБНИК]', price: '1.280,00 CZK', stock: 210 },
    { id: 'sku-006', title: 'Belle Eternelle EDP 50ml', label: '[ПРОБНИК]', price: '920,00 CZK', stock: 150 },
  ];

  return (
    <div className={`min-h-screen ${typo.sans} ${theme.bgLight} ${theme.textDark} transition-colors duration-300`}>
      {/* ИМПОРТ ШРИФТОВ */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');
      `}} />
      
      {/* ВЕРХНИЙ БАННЕР */}
      <div className={`w-full ${theme.bgLight} border-b ${theme.borderLight} py-2 text-center ${typo.xs} tracking-widest uppercase text-gray-500 font-medium`}>
        Оптовая B2B Платформа — <a href="#" className="underline hover:text-black transition-colors">Подать заявку на оптовый доступ →</a>
      </div>

      {/* ШАПКА */}
      <header className={`sticky w-full top-0 z-40 transition-all duration-300 ${isScrolled ? `${theme.bgDark} shadow-lg py-3` : `${theme.bgDark} py-5`}`}>
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px] flex justify-between items-center">
          
          {/* Логотип */}
          <div className={`${typo.serif} text-xl md:text-2xl ${theme.textLight} font-semibold tracking-wide`}>
            Leather Parfum
          </div>

          {/* Навигация */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors border-b-2 ${theme.accentBorder} pb-1`}>
              ГЛАВНАЯ
            </a>

            {/* Выпадающее меню: ПАРФЮМЕРИЯ */}
            <div className="relative group py-2">
              <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors flex items-center gap-1`}>
                ПАРФЮМЕРИЯ
                <svg className="w-4 h-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </a>
              <div className="absolute top-full -left-6 hidden group-hover:block w-64 pt-4 z-50">
                <div className={`bg-[#1C1A18] border border-[#2A2622] rounded-xl shadow-2xl py-3 flex flex-col backdrop-blur-md`}>
                  {['Мужская коллекция', 'Женская коллекция', 'Унисекс ароматы', 'Эксклюзивный Уд', 'Оптовые наборы пробников'].map((subItem) => (
                    <a key={subItem} href="#" className={`px-6 py-3 ${theme.textLight} hover:${theme.accent} hover:bg-white/5 ${typo.xs} tracking-widest transition-colors flex items-center gap-2`}>
                      <ArrowRight size={14} className="opacity-0 -ml-4 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
                      <span className="group/link">{subItem}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Выпадающее меню: КОЖГАЛАНТЕРЕЯ */}
            <div className="relative group py-2">
              <a href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors flex items-center gap-1`}>
                КОЖГАЛАНТЕРЕЯ
                <svg className="w-4 h-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </a>
              <div className="absolute top-full -left-6 hidden group-hover:block w-64 pt-4 z-50">
                <div className={`bg-[#1C1A18] border border-[#2A2622] rounded-xl shadow-2xl py-3 flex flex-col backdrop-blur-md`}>
                  {['Кошельки и портмоне', 'Классические ремни', 'Сумки и портфели', 'Кардхолдеры', 'Аксессуары'].map((subItem) => (
                    <a key={subItem} href="#" className={`px-6 py-3 ${theme.textLight} hover:${theme.accent} hover:bg-white/5 ${typo.xs} tracking-widest transition-colors flex items-center gap-2`}>
                      <ArrowRight size={14} className="opacity-0 -ml-4 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
                      <span className="group/link">{subItem}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {['ПОДАРОЧНЫЕ НАБОРЫ', 'B2B ПАКЕТЫ', 'КОНТАКТЫ'].map((item) => (
              <a key={item} href="#" className={`${theme.textLight} ${typo.xs} font-bold tracking-[0.15em] hover:${theme.accent} transition-colors`}>
                {item}
              </a>
            ))}
          </nav>
          
          {/* Иконки действий и локализация */}
          <div className="flex items-center gap-5">
            {/* Надежные векторные флаги вместо внешних картинок */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setLanguage('RU')} className={`w-8 h-6 rounded overflow-hidden border border-gray-700 transition-all ${language === 'RU' ? 'ring-2 ring-[#C9A265] opacity-100' : 'opacity-40 hover:opacity-100'}`} title="Русский">
                <svg viewBox="0 0 9 6" className="w-full h-full"><rect fill="#fff" width="9" height="3"/><rect fill="#d52b1e" y="3" width="9" height="3"/><rect fill="#0039a6" y="2" width="9" height="2"/></svg>
              </button>
              <button onClick={() => setLanguage('EN')} className={`w-8 h-6 rounded overflow-hidden border border-gray-700 transition-all ${language === 'EN' ? 'ring-2 ring-[#C9A265] opacity-100' : 'opacity-40 hover:opacity-100'}`} title="English">
                <svg viewBox="0 0 60 30" className="w-full h-full"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clipPath="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/></g></svg>
              </button>
            </div>

            <div className="flex items-center gap-4 ml-2">
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors`} aria-label="Поиск"><Search size={20} /></button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors flex items-center gap-2`} aria-label="Аккаунт">
                <User size={20} />
                <span className={`hidden md:block ${typo.xs} font-bold tracking-widest uppercase`}>Кабинет</span>
              </button>
              <button className={`${theme.textLight} hover:${theme.accent} transition-colors flex items-center gap-2`} aria-label="Корзина">
                <div className="relative">
                  <ShoppingCart size={20} />
                  <span className={`absolute -top-2 -right-2 bg-[#C9A265] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full`}>1</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ГЛАВНЫЙ ЭКРАН */}
      <section className={`${theme.bgDark} pt-24 pb-20 text-center px-4`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-6`}>
            B2B Платформа
          </h2>
          <h1 className={`${typo.serif} ${typo.h1} ${theme.textLight} mb-6 leading-tight`}>
            Искусство аромата и кожи
          </h1>
          <p className={`${theme.textMutedLight} ${typo.base} max-w-2xl mx-auto mb-10 font-light`}>
            Премиальная парфюмерия и кожаные изделия ручной работы по оптовым ценам. Создано для развития вашего бизнеса.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button className={`${theme.accentBg} px-8 py-4 rounded font-bold ${typo.sm} tracking-widest uppercase flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform`}>
              СМОТРЕТЬ КАТАЛОГ <ArrowRight size={18} />
            </button>
            <button className={`bg-transparent border border-[#4A453E] ${theme.textLight} hover:bg-white hover:text-black px-8 py-4 rounded font-bold ${typo.sm} tracking-widest uppercase hover:-translate-y-1 transition-all`}>
              ГОТОВЫЕ ПАКЕТЫ
            </button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-[#2A2622] pt-12">
            <div>
              <div className={`${typo.serif} ${typo.h2} ${theme.accent} mb-2`}>200+</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase font-bold`}>Позиций</div>
            </div>
            <div>
              <div className={`${typo.serif} ${typo.h2} ${theme.accent} mb-2`}>50%</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase font-bold`}>Скидка от розницы</div>
            </div>
            <div>
              <div className={`${typo.serif} ${typo.h2} ${theme.accent} mb-2`}>24ч</div>
              <div className={`${theme.textMutedLight} ${typo.xs} tracking-[0.15em] uppercase font-bold`}>Отгрузка</div>
            </div>
          </div>
        </div>
      </section>

      {/* ХИТЫ ПРОДАЖ (Добавлен переключатель видов Grid/Matrix для оптовиков) */}
      <section className={`py-24 ${theme.bgLight} container mx-auto px-4 max-w-[1400px]`}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
          <div>
            <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-4`}>Быстрый заказ</h2>
            <h3 className={`${typo.serif} ${typo.h2} ${theme.textDark}`}>Хиты продаж</h3>
          </div>
          
          {/* B2B Переключатель вида */}
          <div className="flex bg-gray-100 p-1 rounded-lg mt-6 md:mt-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <LayoutGrid size={16} /> Витрина
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <List size={16} /> Матрица (Опт)
            </button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          /* СТАНДАРТНЫЙ ВИД КАРТОЧЕК */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestsellers.map((item, i) => (
              <div key={i} className={`flex flex-col p-6 rounded-2xl ${theme.bgCardLight} border ${theme.borderLight} shadow-sm hover:shadow-md transition-shadow group relative`}>
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {item.sale && <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded">Sale</span>}
                  <span className="bg-[#C9A265] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded">Хит</span>
                </div>
                <div className="aspect-square bg-[#F4F2EF] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" alt="placeholder" className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-col flex flex-grow">
                  <h4 className={`${typo.base} font-bold ${theme.textDark} mb-1 leading-tight`}>
                    {item.title} <span className="font-normal text-gray-400 text-sm">{item.label}</span>
                  </h4>
                  <div className="mt-4 mb-6 flex items-center gap-3">
                    {item.oldPrice && <span className="line-through text-gray-400 font-medium text-sm">{item.oldPrice}</span>}
                    <span className={`${typo.serif} text-xl font-semibold ${item.sale ? 'text-[#C9A265]' : theme.textDark}`}>{item.price}</span>
                  </div>
                  <div className="mt-auto flex overflow-hidden rounded-lg shadow-sm border border-gray-200 focus-within:border-[#C9A265] transition-all">
                     <div className="flex-shrink-0 w-16 bg-gray-50 border-r border-gray-200">
                        <input type="number" min="1" defaultValue="1" className={`w-full h-full py-3 text-center bg-transparent focus:outline-none ${theme.textDark} font-bold`} aria-label="Quantity" />
                     </div>
                    <button className={`flex-grow py-3 px-4 bg-black text-white hover:bg-[#C9A265] transition-colors ${typo.xs} uppercase tracking-widest font-bold`}>
                      В КОРЗИНУ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* МАТРИЧНЫЙ ТАБЛИЧНЫЙ ВИД (Критически важно для B2B оптовиков) */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                    <th className="p-4 font-bold">Товар</th>
                    <th className="p-4 font-bold">Артикул</th>
                    <th className="p-4 font-bold text-right">Наличие</th>
                    <th className="p-4 font-bold text-right">Цена (Опт)</th>
                    <th className="p-4 font-bold text-center w-32">Кол-во</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bestsellers.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded bg-gray-100 object-cover" alt="" />
                          <div>
                            <p className="font-bold text-sm text-black">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono text-gray-500">{item.id}</td>
                      <td className="p-4 text-sm text-right text-green-600 font-medium">{item.stock} шт</td>
                      <td className="p-4 text-right">
                        {item.oldPrice && <div className="line-through text-gray-400 text-xs">{item.oldPrice}</div>}
                        <div className={`${typo.serif} text-lg font-semibold ${item.sale ? 'text-[#C9A265]' : 'text-black'}`}>{item.price}</div>
                      </td>
                      <td className="p-4">
                        <input type="number" min="0" placeholder="0" className="w-full p-2 text-center border border-gray-300 rounded focus:border-[#C9A265] focus:outline-none" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-200">
              <span className="text-sm text-gray-500">Заполните нужное количество напротив товаров</span>
              <button className={`${theme.accentBg} px-8 py-3 rounded font-bold ${typo.sm} tracking-widest uppercase transition-colors`}>
                ДОБАВИТЬ ВЫБРАННОЕ В ЗАКАЗ
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ГОТОВЫЕ РЕШЕНИЯ */}
      <section className={`${theme.bgLight} py-24 border-t ${theme.borderLight}`}>
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className={`${theme.accent} ${typo.xs} font-bold tracking-[0.2em] uppercase mb-4`}>B2B Пакеты</h2>
            <h3 className={`${typo.serif} ${typo.h2} ${theme.textDark} mb-4`}>Готовые решения</h3>
            <p className={`${theme.textMutedDark} ${typo.base} font-light`}>Идеально для запуска или расширения вашей розничной точки.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PackageSearch, title: 'Запуск Бутика', desc: 'Стартовый набор из 60 SKU: парфюмерия, кошельки, ремни. Включает схему выкладки.', skus: '60', discount: '15%', featured: true },
              { icon: Percent, title: 'Парфюмерный корнер', desc: '20 самых продаваемых ароматов для добавления парфюмерии в ваш текущий магазин.', skus: '20', discount: '10%', featured: false },
              { icon: Clock, title: 'Сезонное обновление', desc: 'Ротация 30 SKU на квартал. Новинки и сезонные хиты.', skus: '30', discount: '12%', featured: false },
              { icon: Percent, title: 'Ликвидационный набор', desc: '3 хита + 1 бонусный товар с максимальной скидкой. Ограниченное предложение.', skus: '4', discount: '25%', featured: false }
            ].map((pkg, i) => (
              <div key={i} className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 hover:shadow-xl ${pkg.featured ? `ring-2 ring-[#C9A265] shadow-lg bg-[#FAF7F2]` : `${theme.bgCardLight} border ${theme.borderLight} shadow-sm`}`}>
                {pkg.featured && (
                  <div className={`absolute -top-3 right-6 ${theme.accentBg} px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full shadow-md`}>
                    Выбор №1
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${pkg.featured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                  <pkg.icon size={24} />
                </div>
                <h4 className={`${typo.serif} ${typo.h3} ${theme.textDark} mb-3 font-semibold`}>{pkg.title}</h4>
                <p className={`${theme.textMutedDark} ${typo.sm} mb-8 flex-grow font-light`}>{pkg.desc}</p>
                
                <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100 mt-auto">
                  <div>
                    <div className={`${typo.serif} ${typo.h2} ${theme.textDark}`}>{pkg.skus}</div>
                    <div className={`${typo.xs} ${theme.textMutedDark} tracking-widest uppercase mt-1 font-bold`}>SKUS</div>
                  </div>
                  <div>
                    <div className={`${typo.serif} ${typo.h2} ${theme.accent}`}>{pkg.discount}</div>
                    <div className={`${typo.xs} ${theme.textMutedDark} tracking-widest uppercase mt-1 font-bold`}>СКИДКА</div>
                  </div>
                </div>

                <button className={`w-full py-4 mt-2 rounded font-bold ${typo.sm} tracking-widest uppercase transition-colors ${pkg.featured ? theme.accentBg : `bg-black text-white hover:bg-gray-800`}`}>
                  СМОТРЕТЬ ПАКЕТ
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Elements (Scroll to Top) */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#1C1A18] text-white border border-[#4A453E] shadow-xl z-40 transition-all duration-300 hover:bg-[#C9A265] hover:border-[#C9A265] ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={20} />
      </button>

      {/* Кнопка доступности: теперь в премиум-дизайне (Темный фон с золотом/белым) */}
      <div className="fixed bottom-6 left-6 z-50">
        {showA11yMenu && (
          <div className="absolute bottom-16 left-0 bg-[#1C1A18] border border-[#4A453E] rounded-xl shadow-2xl p-6 w-[300px] mb-4">
            <div className="flex justify-between items-center mb-6 border-b border-[#2A2622] pb-4">
              <h3 className={`${typo.serif} text-xl font-bold text-white`}>Доступность</h3>
              <button onClick={() => setShowA11yMenu(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">Размер текста</p>
                <div className="flex gap-2">
                  <button onClick={() => setLargeText(false)} className={`flex-1 py-2 px-3 border rounded text-sm font-bold transition-colors ${!largeText ? 'bg-[#C9A265] border-[#C9A265] text-white' : 'border-[#4A453E] text-white hover:bg-[#2A2622]'}`}>
                    Стандарт
                  </button>
                  <button onClick={() => setLargeText(true)} className={`flex-1 py-2 px-3 border rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${largeText ? 'bg-[#C9A265] border-[#C9A265] text-white' : 'border-[#4A453E] text-white hover:bg-[#2A2622]'}`}>
                    <ZoomIn size={16} /> Увелич.
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">Контраст</p>
                <div className="flex gap-2">
                  <button onClick={() => setHighContrast(false)} className={`flex-1 py-2 px-3 border rounded text-sm font-bold transition-colors ${!highContrast ? 'bg-[#C9A265] border-[#C9A265] text-white' : 'border-[#4A453E] text-white hover:bg-[#2A2622]'}`}>
                    Обычный
                  </button>
                  <button onClick={() => setHighContrast(true)} className={`flex-1 py-2 px-3 border rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${highContrast ? 'bg-white border-white text-black' : 'border-[#4A453E] text-white hover:bg-[#2A2622]'}`}>
                    <Eye size={16} /> Высокий
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Изменен цвет кнопки a11y, чтобы она не разрушала премиум-вайб */}
        <button 
          onClick={() => setShowA11yMenu(!showA11yMenu)}
          className={`p-4 rounded-full bg-[#1C1A18] text-white border-2 border-[#C9A265] shadow-xl hover:bg-[#2A2622] flex items-center justify-center transition-transform focus:outline-none focus:ring-4 focus:ring-[#C9A265]/50 ${showA11yMenu ? 'scale-110' : ''}`}
          aria-label="Настройки доступности"
        >
          <Accessibility size={24} />
        </button>
      </div>

    </div>
  );
};

export default App;