import React, { useState, useRef } from 'react';

export default function App() {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Эффект 3D-наклона при движении мыши
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; // Максимальный угол наклона X
    const rotateY = ((x - centerX) / centerX) * 15;  // Максимальный угол наклона Y

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setIsHovered(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      {/* Подключаем шрифт Anton для акциденции */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .font-poster { font-family: 'Anton', sans-serif; }
        
        /* Легкий эффект шума (noise) для текстуры постера */
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
        }

        /* Анимация украинского флага на фоне при ховере */
        .ukraine-gradient {
          background: linear-gradient(to bottom, #0057B7 50%, #FFDD00 50%);
          background-size: 100% 200%;
          background-position: 0 0;
          transition: background-position 0.5s ease;
        }
        .group:hover .ukraine-gradient {
          background-position: 0 -100%;
        }
      `}} />

      {/* Интерактивный контейнер постера */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ transform, transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out' }}
        className="relative w-full max-w-lg aspect-square group cursor-pointer shadow-2xl"
      >
        {/* Обертка для контента с рамкой */}
        <div className="absolute inset-0 border-4 sm:border-8 border-black bg-black flex flex-col overflow-hidden transition-colors duration-500 group-hover:border-transparent">
          
          {/* Слой с текстурой */}
          <div className="absolute inset-0 bg-noise z-20 mix-blend-overlay"></div>

          {/* Анимированный фон (проявляется при наведении) */}
          <div className={`absolute inset-0 transition-opacity duration-500 z-0 ${isHovered ? 'opacity-100 ukraine-gradient' : 'opacity-0'}`}></div>

          {/* БЛОК 1: FUNDRAISER */}
          <div className="relative z-10 flex-1 flex items-center justify-center bg-black transition-colors duration-500 group-hover:bg-transparent px-4">
            <h1 className="font-poster text-[16vw] sm:text-[100px] leading-none text-white uppercase tracking-normal w-full text-center group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md">
              Fundraiser
            </h1>
          </div>

          {/* БЛОК 2: FOR */}
          <div className="relative z-10 flex-1 flex items-center justify-center bg-white transition-colors duration-500 group-hover:bg-transparent">
            <h2 className={`font-poster text-[22vw] sm:text-[140px] leading-none uppercase tracking-tight text-center transition-all duration-500 ease-out ${isHovered ? 'text-white scale-110 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]' : 'text-black'}`}>
              For
            </h2>
          </div>

          {/* БЛОК 3: UKRAINE */}
          <div className="relative z-10 flex-1 flex items-center justify-center bg-black transition-colors duration-500 group-hover:bg-transparent px-4">
            {/* Используем justify-between хитрость для растягивания букв, если нужно, но здесь играем на tracking */}
            <h3 className="font-poster text-[16vw] sm:text-[100px] leading-none text-white uppercase tracking-[0.08em] sm:tracking-[0.1em] w-full text-center group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md">
              Ukraine
            </h3>
          </div>

          {/* Призыв к действию, появляющийся при ховере */}
          <div className={`absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100 delay-100' : 'opacity-0'}`}>
             <div className="bg-black text-white font-sans font-bold py-4 px-10 text-3xl sm:text-5xl tracking-widest uppercase border-2 border-white/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
               Donate
             </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}