import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Terminal, Volume2 } from 'lucide-react';

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const audioRef = useRef(null);

  // Моковые треки (потом заменишь на свои mp3)
  const tracks = [
    "Chaosy - Underground Vibe (Demo)",
    "Ara - Live at the basement",
    "Secret Track - Unknown"
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Эффект зума для дверей
  const doorScale = 1 + scrollY * 0.005;
  const doorOpacity = Math.max(1 - scrollY * 0.002, 0);
  const contentOpacity = Math.min(scrollY * 0.002, 1);

  return (
    <div className="min-h-[300vh] bg-black text-white font-mono overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Прихований аудіо плеєр */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://actions.google.com/sounds/v1/foley/cassette_tape_button.ogg" // Заглушка, заміниш на своє
      />

      {/* --- HEADER / NAVIGATION (FIXED) --- */}
      <header className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center mix-blend-difference pointer-events-none">
        {/* Мови */}
        <div className="flex gap-4 text-sm font-bold tracking-widest pointer-events-auto">
          <button className="hover:text-red-500 hover:line-through transition-all">UA</button>
          <button className="text-gray-500 hover:text-red-500 transition-all">EN</button>
          <button className="text-gray-500 hover:text-red-500 transition-all">CZ</button>
        </div>

        {/* Каунтер донатів / Кнопка */}
        <div className="pointer-events-auto cursor-pointer group" onClick={() => setShowDonate(true)}>
          <div className="border-2 border-white px-4 py-1 flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all">
            <span className="animate-pulse">●</span> DONATE / FUNDRAISER
          </div>
        </div>
      </header>

      {/* --- CUSTOM AUDIO PLAYER (FIXED BOTTOM) --- */}
      <div className="fixed bottom-4 left-4 right-4 z-50 border-2 border-white bg-black/80 backdrop-blur-sm p-2 flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={toggleAudio}
          className="p-2 border border-white hover:bg-white hover:text-black transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <Volume2 size={16} className="hidden sm:block" />
        <div className="overflow-hidden whitespace-nowrap w-full border-l border-white pl-4">
          <div className="inline-block animate-[marquee_10s_linear_infinite] uppercase tracking-widest text-sm">
            NOW PLAYING: {tracks[currentTrackIndex]} *** SOLIDARITY PARTY PRAGUE *** </div>
        </div>
      </div>

      {/* --- WIN98 DONATE MODAL --- */}
      {showDonate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#c0c0c0] text-black w-full max-w-md border-t-2 border-l-2 border-t-white border-l-white border-b-4 border-r-4 border-b-gray-800 border-r-gray-800 shadow-2xl">
            {/* Header */}
            <div className="bg-[#000080] text-white flex justify-between items-center px-2 py-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Terminal size={14} /> FPV_DRONES_FUND.exe
              </div>
              <button 
                onClick={() => setShowDonate(false)}
                className="bg-[#c0c0c0] text-black w-5 h-5 flex justify-center items-center font-bold border-t border-l border-white border-b-2 border-r-2 border-gray-800 hover:active:border-t-2 hover:active:border-l-2 hover:active:border-gray-800 hover:active:border-b hover:active:border-r hover:active:border-white"
              >
                <X size={14} />
              </button>
            </div>
            {/* Body */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <img src="front.png" alt="icon" className="w-12 h-12 mix-blend-multiply" />
                <p className="text-sm">
                  Всі зібрані кошти будуть передані фондам, які підтримують виробництво FPV-дронів для України.
                </p>
              </div>
              <div className="space-y-2 text-sm font-bold">
                <div className="bg-white border-inset border-2 border-gray-400 p-2 cursor-text select-all">
                  Monobank: 5375 0000 0000 0000
                </div>
                <div className="bg-white border-inset border-2 border-gray-400 p-2 cursor-text select-all">
                  PayPal: charity@example.com
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setShowDonate(false)}
                  className="px-6 py-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-2 active:border-l-2 active:border-gray-800 active:border-b-2 active:border-r-2 active:border-white"
                >
                  ОК
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INTRO / DOORS SCENE (STICKY) --- */}
      <div 
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-30"
        style={{
          transform: `scale(${doorScale})`,
          opacity: doorOpacity,
        }}
      >
        {/* Замість реальних дверей, використовуємо твою картинку, вона буде збільшуватись і зникати */}
        <img 
          src="ChatGPT Image Mar 26, 2026 at 08_33_34 PM.jpg" 
          alt="Doors" 
          className="w-full max-w-4xl h-auto object-cover opacity-80 mix-blend-lighten"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-pulse">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mix-blend-difference">SCROLL</h1>
          <p className="mt-4 tracking-widest">TO ENTER</p>
        </div>
      </div>

      {/* --- MAIN CONTENT (SCROLLABLE) --- */}
      <div 
        className="relative z-20 flex flex-col items-center"
        style={{ marginTop: '100vh', opacity: contentOpacity }} // Контент з'являється після прокрутки першого екрану
      >
        
        {/* Hero Graphic */}
        <section className="w-full min-h-screen flex flex-col items-center justify-center relative p-4">
          <img 
            src="photo_2026-04-12 15.20.43.jpeg" 
            alt="Main Graphic" 
            className="w-full max-w-3xl invert mix-blend-screen" // Інвертуємо щоб чорний став білим
          />
          
          <div className="mt-12 text-center max-w-2xl space-y-6 bg-black/60 p-8 border border-white/20 backdrop-blur-sm relative">
             <img src="front.png" className="absolute -top-10 -left-10 w-24 h-24 invert mix-blend-screen opacity-50 rotate-12" alt="rabbit" />
            <h2 className="text-2xl font-bold">БЛАГОДІЙНИЙ КОНЦЕРТ / ВЕЧІРКА СОЛІДАРНОСТІ</h2>
            <p className="text-gray-400">
              Це дводенний благодійний захід зі збору коштів для України.
              8–9 травня. Прага. 
            </p>
            <a 
              href="https://goout.net" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-4 bg-white text-black font-bold py-3 px-8 text-xl hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              [ КВИТКИ НА GOOUT ]
            </a>
          </div>
        </section>

        {/* Lineup Section */}
        <section className="w-full min-h-screen flex flex-col items-center justify-center relative py-20 overflow-hidden">
          {/* Glitchy background characters */}
          <img 
            src="characters.jpg" 
            alt="Characters" 
            className="absolute top-10 right-0 w-[500px] opacity-30 mix-blend-lighten blur-[2px] animate-pulse"
          />
          <img 
            src="dgjhgf.jpg" 
            alt="Dates" 
            className="absolute bottom-10 left-10 w-[300px] opacity-40 mix-blend-lighten"
          />

          <h2 className="text-6xl font-black mb-16 tracking-widest z-10 mix-blend-difference">LINE UP</h2>
          
          <div className="z-10 relative">
            {/* Твій мальований лайнап */}
            <img 
              src="lineup.jpg" 
              alt="Lineup" 
              className="w-full max-w-md invert mix-blend-screen hover:scale-105 transition-transform duration-700"
            />
          </div>
        </section>

        {/* Info & Footer */}
        <section className="w-full py-20 px-4 border-t border-white/20 flex flex-col items-center text-center relative">
          <img 
            src="front texxt.png" 
            alt="6k ovecek" 
            className="w-full max-w-xl invert mix-blend-screen mb-12 opacity-80"
          />
          
          <div className="flex flex-wrap justify-center gap-8 text-xl underline underline-offset-8 mb-20">
            <a href="https://www.instagram.com/sest_tisicu_ovecek" className="hover:text-red-500">@sest_tisicu_ovecek</a>
            <a href="https://www.instagram.com/evro_661" className="hover:text-red-500">@evro_661</a>
            <a href="https://www.instagram.com/resistancesupportclub" className="hover:text-red-500">@resistancesupportclub</a>
          </div>

          <p className="text-sm text-gray-600">
            © 2026. Design by You. Code by Gemini. <br/>
            Слава Україні!
          </p>
        </section>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        /* Додатковий глітч-ефект на виділення */
        ::selection { background: #ff0000; color: #fff; }
      `}} />
    </div>
  );
};

export default App;