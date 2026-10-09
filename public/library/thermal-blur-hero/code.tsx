import React from 'react';

// Секретный соус: SVG-фильтр, который создает "рваные" и плавящиеся края у размытия.
// Без него это была бы просто скучная цветная тень.
const ChromaticFilterDefs = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="thermalMelt" x="-50%" y="-50%" width="200%" height="200%">
        {/* feTurbulence генерирует органичный шум */}
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.015 0.025" 
          numOctaves="3" 
          seed="5" 
          result="noise"
        >
          {/* Легкая анимация шума, чтобы эффект "дышал" */}
          <animate 
            attributeName="baseFrequency" 
            values="0.015 0.025; 0.020 0.030; 0.015 0.025" 
            dur="8s" 
            repeatCount="indefinite" 
          />
        </feTurbulence>
        {/* feDisplacementMap искажает пиксели текста на основе сгенерированного шума */}
        <feDisplacementMap 
          in="SourceGraphic" 
          in2="noise" 
          scale="25" /* Сила искажения (чем больше, тем сильнее рвет края) */
          xChannelSelector="R" 
          yChannelSelector="G" 
        />
      </filter>
    </defs>
  </svg>
);

export default function App() {
  return (
    <>
      {/* Подключаем шрифты. Взял DM Serif Display из твоего проекта UMPRUM */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background-color: #050508; /* Глубокий черный фон обязателен для эффекта свечения */
          overflow: hidden; 
          font-family: 'DM Serif Display', serif;
        }
        
        /* Добавим легкий зернистый оверлей на весь экран для пленочной текстуры */
        .grain-overlay {
          position: fixed;
          inset: -100%;
          z-index: 50;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.06;
          mix-blend-mode: overlay;
        }

        .hero-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-layer {
          position: absolute;
          font-size: clamp(6rem, 20vw, 18rem);
          line-height: 0.8;
          letter-spacing: -0.05em;
          white-space: nowrap;
          user-select: none;
        }

        /* 1. ХОЛОДНЫЙ СЛОЙ (Внешний синий ореол) */
        .layer-cool {
          color: #0044ff; /* Ядовито-синий */
          filter: blur(24px) url(#thermalMelt); /* Сильный блюр + искажение */
          mix-blend-mode: screen; /* КРИТИЧЕСКИ ВАЖНО: заставляет цвет работать как свет */
          transform: translate(20px, 10px) scale(1.02);
          opacity: 0.9;
        }

        /* 2. ТЕПЛЫЙ СЛОЙ (Внутреннее раскаленное ядро) */
        .layer-warm {
          color: #ff3300; /* Кислотно-оранжевый/красный */
          filter: blur(14px) url(#thermalMelt); /* Блюр меньше, чтобы было ближе к тексту */
          mix-blend-mode: screen;
          transform: translate(-15px, -5px) scale(1.01);
          opacity: 0.95;
        }
        
        /* 3. ДОПОЛНИТЕЛЬНЫЙ ЖЕЛТЫЙ СЛОЙ (Для максимальной "температуры" у самых краев букв) */
        .layer-hot {
          color: #ffcc00; 
          filter: blur(6px) url(#thermalMelt);
          mix-blend-mode: screen;
          transform: translate(-5px, 0px);
          opacity: 0.8;
        }

        /* 4. ЧЕТКИЙ ИСХОДНИК (На самом верху) */
        .layer-base {
          position: relative;
          color: #ffffff;
          z-index: 10;
          /* Легкое собственное свечение, чтобы интегрировать в фон */
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.2); 
        }
      `}</style>

      <ChromaticFilterDefs />
      <div className="grain-overlay" />

      <div className="hero-container">
        {/* Слои располагаются друг под другом. Самый нижний в коде будет визуально наверху */}
        
        <div className="text-layer layer-cool">
          blur
        </div>
        
        <div className="text-layer layer-warm">
          blur
        </div>
        
        <div className="text-layer layer-hot">
          blur
        </div>

        <div className="text-layer layer-base">
          blur
        </div>
      </div>
    </>
  );
}