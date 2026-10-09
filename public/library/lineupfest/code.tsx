import React, { useState } from 'react';

// Объединил все данные в один массив для удобства
const lineupData = [
  {
    id: 1,
    name: "GOINMAN",
    bio: "Gloomy industrial from the sleep districts. Synths and distortion.",
    img: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/3163534/3163534-sd_640_360_30fps.mp4",
    rotation: -2
  },
  {
    id: 2,
    name: "VIKUSIA",
    bio: "Experimental pop passed through a glitch meat grinder.",
    img: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/5342978/5342978-sd_360_640_25fps.mp4",
    rotation: 3
  },
  {
    id: 3,
    name: "TERROR PHOENIX",
    bio: "Hardcore punk riffs and lyrics about the inevitable.",
    img: "https://images.unsplash.com/photo-1621360811013-c76831f1628c?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/4320456/4320456-sd_640_360_25fps.mp4",
    rotation: -1
  },
  {
    id: 4,
    name: "SVAZ",
    bio: "Micro-text: the sound of tearing metal in an empty room.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/3163534/3163534-sd_640_360_30fps.mp4",
    rotation: 4
  },
  {
    id: 5,
    name: "SPIRAL SADNESS",
    bio: "Emo revival, tears on the dancefloor, raw vocals.",
    img: "https://images.unsplash.com/photo-1493225457124-a1a2a5fa596d?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/5342978/5342978-sd_360_640_25fps.mp4",
    rotation: -3
  },
  {
    id: 6,
    name: "SEILOR MOON",
    bio: "Abstract hip-hop with samples from old anime.",
    img: "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?auto=format&fit=crop&q=80&w=400",
    video: "https://videos.pexels.com/video-files/4320456/4320456-sd_640_360_25fps.mp4",
    rotation: 2
  },
  {
    id: 7, 
    name: "ANGST", 
    bio: "Cold wave, synthesizers, despair.", 
    img: "https://images.unsplash.com/photo-1599423423926-a0afc962b0e6?auto=format&fit=crop&q=80&w=400", 
    video: "https://videos.pexels.com/video-files/5342978/5342978-sd_360_640_25fps.mp4", 
    rotation: 1
  },
  {
    id: 8, 
    name: "EIZOLA", 
    bio: "Audiovisual performance. Strobes and drone.", 
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400", 
    video: "https://videos.pexels.com/video-files/3163534/3163534-sd_640_360_30fps.mp4", 
    rotation: -2
  },
  {
    id: 9, 
    name: "WASTED DAYS", 
    bio: "They will close this festival. Loud and fast.", 
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400", 
    video: "https://videos.pexels.com/video-files/4320456/4320456-sd_640_360_25fps.mp4", 
    rotation: 3
  }
];

export default function App() {
  // Стейт для хранения артиста, на которого сейчас наведена мышка
  const [activeArtist, setActiveArtist] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans flex flex-col items-center py-20">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');

        .font-marker {
          font-family: 'Rock Salt', cursive;
        }

        .noise-bg {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .torn-paper {
          filter: url(#torn-edge);
          background-color: white;
          color: black;
        }
      `}} />

      {/* SVG Фильтр для списка */}
      <svg width="0" height="0" className="absolute">
        <filter id="torn-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="noise-bg"></div>

      {/* --- ГЛОБАЛЬНЫЕ ЭЛЕМЕНТЫ ПРИ НАВЕДЕНИИ --- */}
      {activeArtist && (
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300">
          
          {/* 1. Видео на фоне (заполняет весь экран, полупрозрачное) */}
          <video 
            src={activeArtist.video} 
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />

          {/* 2. Фото и текст слева */}
          <div className="hidden md:flex absolute left-8 top-8 w-[30vw] flex-col items-start gap-4">
            {/* Фото в левом верхнем углу */}
            <img 
              src={activeArtist.img} 
              alt={activeArtist.name} 
              className="max-w-[250px] max-h-[300px] object-contain filter grayscale"
            />
            {/* Блок с информацией (текстом) - белый фон, черный текст */}
            <div className="max-w-[300px] bg-white p-4 text-left">
              <p className="text-sm font-bold uppercase leading-tight tracking-widest text-black">
                {activeArtist.bio}
              </p>
            </div>
          </div>

          {/* 3. Чистое видео справа (сохраняет пропорции, без рамок) */}
          {/* hidden md:flex скрывает его на телефонах, чтобы не перекрывало текст */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-[35vw] h-[80vh] items-center justify-end">
            <video 
              src={activeArtist.video} 
              autoPlay loop muted playsInline
              className="max-w-full max-h-full object-contain filter grayscale"
            />
          </div>
          
        </div>
      )}

      {/* --- ЦЕНТРАЛЬНЫЙ СПИСОК АРТИСТОВ --- */}
      {/* z-10 чтобы список всегда был поверх видео и картинок */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 relative z-10">
        
        {lineupData.slice(0, 6).map((artist) => (
          <div 
            key={artist.id} 
            className="relative flex justify-center w-full cursor-crosshair"
            onMouseEnter={() => setActiveArtist(artist)}
            onMouseLeave={() => setActiveArtist(null)}
          >
            {/* Полоска с именем (рваная бумага) */}
            <div 
              className="torn-paper px-6 py-2 sm:px-12 sm:py-4 transition-transform duration-200 hover:scale-110"
              style={{ transform: `rotate(${artist.rotation}deg)` }}
            >
              <h2 className="font-marker text-xl sm:text-3xl tracking-widest uppercase">
                {artist.name}
              </h2>
            </div>
          </div>
        ))}

        {/* Иллюстрация / Логотип по центру (как на референсе) */}
        <div className="my-8 relative z-10">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center filter invert mix-blend-difference">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        {lineupData.slice(6).map((artist) => (
          <div 
            key={artist.id} 
            className="relative flex justify-center w-full cursor-crosshair"
            onMouseEnter={() => setActiveArtist(artist)}
            onMouseLeave={() => setActiveArtist(null)}
          >
            <div 
              className="torn-paper px-6 py-2 sm:px-12 sm:py-4 transition-transform duration-200 hover:scale-110"
              style={{ transform: `rotate(${artist.rotation}deg)` }}
            >
              <h2 className="font-marker text-xl sm:text-3xl tracking-widest uppercase">
                {artist.name}
              </h2>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}