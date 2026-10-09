import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Rewind, Volume2, VolumeX, ArrowUpRight, Crosshair } from 'lucide-react';

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [lang, setLang] = useState('UA');
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const audioRef = useRef(null);

  const playlist = [
    { title: "Chaosy - Unreleased Track 1", duration: "03:45" },
    { title: "Ara - Live Session", duration: "04:20" },
    { title: "Secret Guest - B2B Mix", duration: "59:00" }
  ];

  // Плавне відстеження скролу для паралаксу
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length);

  return (
    // Змінили шрифт на базовий sans, який ти потім заміниш на свій гротеск або антикву
    <div className="relative w-full bg-[#0a0a0a] text-zinc-100 font-sans min-h-[300vh] selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* 1. ФОН: Абстрактне відео + Легкий шум */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <video 
          autoPlay loop muted playsInline 
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
        >
          {/* Приклад абстрактного відео. Можна замінити на ваші зйомки */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-background-with-fluid-waves-41454-large.mp4" type="video/mp4" />
        </video>
        {/* Делікатний статичний шум */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* 2. МІНІМАЛІСТИЧНИЙ ХЕДЕР */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-50 mix-blend-difference text-white">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest font-bold">May PRG</span>
          <span className="text-xs text-zinc-400">8–9.05.2026</span>
        </div>

        {/* Перемикач мов (чистий текст) */}
        <div className="flex gap-4 pointer-events-auto">
          {['UA', 'EN', 'CZ'].map((l) => (
            <button 
              key={l} 
              onClick={() => setLang(l)}
              className={`text-xs uppercase tracking-widest transition-colors ${
                lang === l ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      {/* 3. ГОЛОВНИЙ ЕКРАН (HERO) */}
      <section className="relative h-screen w-full flex items-center justify-center z-10">
        <div className="text-center relative">
          <h1 
            className="text-[12vw] leading-none font-black uppercase tracking-tighter mix-blend-overlay opacity-90"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            SOLIDARITY
          </h1>
          <h1 
            className="text-[12vw] leading-none font-black uppercase tracking-tighter text-transparent"
            style={{ 
              WebkitTextStroke: '1px rgba(255,255,255,0.8)',
              transform: `translateY(${scrollY * 0.3}px)` 
            }}
          >
            WEEKEND
          </h1>

          {/* ПРИКЛАД АСЕТА 1: Плаваючий об'єкт (PNG/JPG) на задньому плані */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] -z-10 rounded-full blur-[2px] opacity-60 mix-blend-screen animate-pulse-slow"
            style={{ transform: `translate(-50%, calc(-50% + ${scrollY * 0.1}px)) rotate(${scrollY * 0.05}deg)` }}
          >
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
              alt="Abstract 3D Shape placeholder" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </section>

      {/* 4. ЛАЙНАП (Сучасний інтерактивний список) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="mb-12 flex justify-between items-end border-b border-zinc-800 pb-4">
          <h2 className="text-2xl uppercase tracking-widest font-light">Lineup</h2>
          <span className="text-xs text-zinc-500 uppercase">Curated selection</span>
        </div>

        <div className="flex flex-col w-full">
          {/* Артист 1 */}
          <div className="group relative border-b border-zinc-900/50 py-12 md:py-16 cursor-pointer flex justify-between items-center transition-colors hover:text-white text-zinc-500">
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">Chaosy</h3>
            <span className="text-sm md:text-lg tracking-widest font-light uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">DJ / Live</span>
            
            {/* ПРИКЛАД АСЕТА 2: Картинка, що з'являється при наведенні (Hover Reveal) */}
            <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100 z-20 overflow-hidden mix-blend-luminosity">
              <img 
                src="https://images.unsplash.com/photo-1571266028243-cb40fce7573a?q=80&w=800&auto=format&fit=crop" 
                alt="Artist preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Артист 2 */}
          <div className="group relative border-b border-zinc-900/50 py-12 md:py-16 cursor-pointer flex justify-between items-center transition-colors hover:text-white text-zinc-500">
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">ARA</h3>
            <span className="text-sm md:text-lg tracking-widest font-light uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Live Band</span>
            
            {/* ПРИКЛАД АСЕТА 3 */}
            <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-[400px] h-[250px] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100 z-20 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop" 
                alt="Band preview" 
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>
          </div>

          {/* Артист 3 */}
          <div className="group relative border-b border-zinc-900/50 py-12 md:py-16 cursor-pointer flex justify-between items-center transition-colors hover:text-white text-zinc-500">
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic group-hover:translate-x-4 transition-transform duration-500">TBA Guest</h3>
            <span className="text-sm md:text-lg tracking-widest font-light uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Secret Set</span>
          </div>
        </div>
      </section>

      {/* 5. ФАНДРЕЙЗИНГ (Bento-box grid style) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Головний блок збору */}
          <div className="md:col-span-8 bg-zinc-900/30 backdrop-blur-md border border-zinc-800 p-8 md:p-12 rounded-3xl flex flex-col justify-between overflow-hidden relative">
            {/* ПРИКЛАД АСЕТА 4: Фонова текстура/градієнт для блоку */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Crosshair size={20} className="text-zinc-400" />
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Target: FPV Drones</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight max-w-2xl">
                All funds raised during the two-day event will directly support FPV drone production for Ukraine.
              </h2>
            </div>
            
            <div className="mt-12 flex items-baseline gap-4">
              <span className="text-6xl md:text-8xl font-black tracking-tighter">084,500</span>
              <span className="text-xl text-zinc-500 uppercase tracking-widest">UAH</span>
            </div>
          </div>

          {/* Кнопки (Квитки та Донат) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <a href="https://goout.net" target="_blank" rel="noreferrer" className="flex-1 bg-white text-black p-8 rounded-3xl flex flex-col justify-between group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-sm uppercase tracking-widest font-bold">Tickets</span>
                <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter mt-8">GoOut.net</span>
            </a>
            
            <a href="https://send.monobank.ua" target="_blank" rel="noreferrer" className="flex-1 bg-transparent border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between group hover:bg-zinc-900 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm uppercase tracking-widest font-bold text-zinc-400">Direct Support</span>
                <ArrowUpRight size={24} className="text-zinc-400 group-hover:rotate-45 transition-transform" />
              </div>
              <span className="text-2xl font-light mt-8">Monobank Jar</span>
            </a>
          </div>

        </div>
      </section>

      {/* 6. ФУТЕР (Організатори) */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 mb-24">
        <span className="text-xs uppercase tracking-widest text-zinc-600">Curators</span>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm uppercase tracking-widest font-bold text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">@sest_tisicu_ovecek</a>
          <a href="#" className="hover:text-white transition-colors">@evro_661</a>
          <a href="#" className="hover:text-white transition-colors">@resistancesupportclub</a>
        </div>
      </footer>

      {/* 7. ПЛЕЄР (Glassmorphism Pill) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
        
        {/* Інфо про трек */}
        <div className="flex flex-col overflow-hidden w-1/2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            {isPlaying && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
            Playing
          </span>
          <div className="whitespace-nowrap overflow-hidden text-sm font-bold truncate">
            {playlist[currentTrack].title}
          </div>
        </div>

        {/* Контроли */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
            <button className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <Rewind size={16} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-1.5 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <FastForward size={16} />
            </button>
          </div>
        </div>

        {/* Прихований аудіо елемент */}
        <audio ref={audioRef} loop muted={isMuted}>
          <source src="https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </div>
  );
}