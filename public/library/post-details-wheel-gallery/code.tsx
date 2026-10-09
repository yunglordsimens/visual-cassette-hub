import React, { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

// Демо-данные галереи
const GALLERY_ITEMS = [
  { id: 1, caption: '1. Монохромная абстракция — Деталь', image: 'https://images.unsplash.com/photo-1600172454520-134a542a2255?auto=format&fit=crop&q=80&w=800&h=500' },
  { id: 2, caption: '2. Архитектурные формы — Фасад', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500&h=700' },
  { id: 3, caption: '3. Типографика в среде — Постер', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600&h=600' },
  { id: 4, caption: '4. Свет и тень — Интерьер', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500&h=650' },
  { id: 5, caption: '5. Линии и ритм — Конструкция', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=550' },
  { id: 6, caption: '6. Бетон и свет — Брутализм', image: 'https://images.unsplash.com/photo-1477243299294-8679d4d65f73?auto=format&fit=crop&q=80&w=800&h=600' },
];

// Текстовые блоки (разбиты на абзацы для анимации)
const TEXT_BLOCKS = [
  { id: 't1', content: <><span className="font-bold">Merz to Emigre and Beyond.</span> Авангардный дизайн журналов двадцатого века, рассмотренный через призму типографики и визуальных коммуникаций.</> },
  { id: 't2', content: 'В этой статье мы исследуем, как радикальные художественные движения — от дадаизма и конструктивизма до панка и цифрового дизайна — изменили формат печатного издания.' },
  { id: 't3', content: 'Когда текст перестает быть просто носителем информации и становится самостоятельным визуальным объектом, сетка ломается, а иерархия выстраивается заново.' },
  { id: 't4', content: 'Именно здесь, на стыке формы и контрформы, рождается современный редакционный дизайн. Влияние таких изданий, как Merz Курта Швиттерса или Emigre Руди Вандерланса и Зузаны Личко, невозможно переоценить.' },
  { id: 't5', content: 'Они бросили вызов устоявшимся правилам верстки, используя экспериментальные шрифты, рваные края и многослойность. Каждый разворот становился манифестом.' },
  { id: 't6', content: 'Шрифт больше не молчал — он кричал, шептал, сбивал с толку и заставлял читателя взаимодействовать с макетом. Исследуя эти архивы, мы не просто смотрим на историю графического дизайна, мы учимся смелости.' },
];

// Объединяем длину для синхронизации (берем максимальную, чтобы скроллилось все)
const TOTAL_ITEMS = Math.max(GALLERY_ITEMS.length, TEXT_BLOCKS.length);

export default function App() {
  const [activeIndex, setActiveIndex] = useState(2);
  const scrollTimeout = useRef(null);
  const touchStartY = useRef(0);

  // Единый обработчик скролла для всей страницы
  const handleWheel = (e) => {
    if (scrollTimeout.current) return;

    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, TOTAL_ITEMS - 1));
      } else {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 400);
    }
  };

  // Обработчики свайпов
  const handleTouchStart = (e) => touchStartY.current = e.touches[0].clientY;
  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActiveIndex(p => Math.min(p + 1, TOTAL_ITEMS - 1));
      else setActiveIndex(p => Math.max(0, p - 1));
    }
  };

  // Стиль "Колеса" для ГАЛЕРЕИ (сильный 3D эффект и фейд)
  const getGalleryStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    // Видимы только 5 элементов (центр + 2 сверху + 2 снизу)
    if (absDiff > 2) return { opacity: 0, pointerEvents: 'none', visibility: 'hidden' };

    const translateY = diff * 100; // Расстояние между карточками
    const scale = 1 - absDiff * 0.15; // Сильное уменьшение к краям
    const opacity = 1 - absDiff * 0.4; // Быстрый фейд
    const rotateX = diff * -10; // Поворот для эффекта колеса

    return {
      transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
      zIndex: 100 - absDiff,
      opacity,
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  // Стиль "Колеса" для ТЕКСТА (более мягкий эффект для читабельности)
  const getTextStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

     // Видимы только 5 блоков текста
    if (absDiff > 2) return { opacity: 0, pointerEvents: 'none', position: 'absolute', visibility: 'hidden' };

    const translateY = diff * 80; // Чуть плотнее, чем картинки
    const opacity = 1 - absDiff * 0.5; // Фейд текста
    // Текст не масштабируем и не вращаем, чтобы его можно было читать

    return {
      transform: `translateY(${translateY}px)`,
      opacity,
      zIndex: 100 - absDiff,
      position: absDiff === 0 ? 'relative' : 'absolute', // Центральный блок в потоке, остальные абсолютно
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <div 
      className="h-[100dvh] bg-[#ce5a31] text-[#1a1a1a] flex flex-col font-sans text-[13px] font-medium uppercase tracking-widest overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* HEADER */}
      <header className="w-full px-8 pt-8 pb-4 shrink-0 z-50 relative">
        <div className="max-w-[1200px] mx-auto flex items-center border-b border-[#1a1a1a]/20 pb-4">
          <button className="mr-8 hover:opacity-70 transition-opacity">
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <span>Post Details</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1200px] mx-auto overflow-hidden relative">
        
        {/* ЛЕВАЯ ПОЛОВИНА: ГАЛЕРЕЯ-КОЛЕСО */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center relative select-none border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/20 overflow-hidden perspective-1000">
          <div className="relative w-full h-[60%] flex items-center justify-center preserve-3d mb-6">
            {GALLERY_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="absolute shadow-xl rounded-sm overflow-hidden flex items-center justify-center pointer-events-none origin-center"
                style={getGalleryStyle(index)}
              >
                <img 
                  src={item.image} 
                  alt={item.caption}
                  className="max-h-[40vh] max-w-[85vw] lg:max-w-[40vw] object-contain block bg-[#ce5a31]"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          {/* Подпись (синхронизирована) */}
          <div className="h-6 flex items-center justify-center text-center px-4 transition-opacity duration-300" style={{ opacity: GALLERY_ITEMS[activeIndex] ? 1 : 0 }}>
            <p>{GALLERY_ITEMS[activeIndex]?.caption}</p>
          </div>
        </div>

        {/* ПРАВАЯ ПОЛОВИНА: ТЕКСТ-КОЛЕСО */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden flex items-center justify-center px-8 lg:px-12 py-8 lg:py-4 z-10">
          <div className="relative w-full flex flex-col items-center justify-center leading-relaxed normal-case tracking-normal text-center lg:text-left perspective-1000">
             {TEXT_BLOCKS.map((block, index) => (
               <div 
                 key={block.id}
                 className="w-full max-w-md pointer-events-none transition-all duration-500 origin-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
                 style={getTextStyle(index)}
               >
                 <p className="text-[#1a1a1a]/90 text-base sm:text-lg md:text-xl">
                  {block.content}
                 </p>
               </div>
             ))}
          </div>
        </div>

      </main>

      {/* FOOTER С ТЕГАМИ */}
      <footer className="w-full px-8 pb-6 pt-4 shrink-0 z-50 relative bg-[#ce5a31]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center border-t border-[#1a1a1a]/20 pt-6">
          
          {/* Теги перенесены сюда */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 border border-[#1a1a1a]/30 rounded-full hover:bg-[#1a1a1a]/5 transition-colors cursor-pointer">graphic design</span>
            <span className="px-4 py-1.5 border border-[#1a1a1a]/30 rounded-full hover:bg-[#1a1a1a]/5 transition-colors cursor-pointer">teorie</span>
            <span className="px-4 py-1.5 border border-[#1a1a1a]/30 rounded-full hover:bg-[#1a1a1a]/5 transition-colors cursor-pointer">history</span>
            <span className="px-4 py-1.5 border border-[#1a1a1a]/30 rounded-full hover:bg-[#1a1a1a]/5 transition-colors cursor-pointer">magazine</span>
          </div>

          <div className="text-center text-[#1a1a1a]/60">
            UMPRUM Type Library × 2026
          </div>
        </div>
      </footer>
      
    </div>
  );
}