import React, { useState, useEffect } from 'react';

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Вычисляем смещение мыши от центра экрана (от -1 до 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.9; }
          50% { transform: scale(1.05) translate(0, 0); opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse 12s ease-in-out infinite reverse;
        }
      `}</style>

      {/* Основной контейнер со светлым пудрово-персиковым цветом фона (ближе к белому) */}
      <div className="relative w-full h-screen overflow-hidden bg-[#fdfaf8] flex items-center justify-center font-sans">
        
        {/* Мягкая вертикальная синяя аура (уходит вверх и вниз, оставляет белое по бокам) */}
        <div
          className="absolute rounded-[100%] pointer-events-none animate-pulse-slow"
          style={{
            width: '50vw',
            height: '140vh',
            background: '#0055ff',
            filter: 'blur(130px)',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        />

        {/* Горизонтальное глубокое синее свечение (вокруг черного ядра) */}
        <div
          className="absolute rounded-[100%] pointer-events-none"
          style={{
            width: '85vw',
            height: '45vh',
            background: '#0011ee',
            filter: 'blur(90px)',
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
            transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        />

        {/* Темное ядро — сплюснутое, с более четкими (меньше blur) краями */}
        <div
          className="absolute rounded-[100%] pointer-events-none animate-pulse-slower"
          style={{
            width: '75vw',
            height: '22vh',
            background: '#01000a',
            filter: 'blur(45px)', // Меньший радиус размытия дает ту самую «четкость»
            transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)`,
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        />

        {/* Контент поверх эффекта */}
        <div className="relative z-10 flex flex-col items-center text-white/90 mix-blend-plus-lighter pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-light tracking-[0.2em] mb-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
            АУРА
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] uppercase opacity-80 font-medium">
            Визуальные коммуникации
          </p>
        </div>

        {/* Декоративные элементы (Навигация/Студия) для вида полноценного сайта */}
        <nav className="absolute top-8 left-0 right-0 px-10 flex justify-between text-black/50 text-xs font-medium tracking-widest uppercase z-20">
          <span>Umprum Studio</span>
          <span>Портфолио</span>
        </nav>
        
        <div className="absolute bottom-8 left-0 right-0 px-10 flex justify-between text-white/50 text-xs font-medium tracking-widest uppercase z-20 mix-blend-difference">
          <span>Kharkiv — Prague</span>
          <span>2026</span>
        </div>

      </div>
    </>
  );
}