import React, { useEffect, useRef, useState } from 'react';

// Разбили текст на большее количество строк для максимального размера букв
const DEFAULT_WORD = 'ARTSEMESTR\nSS26\nKŘIŽÍKOVA 12\n[C11]\n03—10/06';

export default function App() {
  const containerRef = useRef(null);
  const [effect, setEffect] = useState('waves');
  const [isLoaded, setIsLoaded] = useState(false);

  // Определение системной темы (светлая/темная)
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = e => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const colorsRef = useRef({ bg: 0, fg: 255 });
  useEffect(() => {
    colorsRef.current = isDark ? { bg: 20, fg: 235 } : { bg: 240, fg: 20 };
  }, [isDark]);

  const effectRef = useRef(effect);
  useEffect(() => { effectRef.current = effect; }, [effect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let p5Instance;

    let offCanvas = document.createElement('canvas');
    let offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    let pixelData = null;
    let typed = '';
    let needsRedraw = true;

    // Обработка ввода с клавиатуры
    const onKey = (e) => {
      if (e.key === 'Backspace') {
        typed = typed.slice(0, -1);
      } else if (e.key === 'Enter') {
        typed += '\n'; 
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        typed += e.key.toUpperCase();
      } else {
        return;
      }
      needsRedraw = true;
    };
    window.addEventListener('keydown', onKey);

    function resizeBuffer(w, h) {
      offCanvas.width = w;
      offCanvas.height = h;
    }

    function renderTextToBuffer() {
      const w = offCanvas.width;
      const h = offCanvas.height;
      const textToRender = typed || DEFAULT_WORD;
      const lines = textToRender.split('\n');

      offCtx.clearRect(0, 0, w, h);
      offCtx.fillStyle = '#000';
      offCtx.fillRect(0, 0, w, h);

      // Увеличили пропорцию: текст занимает до 80% высоты
      let fontSize = Math.max(20, (h * 0.8) / (lines.length || 1));
      
      offCtx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
      
      let maxLineWidth = 0;
      lines.forEach(line => {
        const width = offCtx.measureText(line).width;
        if (width > maxLineWidth) maxLineWidth = width;
      });

      if (maxLineWidth > w * 0.9) {
        fontSize *= (w * 0.9) / maxLineWidth;
      }

      offCtx.fillStyle = '#fff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
      offCtx.letterSpacing = "-2px"; 

      // Плотный интервал
      const lineHeight = fontSize * 0.85;
      const totalHeight = lines.length * lineHeight;
      const startY = (h - totalHeight) / 2 + lineHeight / 2;

      // 1. Рисуем размытую тень для плавных склонов
      offCtx.filter = 'blur(6px)';
      lines.forEach((line, i) => offCtx.fillText(line, w / 2, startY + i * lineHeight));

      // 2. Рисуем четкий текст поверх
      offCtx.filter = 'none';
      lines.forEach((line, i) => offCtx.fillText(line, w / 2, startY + i * lineHeight));

      pixelData = offCtx.getImageData(0, 0, w, h).data;
      needsRedraw = false;
    }

    const loadP5 = () => {
      return new Promise((resolve) => {
        if (window.p5) return resolve(window.p5);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js';
        script.onload = () => resolve(window.p5);
        document.body.appendChild(script);
      });
    };

    loadP5().then((p5Module) => {
      const p5 = p5Module;
      setIsLoaded(true);

      const sketch = p => {
        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.frameRate(60);
          resizeBuffer(p.width, p.height);
          renderTextToBuffer();
        };

        p.draw = () => {
          if (needsRedraw) renderTextToBuffer();

          const { bg, fg } = colorsRef.current;
          p.background(bg);

          if (!pixelData) return;
          const w = offCanvas.width;
          const h = offCanvas.height;
          const time = p.frameCount * 0.03;

          if (effectRef.current === 'waves') {
            p.stroke(fg);
            p.noFill();
            p.strokeWeight(0.5); // Тонкие изящные линии

            const stretch = 1.2; 
            const mapCenterX = (w / 2 + (h / 2) * 0.4) * stretch;
            const mapCenterY = (h / 2 - (w / 2) * 0.1) * stretch;

            p.push();
            p.translate(w / 2 - mapCenterX, h / 2 - mapCenterY);

            // ЗАПАС ЗА КРАЯ ЭКРАНА (Bleed)
            const extX = Math.floor(h * 0.6); 
            const extY = Math.floor(w * 0.25); 

            // Начинаем отрисовку за экраном (в минусе) и заканчиваем далеко за ним
            for (let a = -extY; a < h + extY; a += 4) {
              p.beginShape();
              for (let b = -extX; b < w + extX; b += 3) {
                let c = 0; 
                
                // Читаем пиксели только если мы находимся внутри холста с текстом
                if (a >= 0 && a < h && b >= 0 && b < w) {
                  const idx = (a * w + b) * 4;
                  c = pixelData[idx]; 
                }
                
                // Изометрия 
                const vx = (b + a * 0.4) * stretch;
                let vy = (a - c * 0.1 - b * 0.1) * stretch;
                
                // === ДИНАМИЧНЫЙ ФОН И СТАТИЧНЫЙ ТЕКСТ ===
                // Добавили extX и extY в шум, чтобы избежать "зеркалирования" шума
                const noiseTerrain = (p.noise((b + extX) * 0.008, (a + extY) * 0.008, time * 0.5) - 0.5) * 25;
                const waveDrift = p.sin(b * 0.02 - time * 2.5) * 6 + p.cos(a * 0.02 + time * 1.5) * 4;
                const totalBackgroundMotion = noiseTerrain + waveDrift;

                const textPresence = p.constrain(c / 150, 0, 1);

                // Если это текст, волны фона не применяются
                vy += totalBackgroundMotion * (1 - textPresence);
                
                p.vertex(vx, vy);
              }
              p.endShape();
            }
            p.pop();
          } else {
            // Data Dust / Spy-Tech частицы
            p.noStroke();
            p.fill(fg);
            
            for (let y = 0; y < h; y += 6) {
              for (let x = 0; x < w; x += 6) {
                const idx = (y * w + x) * 4;
                if (pixelData[idx] > 50) {
                  const n = p.noise(x * 0.005, y * 0.005, time);
                  
                  const distToMouse = p.dist(p.mouseX, p.mouseY, x, y);
                  let offsetX = 0;
                  let offsetY = 0;
                  
                  if (distToMouse < 100) {
                    const force = p.map(distToMouse, 0, 100, 15, 0);
                    offsetX = (x - p.mouseX) * force * 0.01;
                    offsetY = (y - p.mouseY) * force * 0.01;
                  }

                  const drawX = x + (n * 10 - 5) + offsetX;
                  const drawY = y + (n * 10 - 5) + offsetY;

                  if (n > 0.75) {
                    p.rect(drawX, drawY, 8, 1);
                  } else if (n < 0.25) {
                    p.rect(drawX, drawY, 1, 8);
                  } else {
                    const size = n * 3;
                    p.rect(drawX, drawY, size, size);
                  }
                }
              }
            }
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          resizeBuffer(p.width, p.height);
          needsRedraw = true;
        };
      };

      p5Instance = new p5(sketch, container);
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      p5Instance?.remove();
      offCanvas = null;
      offCtx = null;
      pixelData = null;
    };
  }, []);

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${isDark ? 'bg-[#141414] text-white' : 'bg-[#f0f0f0] text-black'}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-sm tracking-widest uppercase animate-pulse opacity-50">
            Initializing systems...
          </span>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-auto">
        <div className={`flex p-1 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
          {['waves', 'particles'].map(e => (
            <button 
              key={e} 
              aria-pressed={effect === e} 
              onClick={() => setEffect(e)}
              className={`
                relative px-6 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300 ease-out
                ${effect === e 
                  ? (isDark ? 'bg-white text-black shadow-md' : 'bg-black text-white shadow-md') 
                  : 'hover:opacity-70'}
              `}
            >
              {e === 'waves' ? 'Topography' : 'Data'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}