import React, { useState, useEffect, useRef } from 'react';

// Кастомный хук для плавного скролла (Lerp)
const useSmoothScroll = () => {
  const [scroll, setScroll] = useState(0);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const requestRef = useRef();

  useEffect(() => {
    const onScroll = () => {
      targetScroll.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.05;
      setScroll(currentScroll.current);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return scroll;
};

export default function App() {
  const scrollY = useSmoothScroll();
  
  const [vh, setVh] = useState(1000);
  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const seq1Progress = Math.min(Math.max(scrollY / vh, 0), 1); 
  const seq2Progress = Math.min(Math.max((scrollY - vh) / vh, 0), 1); 

  return (
    <div className="relative min-h-[300vh] bg-[#0a0a14] text-white font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* СЛОЙ 0: Фон и анимированные градиентные блюр-пятна */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 -left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/40 mix-blend-screen"
          style={{ 
            filter: `blur(${100 + seq1Progress * 50}px)`,
            transform: `translate3d(${seq1Progress * 20}vw, ${seq1Progress * -30}vh, 0) scale(${1 + seq1Progress * 0.5})` 
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/40 mix-blend-screen"
          style={{ 
            filter: `blur(${120 + seq1Progress * 40}px)`,
            transform: `translate3d(${seq1Progress * -15}vw, ${seq1Progress * 40}vh, 0) scale(${1 + seq1Progress * 0.2})` 
          }}
        />
      </div>

      {/* СЛОЙ 1: Главная типографика (73%) с параллаксом и блюром на скролле */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center w-full max-w-[1200px]">
          <span 
            className="text-[45vw] md:text-[38vw] font-black leading-none tracking-tighter text-[#111118]"
            style={{ 
              transform: `translate3d(${seq1Progress * -15}vw, ${seq1Progress * -100}vh, 0) rotate(${seq1Progress * -15}deg)`,
              filter: `blur(${seq1Progress * 20}px) drop-shadow(0 0 40px rgba(124, 58, 237, 0.6))`,
            }}
          >
            7
          </span>
          <span 
            className="text-[45vw] md:text-[38vw] font-black leading-none tracking-tighter text-[#111118] -ml-[5vw]"
            style={{ 
              transform: `translate3d(0, ${seq1Progress * -60}vh, 0) scale(${1 + seq1Progress * 0.5})`,
              filter: `blur(${seq1Progress * 5}px) drop-shadow(0 0 60px rgba(99, 102, 241, 0.7))`,
            }}
          >
            3
          </span>
          <span 
            className="text-[45vw] md:text-[38vw] font-black leading-none tracking-tighter text-[#111118] ml-[1vw]"
            style={{ 
              transform: `translate3d(${seq1Progress * 20}vw, ${seq1Progress * -130}vh, 0) rotate(${seq1Progress * 25}deg)`,
              filter: `blur(${seq1Progress * 15}px) drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))`,
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* СЛОЙ 2: Текстовый контент сайта */}
      <div className="relative z-20">
        
        {/* СЕКВЕНЦИЯ 1 */}
        <div 
          className="h-screen w-full flex flex-col justify-between p-6 md:p-12"
          style={{ opacity: 1 - seq1Progress * 2 }} 
        >
          {/* Header */}
          <div className="flex justify-between w-full uppercase text-xs md:text-sm tracking-[0.2em] font-medium text-white/80">
            <span>figma & krona</span>
            <span>november</span>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full pb-8 md:pb-12 gap-8">
            
            {/* НОВЫЙ БЛОК: Слоистый блюр вокруг текста */}
            <div className="relative group perspective-1000">
              
              {/* Подложка 1: Темная аура для читаемости на любом фоне */}
              <div className="absolute -inset-8 bg-[#0a0a14]/60 blur-2xl z-0 rounded-full mix-blend-multiply opacity-80"></div>
              
              {/* Подложка 2: Эффект матового стекла (линза). Фильтрует фон под собой! */}
              <div className="absolute -inset-6 bg-white/[0.03] backdrop-blur-md z-0 rounded-3xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:bg-white/[0.05] group-hover:shadow-[0_8px_40px_rgba(124,58,237,0.2)]"></div>
              
              {/* Подложка 3: Сам текст */}
              <p className="relative z-10 max-w-md text-lg md:text-xl leading-relaxed font-light text-white/95 drop-shadow-md">
                You can improve your chances of securing funding by 73% with a professionally prepared presentation
              </p>
              
            </div>

            <div className="text-left md:text-right relative z-20">
              <p className="text-sm font-light text-white/70 tracking-wide">@alenkadesigner</p>
              <p className="text-3xl md:text-4xl font-light mt-1 md:mt-2 tracking-tight">2025</p>
            </div>
          </div>
        </div>

        {/* СЕКВЕНЦИЯ 2 */}
        <div className="h-screen w-full flex items-center justify-center p-6 md:p-12 relative">
          <div 
            className="max-w-3xl text-center"
            style={{ 
              opacity: seq1Progress > 0.5 ? (seq1Progress - 0.5) * 2 : 0,
              transform: `translateY(${(1 - seq1Progress) * 100}px)`
            }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Сила Типографики
            </h2>
            <p className="text-lg md:text-2xl font-light leading-relaxed text-white/80">
              Студенты UMPRUM знают: шрифт — это не просто текст. Это инструмент управления вниманием. Параллакс и размытие создают иллюзию глубины, превращая плоский экран в трехмерное пространство.
            </p>
          </div>
        </div>

        {/* СЕКВЕНЦИЯ 3 */}
        <div className="h-screen w-full flex flex-col justify-center p-6 md:p-12 relative overflow-hidden">
          <div 
            className="flex flex-col items-center justify-center w-full h-full"
            style={{ 
              opacity: seq2Progress,
              transform: `scale(${0.9 + seq2Progress * 0.1})`
            }}
          >
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-white/50 mb-8"></div>
            <h3 className="text-3xl md:text-5xl font-light tracking-widest uppercase text-center mb-4">
              Фокус на деталях
            </h3>
            <p className="text-white/50 font-mono text-sm">scroll down to complete sequence</p>
          </div>
        </div>

      </div>
    </div>
  );
}