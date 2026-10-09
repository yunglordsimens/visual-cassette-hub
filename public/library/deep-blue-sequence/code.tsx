import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Droplet, Layers, Type, MoveUpRight } from 'lucide-react';

// Custom hook for smooth parallax scroll values
const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return scrollY;
};

export default function App() {
  const scrollY = useScroll();
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate normalized scroll progress for specific sections
  const getProgress = (start, end) => {
    const progress = (scrollY - start) / (end - start);
    return Math.max(0, Math.min(1, progress));
  };

  // The Deep Blue Palette
  const colors = [
    { name: 'Midnight Abyss', hex: '#030B1C', text: 'text-blue-100' },
    { name: 'Trench Navy', hex: '#0A1930', text: 'text-blue-100' },
    { name: 'Oceanic Shadow', hex: '#112A46', text: 'text-blue-50' },
    { name: 'Bioluminescent Cyan', hex: '#00F0FF', text: 'text-[#030B1C]' },
  ];

  return (
    <div className="bg-gradient-to-b from-black via-[#030B1C] to-[#02050D] text-blue-50 min-h-screen overflow-hidden font-sans selection:bg-[#00F0FF] selection:text-[#030B1C]">
      {/* Inject custom fonts for typographic showcase */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Grotesk:wght@300;400;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-style { font-family: 'Space Grotesk', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* FIXED BACKGROUND ELEMENTS (Parallaxing behind everything) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Deep background glow */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00F0FF] opacity-[0.03] blur-[100px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#112A46] opacity-[0.4] blur-[120px]"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />
        {/* Floating geometric lines */}
        <div 
          className="absolute top-[30%] right-[10%] w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-20"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute top-[60%] left-[5%] w-[1px] h-[40vh] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
      </div>

      {/* SECTION 1: HERO (ECLIPSE SEQUENCE) */}
      <section className="relative h-[120vh] flex flex-col items-center justify-start z-10 pt-[15vh]">
        {/* Eclipse Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            const progress = 1 - (i / 7); // 1 (top/brightest) to 0 (bottom/faintest)
            return (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 rounded-full border-t"
                style={{
                  width: `${100 + i * 15}vw`, // Arcs get wider/flatter
                  height: `${100 + i * 15}vw`,
                  top: `${i * 12 + 5}vh`,
                  transform: `translateX(-50%) translateY(${scrollY * (0.15 + i * 0.05)}px)`,
                  borderColor: `rgba(255, ${220 + progress * 35}, ${230 + progress * 25}, ${0.1 + progress * 0.8})`,
                  boxShadow: `inset 0 15px 40px -15px rgba(255,255,255,${progress * 0.3})`,
                }}
              >
                {/* Main Intense Core */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-[1.5%] rounded-full bg-white mix-blend-screen"
                  style={{
                    width: `${10 + progress * 30}%`,
                    height: `${5 + progress * 20}px`,
                    filter: `blur(${8 + progress * 15}px)`,
                    opacity: progress * 1.5,
                  }}
                />
                
                {/* Secondary Core (Brighter center) */}
                {progress > 0.3 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -top-[0.5%] rounded-full bg-white"
                    style={{
                      width: `${5 + progress * 15}%`,
                      height: `${2 + progress * 10}px`,
                      filter: `blur(${2 + progress * 4}px)`,
                      opacity: progress,
                    }}
                  />
                )}

                {/* Pink/Red Solar Prominence (Right) */}
                {progress > 0.1 && (
                  <div
                    className="absolute -top-[0.5%] left-[65%] rounded-full bg-rose-500 mix-blend-screen"
                    style={{
                      width: `${1 + progress * 4}%`,
                      height: `${4 + progress * 12}px`,
                      filter: `blur(${2 + progress * 4}px)`,
                      transform: `rotate(15deg)`,
                      opacity: 0.4 + progress * 0.6,
                    }}
                  />
                )}
                
                {/* Small flare (Left) */}
                {i % 2 === 0 && progress > 0.2 && (
                  <div
                    className="absolute -top-[0.2%] left-[32%] rounded-full bg-pink-400 mix-blend-screen"
                    style={{
                      width: `${1 + progress * 2}%`,
                      height: `${2 + progress * 6}px`,
                      filter: `blur(${1 + progress * 3}px)`,
                      transform: `rotate(-10deg)`,
                      opacity: 0.3 + progress * 0.5,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Hero Content Overlay */}
        <div 
          className="text-center z-20 flex flex-col items-center mt-[20vh]"
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: 1 - scrollY / (windowHeight * 0.6) }}
        >
          <p className="font-mono-style tracking-[0.3em] text-sm text-[#00F0FF] mb-6 uppercase flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#00F0FF]"></span>
            Solar Sequence
            <span className="w-8 h-[1px] bg-[#00F0FF]"></span>
          </p>
          <h1 className="font-display text-[12vw] leading-[0.85] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-transparent">
            DEEP<br/>BLUE
          </h1>
          <p className="mt-8 font-mono-style text-lg md:text-xl text-blue-200/60 max-w-md font-light">
            A scroll-driven exploration of astronomical depth, color theory, and layered structures.
          </p>
        </div>

        {/* Foreground parallax elements */}
        <div 
          className="absolute bottom-20 left-10 md:left-24 font-mono-style text-xs text-blue-400/50 tracking-widest z-20"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        >
          SCROLL TO DESCEND
        </div>
        
        <div 
          className="absolute bottom-10 animate-bounce text-[#00F0FF] z-20"
          style={{ opacity: 1 - scrollY / 300 }}
        >
          <ArrowDown size={24} strokeWidth={1.5} />
        </div>
      </section>

      {/* SECTION 2: COLOR SHOWCASE */}
      <section className="relative min-h-screen py-32 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div 
            className="mb-24 md:w-1/2"
            style={{ transform: `translateY(${Math.max(0, (scrollY - windowHeight/2) * 0.1)}px)` }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Chromatic<br/>Shift</h2>
            <p className="font-mono-style text-blue-200/70 leading-relaxed text-lg font-light">
              Exploring the emotional resonance of the deep blue spectrum. The transition from midnight abyss to bioluminescent cyan creates a narrative of descent and discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color, index) => {
              // Staggered parallax for cards
              const cardOffset = scrollY > windowHeight * 0.5 ? (scrollY - windowHeight * 0.5) * (0.05 + index * 0.05) : 0;
              
              return (
                <div 
                  key={color.hex}
                  className="group relative h-80 rounded-2xl p-6 flex flex-col justify-end overflow-hidden transition-transform duration-700 ease-out border border-white/5"
                  style={{ 
                    backgroundColor: color.hex,
                    transform: `translateY(-${cardOffset}px)`,
                  }}
                >
                  <div className={`relative z-10 ${color.text}`}>
                    <div className="flex justify-between items-end mb-2">
                      <p className="font-display font-bold text-xl">{color.name}</p>
                      <Droplet size={18} className="opacity-50" />
                    </div>
                    <p className="font-mono-style text-sm opacity-70 tracking-widest">{color.hex}</p>
                  </div>
                  
                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: TYPOGRAPHY & DESIGN SHOWCASE (Nod to Umprum) */}
      <section className="relative min-h-[150vh] py-32 z-10 flex flex-col justify-center">
        {/* Abstract typography background */}
        <div 
          className="absolute right-[-10vw] top-[20%] font-display font-bold text-[30vw] leading-none text-white/[0.02] select-none pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          Aa
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image/Visual Placeholder */}
            <div className="lg:col-span-7 relative">
              <div 
                className="aspect-[4/3] rounded-sm overflow-hidden relative"
                style={{ transform: `translateY(${scrollY * 0.05}px)` }}
              >
                {/* Parallax Image inside container */}
                <img 
                  src="https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Abstract Blue" 
                  className="absolute inset-0 w-full h-[120%] object-cover opacity-80 mix-blend-screen grayscale-[20%] sepia-[10%] hue-rotate-180"
                  style={{ transform: `translateY(${(scrollY * -0.1)}px)` }}
                />
                <div className="absolute inset-0 border border-white/10" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono-style text-xs text-white/50 tracking-widest">
                  <span>FIG. 01</span>
                  <span>STRUCTURAL TENSION</span>
                </div>
              </div>
            </div>

            {/* Typography Focus Content */}
            <div className="lg:col-span-5 relative">
              <div style={{ transform: `translateY(${scrollY * -0.08}px)` }}>
                <div className="w-12 h-12 rounded-full border border-[#00F0FF]/30 flex items-center justify-center mb-8 text-[#00F0FF]">
                  <Type size={20} />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-[1.1]">
                  Letterforms as<br/>Architecture.
                </h2>
                <div className="space-y-6 font-mono-style text-blue-200/70 font-light">
                  <p>
                    Approaching typography not just as readable text, but as structural elements within the composition. The interplay of weight, negative space, and geometry creates a visual rhythm.
                  </p>
                  <p>
                    By utilizing high contrast in font families—pairing the brutalist elegance of <em>Syne</em> with the technical precision of <em>Space Grotesk</em>—we achieve a dynamic tension.
                  </p>
                </div>
                
                <div className="mt-12 flex gap-4">
                  <div className="flex-1 border-t border-white/10 pt-4">
                    <p className="font-mono-style text-xs text-white/40 mb-1">PRIMARY</p>
                    <p className="font-display text-xl">Syne (Display)</p>
                  </div>
                  <div className="flex-1 border-t border-white/10 pt-4">
                    <p className="font-mono-style text-xs text-white/40 mb-1">SECONDARY</p>
                    <p className="font-mono-style text-xl">Space Grotesk</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: LAYERED PARALLAX FOOTER SEQUENCE */}
      <section className="relative h-screen flex flex-col items-center justify-center z-10 overflow-hidden bg-[#02050D]">
        {/* Layer 1: Background massive text */}
        <div 
          className="absolute font-display font-black text-[25vw] text-[#0A1930]/40 whitespace-nowrap"
          style={{ transform: `translateX(${(scrollY - windowHeight * 2) * -0.5}px)` }}
        >
          DESIGN & COLOR
        </div>
        
        {/* Layer 2: Foreground massive text moving opposite */}
        <div 
          className="absolute font-display font-black text-[25vw] text-transparent [-webkit-text-stroke:1px_#112A46] whitespace-nowrap mix-blend-overlay"
          style={{ transform: `translateX(${(scrollY - windowHeight * 2) * 0.5}px)` }}
        >
          SEQUENCE
        </div>

        {/* Center UI block */}
        <div 
          className="relative z-20 bg-[#030B1C]/80 backdrop-blur-xl border border-white/10 p-12 rounded-2xl max-w-lg text-center mx-6 shadow-[0_0_50px_rgba(0,240,255,0.05)]"
          style={{ transform: `translateY(${Math.max(0, (scrollY - windowHeight * 2.5) * -0.2)}px)` }}
        >
          <Layers className="mx-auto mb-6 text-[#00F0FF]" size={32} />
          <h3 className="font-display text-3xl font-bold mb-4">Ready to Surface</h3>
          <p className="font-mono-style text-blue-200/60 font-light mb-8">
            This sequence demonstrates how scroll velocity, layering, and a restricted color palette can create a highly immersive digital experience.
          </p>
          <button className="group relative font-mono-style text-sm tracking-widest bg-white text-[#030B1C] px-8 py-4 rounded-full overflow-hidden transition-all hover:bg-[#00F0FF]">
            <span className="relative z-10 flex items-center gap-2 font-bold">
              BACK TO TOP <MoveUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#02050D_100%)] opacity-80" />
      </section>

    </div>
  );
}