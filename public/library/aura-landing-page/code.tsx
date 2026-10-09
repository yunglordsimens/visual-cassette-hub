import React, { useState, useEffect } from 'react';

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .animate-pulse-slow {
          animation: pulse 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse 12s ease-in-out infinite reverse;
        }

        /* Обновленный, более контрастный и выпуклый хром */
        .chrome-text {
          font-family: 'Syne', sans-serif;
          background-image: linear-gradient(
            180deg,
            #ffffff 0%,
            #e0e0e0 30%,
            #555555 46%,
            #000000 48.5%,  /* Глубокая тень сверху блика */
            #ffffff 49.5%,  /* ТОНКИЙ РЕЗКИЙ БЛИК */
            #ffffff 51%,    /* Толщина блика */
            #000000 52%,    /* Глубокая тень снизу блика */
            #222222 58%,
            #cccccc 85%,
            #ffffff 100%
          );
          background-size: 100% 200vh; /* Размер градиента привязан к высоте экрана */
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          
          /* Очень тонкая белая обводка, чтобы отделить буквы от фона */
          -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.4);
          
          /* Мягкая тень для объема, без грязи */
          filter: drop-shadow(0px 15px 25px rgba(0, 0, 0, 0.5)) drop-shadow(0px -1px 1px rgba(255, 255, 255, 0.4));
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="relative w-full bg-[#fdfaf8] font-sans selection:bg-blue-600 selection:text-white">
        
        {/* ФИКСИРОВАННЫЙ ФОН С АНИМАЦИЕЙ АУРЫ */}
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          {/* Мягкая вертикальная синяя аура */}
          <div
            className="absolute rounded-[100%] pointer-events-none animate-pulse-slow"
            style={{
              width: '50vw',
              height: '140vh',
              background: '#0055ff',
              filter: 'blur(130px)',
              transform: `translate(${mousePos.x * 20}px, calc(${mousePos.y * 20}px - ${scrollY * 0.05}px)) scaleY(${1 + scrollY * 0.002}) scaleX(${1 - scrollY * 0.0002})`,
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />

          {/* Горизонтальное глубокое синее свечение */}
          <div
            className="absolute rounded-[100%] pointer-events-none"
            style={{
              width: '85vw',
              height: '45vh',
              background: '#0011ee',
              filter: 'blur(90px)',
              transform: `translate(${mousePos.x * 40}px, calc(${mousePos.y * 40}px - ${scrollY * 0.1}px)) scaleX(${1 + scrollY * 0.001}) scaleY(${1 + scrollY * 0.001})`,
              transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />

          {/* Темное ядро */}
          <div
            className="absolute rounded-[100%] pointer-events-none animate-pulse-slower"
            style={{
              width: '75vw',
              height: '22vh',
              background: '#01000a',
              filter: 'blur(45px)',
              transform: `translate(${mousePos.x * 60}px, calc(${mousePos.y * 60}px - ${scrollY * 0.15}px)) scaleY(${1 + scrollY * 0.0035}) scaleX(${1 + scrollY * 0.0005})`,
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />
        </div>

        {/* НАВИГАЦИЯ */}
        <nav className="fixed top-8 left-0 right-0 px-6 md:px-10 flex justify-between text-black/70 text-xs font-medium tracking-widest uppercase z-50 mix-blend-overlay" style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="cursor-pointer hover:text-black transition-colors font-bold">Umprum Studio</span>
          <span className="cursor-pointer hover:text-black transition-colors">Portfolio</span>
        </nav>

        {/* КОНТЕНТ */}
        <div className="relative z-10 w-full flex flex-col items-center overflow-hidden">
          
          {/* SECTION 1: HERO */}
          <section className="relative w-full h-screen flex flex-col items-center justify-center">
            <div 
              className="flex flex-col items-center"
              style={{ transform: `translateY(${scrollY * 0.3}px)` }} 
            >
              <h1 
                className="text-7xl md:text-[11rem] font-extrabold tracking-tight mb-2 md:mb-4 chrome-text" 
                style={{ 
                  /* Двигаем фон в противовес скроллу для эффекта неподвижного света */
                  backgroundPosition: `center ${-scrollY * 0.8}px` 
                }}
              >
                AURA
              </h1>
              <p className="text-sm md:text-lg tracking-[0.4em] uppercase text-white/90 font-bold mix-blend-plus-lighter text-center px-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Visual Communications
              </p>
            </div>
            
            <div 
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs tracking-widest uppercase mix-blend-difference"
              style={{ opacity: Math.max(0, 1 - scrollY / 300), fontFamily: "'Syne', sans-serif" }}
            >
              <span>Scroll to explore</span>
              <div className="w-[1px] h-8 bg-white/50 mt-4 animate-pulse"></div>
            </div>
          </section>

          {/* SECTION 2: ABOUT / TYPOGRAPHY */}
          <section className="relative w-full min-h-screen flex items-center px-6 md:px-20 py-24">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div 
                style={{ transform: `translateY(${scrollY * 0.1}px)`, fontFamily: "'Syne', sans-serif" }}
                className="text-black text-2xl md:text-5xl font-normal leading-tight mix-blend-overlay"
              >
                <p className="mb-8">
                  <span className="font-bold">Crafting type.</span><br/>
                  Shaping visions.
                </p>
                <p className="text-base md:text-lg tracking-wide uppercase opacity-60 font-medium max-w-md">
                  Fusing structured computer science logic with high-end visual aesthetics and custom typography.
                </p>
              </div>
              
              <div 
                className="w-full aspect-[4/5] bg-black/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden group"
                style={{ transform: `translateY(${scrollY * -0.05}px)` }} 
              >
                <h2 
                  className="text-6xl md:text-8xl font-extrabold chrome-text opacity-50 group-hover:opacity-100 transition-opacity duration-700 select-none"
                  style={{ backgroundPosition: `center calc(50% + ${-scrollY * 0.5}px)` }}
                >
                  TYPE
                </h2>
              </div>
            </div>
          </section>

          {/* SECTION 3: SELECTED WORKS */}
          <section className="relative w-full min-h-screen py-24 px-6 md:px-20 flex flex-col justify-center" style={{ fontFamily: "'Syne', sans-serif" }}>
            <div 
              className="w-full max-w-6xl mx-auto mb-16"
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            >
              <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase text-black/60 mb-2 mix-blend-overlay font-bold">Selected Archive</h2>
              <div className="w-full h-[1px] bg-black/20 mix-blend-overlay"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-black/80 mix-blend-overlay">
              <div className="flex flex-col group cursor-pointer" style={{ transform: `translateY(${scrollY * -0.02}px)` }}>
                <div className="w-full aspect-video bg-black/10 rounded-xl mb-4 overflow-hidden border border-black/5 relative">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:tracking-widest transition-all duration-300">Project Alpha</h3>
                <p className="text-xs uppercase tracking-wider opacity-60 font-medium">Typography / Identity</p>
              </div>
              
              <div className="flex flex-col group cursor-pointer" style={{ transform: `translateY(${scrollY * -0.06}px)` }}>
                <div className="w-full aspect-video bg-black/10 rounded-xl mb-4 overflow-hidden border border-black/5 relative">
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:tracking-widest transition-all duration-300">Neo Grotesk</h3>
                <p className="text-xs uppercase tracking-wider opacity-60 font-medium">Typeface Design</p>
              </div>

              <div className="flex flex-col group cursor-pointer" style={{ transform: `translateY(${scrollY * -0.04}px)` }}>
                <div className="w-full aspect-video bg-black/10 rounded-xl mb-4 overflow-hidden border border-black/5 relative">
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:tracking-widest transition-all duration-300">Digital Avant-Garde</h3>
                <p className="text-xs uppercase tracking-wider opacity-60 font-medium">Creative Direction</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: FOOTER */}
          <section className="relative w-full h-[50vh] flex flex-col items-center justify-center border-t border-black/10 mix-blend-overlay">
            <h2 
              className="text-5xl md:text-8xl font-extrabold chrome-text mb-8"
              style={{ 
                transform: `translateY(${scrollY * 0.1}px)`,
                backgroundPosition: `center ${-scrollY * 0.6}px`
              }} 
            >
              LET'S CREATE
            </h2>
            <div className="flex justify-between w-full max-w-4xl px-10 text-black/60 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span>Kharkiv — Prague</span>
              <a href="mailto:hello@example.com" className="hover:text-black transition-colors">Contact</a>
              <span>2026</span>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}