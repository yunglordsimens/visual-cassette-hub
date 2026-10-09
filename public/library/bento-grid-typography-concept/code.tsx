import React, { useState, useEffect } from 'react';

// Компонент статичного фона (одно синее пятно по центру)
const StaticBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#e8eef5]">
    <div className="absolute top-1/2 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-700 opacity-75 blur-[120px]"></div>
  </div>
);

// Компонент эфемерной рамки из блюра (овальная виньетка по краям экрана)
const BlurFrame = () => (
  <div 
    className="pointer-events-none fixed inset-0 z-20"
    style={{
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.15) 100%)',
      maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 100%)',
    }}
  />
);

export default function App() {
  // Конфигурация блоков сетки
  const blocks = [
    { id: 1, classes: "col-span-2 row-span-2" },
    { id: 2, classes: "col-span-1 row-span-1" },
    { id: 3, classes: "col-span-1 row-span-1" },
    { id: 4, classes: "col-span-1 row-span-2" },
    { id: 5, classes: "col-span-2 row-span-1" },
    { id: 6, classes: "col-span-1 row-span-1" },
  ];

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-800">
      {/* Фон и рамка. Шум удален. */}
      <StaticBackground />
      <BlurFrame />

      {/* Основной контент */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center p-6 md:p-12">
        
        {/* Бенто Сетка */}
        <div className="grid h-[600px] w-full max-w-4xl grid-cols-3 grid-rows-3 gap-4 md:gap-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`
                group
                ${block.classes} 
                relative flex items-center justify-center overflow-hidden rounded-[2rem]
                bg-white cursor-pointer
                
                /* Базовое состояние: утоплено в блюр, края сильно размыты, карточка уменьшена */
                blur-[16px] opacity-60 scale-95 z-10
                transition-all duration-700 ease-out
                
                /* При наведении: выплывает наверх, становится резкой, белой и отбрасывает тень */
                hover:blur-0 hover:opacity-100 hover:scale-100 
                hover:shadow-[0_20px_60px_-15px_rgba(29,78,216,0.3)] hover:z-50
              `}
            >
              {/* Текст появляется только когда карточка "всплывает" (фокусируется) */}
              <span className="relative z-0 text-4xl font-light text-slate-400 opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-hover:text-slate-800 select-none">
                {block.id === 1 ? "Aa" : block.id === 5 ? "Glyph" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}