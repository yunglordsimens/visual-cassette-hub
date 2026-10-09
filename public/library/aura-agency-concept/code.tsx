import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Globe, Zap, ArrowDown } from 'lucide-react';

// Хук для плавного появления элементов при скролле (Scroll Sequence effect)
const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Элемент появляется, когда хотя бы 10% его видно
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  const translateClass = direction === 'up' ? 'translate-y-20' : 'translate-x-20';

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${translateClass}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  // Слушатель для параллакс-эффектов
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-white selection:text-black font-sans overflow-x-hidden">
      
      {/* Навигация (Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-8 py-4 shadow-2xl">
          <div className="text-xl font-black tracking-tighter">AURA.</div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            <a href="#" className="hover:text-neutral-400 transition-colors">Work</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Studio</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Contact</a>
          </div>
          <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors">
            Let's Talk
          </button>
        </div>
      </nav>

      {/* Hero Секция (Параллакс и огромная типографика) */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
        {/* Декоративные размытые сферы на фоне */}
        <div 
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.001})` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />

        <div className="z-10 text-center w-full max-w-7xl">
          <FadeIn>
            <p className="text-sm md:text-base font-medium tracking-[0.2em] text-neutral-400 mb-6 uppercase">
              Digital Production Agency
            </p>
          </FadeIn>
          
          <h1 
            className="text-[15vw] md:text-[10vw] font-black tracking-tighter leading-[0.85] mb-8"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            WE BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-600">
              REALITIES
            </span>
          </h1>

          <FadeIn delay={300}>
            <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              Merging brutalist typography with fluid interactions to create experiences that feel both expensive and effortless.
            </p>
          </FadeIn>
        </div>

        <div className="absolute bottom-12 animate-bounce text-neutral-500">
          <ArrowDown size={32} strokeWidth={1} />
        </div>
      </section>

      {/* Glassmorphism Секция (О нас) */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-24 shadow-2xl relative overflow-hidden">
            {/* Внутренний блик для эффекта стекла */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <FadeIn>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                    The intersection of <br/> <span className="italic font-serif text-neutral-400">art & logic.</span>
                  </h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                    Мы не просто делаем сайты. Мы проектируем цифровые экосистемы. Наш подход основан на строгих сетках, выверенной типографике и анимациях, которые направляют внимание пользователя.
                  </p>
                </FadeIn>
                <FadeIn delay={400}>
                  <button className="flex items-center gap-3 text-lg font-bold border-b border-white pb-1 hover:text-neutral-400 hover:border-neutral-400 transition-all">
                    Our Philosophy <ArrowRight size={20} />
                  </button>
                </FadeIn>
              </div>

              {/* Абстрактное фото / Иллюстрация */}
              <div className="relative h-[60vh] rounded-2xl overflow-hidden">
                <FadeIn delay={300} direction="left">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
                    alt="Abstract 3D rendering" 
                    className="w-full h-full object-cover rounded-2xl scale-110"
                    style={{ transform: `translateY(${(scrollY - 800) * 0.1}px)` }} // Легкий параллакс внутри контейнера
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Огромные кейсы (Скролл секвенция) */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-[10vw] md:text-[6vw] font-black tracking-tighter mb-24 border-b border-white/10 pb-12">
              SELECTED WORK.
            </h2>
          </FadeIn>

          <div className="space-y-32">
            {/* Case 1 */}
            <div className="group cursor-pointer">
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 order-2 md:order-1">
                    <p className="text-sm font-bold tracking-widest text-neutral-500 mb-4">01 — FASHION</p>
                    <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 group-hover:text-purple-400 transition-colors duration-500">
                      Vogue <br/>Archive
                    </h3>
                    <p className="text-xl text-neutral-400">Interactive editorial experience.</p>
                  </div>
                  <div className="md:col-span-7 order-1 md:order-2 overflow-hidden rounded-3xl aspect-[4/3]">
                    <img 
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
                      alt="Fashion Case Study" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-80 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Case 2 */}
            <div className="group cursor-pointer">
              <FadeIn delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 overflow-hidden rounded-3xl aspect-[4/3]">
                    <img 
                      src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" 
                      alt="Tech Case Study" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <div className="md:col-span-5 md:pl-12">
                    <p className="text-sm font-bold tracking-widest text-neutral-500 mb-4">02 — TECHNOLOGY</p>
                    <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 group-hover:text-blue-400 transition-colors duration-500">
                      Neural <br/>Systems
                    </h3>
                    <p className="text-xl text-neutral-400">AI interface and brand identity.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Огромный бегущий текст (Marquee) и футер */}
      <section className="py-32 overflow-hidden relative border-t border-white/10">
        <div className="absolute w-[200vw] flex whitespace-nowrap opacity-10">
          <h2 className="text-[20vw] font-black tracking-tighter uppercase" style={{ transform: `translateX(${-scrollY * 0.5}px)` }}>
            LET'S CREATE SOMETHING EPIC • LET'S CREATE SOMETHING EPIC •
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
          <FadeIn>
            <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-12">
              Ready to stand out?
            </h2>
            <button className="bg-white text-black px-12 py-6 rounded-full text-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start a Project
            </button>
          </FadeIn>
        </div>
      </section>
      
    </div>
  );
}