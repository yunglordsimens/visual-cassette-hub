import React, { useState, useEffect, useRef } from 'react';

// --- Плавная интерполяция (Lerp) ---
const lerp = (start, end, factor) => start + (end - start) * factor;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: window.innerWidth / 2, rawY: window.innerHeight / 2 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0, rawX: window.innerWidth / 2, rawY: window.innerHeight / 2 });
  
  const requestRef = useRef();
  const canvasRef = useRef(null);

  // --- Отслеживание скролла и мыши ---
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalScroll > 0 ? window.scrollY / totalScroll : 0);
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
        rawX: e.clientX,
        rawY: e.clientY
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // --- Кинематографичная анимация ---
  useEffect(() => {
    const animateDOM = () => {
      setSmoothProgress(prev => lerp(prev, scrollProgress, 0.05));
      setSmoothMouse(prev => ({
        x: lerp(prev.x, mousePos.x, 0.05),
        y: lerp(prev.y, mousePos.y, 0.05),
        rawX: lerp(prev.rawX, mousePos.rawX, 0.08),
        rawY: lerp(prev.rawY, mousePos.rawY, 0.08)
      }));
      requestRef.current = requestAnimationFrame(animateDOM);
    };
    requestRef.current = requestAnimationFrame(animateDOM);
    return () => cancelAnimationFrame(requestRef.current);
  }, [scrollProgress, mousePos]);

  // --- Движок Голографического Глобуса (Canvas) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let connections = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGlobe();
    };

    // Создаем узлы (города) на "сфере"
    const initGlobe = () => {
      nodes = [];
      connections = [];
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 150; // Глобус смещен вниз, как на картинке
      const radius = Math.min(canvas.width, canvas.height) * 0.45;

      const numNodes = 25;
      for (let i = 0; i < numNodes; i++) {
        // Случайные сферические координаты (упрощенно для верхней полусферы)
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius * 0.9; // Не выходим за края
        
        nodes.push({
          x: cx + Math.cos(angle) * r,
          y: cy - Math.abs(Math.sin(angle) * r * 0.5) - (Math.random() * radius * 0.3), // Сплющиваем для 3D
          size: Math.random() * 1.5 + 1.5,
          pulseSpeed: Math.random() * 0.05 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Создаем дуги между узлами
      for (let i = 0; i < 15; i++) {
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const n2 = nodes[Math.floor(Math.random() * nodes.length)];
        if (n1 !== n2) {
          connections.push({ n1, n2, progress: Math.random() });
        }
      }
    };

    const drawGlobeGrid = (cx, cy, radius) => {
      ctx.strokeStyle = 'rgba(50, 100, 255, 0.15)'; // Сделали чуть ярче, чтобы пробивало через стекло
      ctx.lineWidth = 1.5;
      
      // Широты (горизонтальные эллипсы)
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * (i/6), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Долготы (вертикальные эллипсы)
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * (i/6), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const animateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const cx = canvas.width / 2 + smoothMouse.x * -20;
      const cy = canvas.height / 2 + 150 + smoothMouse.y * -20 + (smoothProgress * 100);
      const radius = Math.min(canvas.width, canvas.height) * 0.45;

      // Отрисовка темной основы глобуса со свечением
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx, cy - radius * 0.5, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(10, 20, 40, 0.9)');
      grad.addColorStop(0.7, 'rgba(0, 5, 15, 0.95)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Легкое атмосферное свечение по краям
      ctx.shadowBlur = 60;
      ctx.shadowColor = 'rgba(100, 150, 255, 0.4)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Сетка
      drawGlobeGrid(cx, cy, radius);

      // Отрисовка дуг (связей)
      connections.forEach(conn => {
        const p1 = { x: conn.n1.x + (cx - canvas.width/2), y: conn.n1.y + (cy - canvas.height/2 - 150) };
        const p2 = { x: conn.n2.x + (cx - canvas.width/2), y: conn.n2.y + (cy - canvas.height/2 - 150) };
        
        // Расчет контрольной точки для дуги (вверх)
        const cpX = (p1.x + p2.x) / 2;
        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const cpY = Math.min(p1.y, p2.y) - dist * 0.3; // Чем дальше точки, тем выше дуга

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
        ctx.strokeStyle = 'rgba(150, 200, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Анимация передачи данных по дуге
        conn.progress += 0.005;
        if (conn.progress > 1) conn.progress = 0;
        
        // Математика квадратичной кривой для поиска точки
        const t = conn.progress;
        const currentX = (1-t)*(1-t)*p1.x + 2*(1-t)*t*cpX + t*t*p2.x;
        const currentY = (1-t)*(1-t)*p1.y + 2*(1-t)*t*cpY + t*t*p2.y;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Отрисовка узлов
      nodes.forEach(node => {
        node.pulsePhase += node.pulseSpeed;
        const alpha = 0.5 + Math.sin(node.pulsePhase) * 0.5;
        
        const currentX = node.x + (cx - canvas.width/2);
        const currentY = node.y + (cy - canvas.height/2 - 150);

        ctx.beginPath();
        ctx.arc(currentX, currentY, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(200, 230, 255, 1)';
        ctx.fill();
        
        // Ореол
        ctx.beginPath();
        ctx.arc(currentX, currentY, node.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${alpha * 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animateCanvas);
    };

    window.addEventListener('resize', resize);
    resize();
    animateCanvas();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothMouse, smoothProgress]);

  // Хелперы фаз
  const getPhase = (start, end) => {
    if (isNaN(smoothProgress)) return 0;
    if (smoothProgress <= start) return 0;
    if (smoothProgress >= end) return 1;
    return (smoothProgress - start) / (end - start);
  };

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@400;500;600;700&display=swap');
    
    body {
      background-color: #000000; /* Абсолютный черный */
      color: #FFFFFF;
      font-family: 'Rajdhani', sans-serif; /* Техничный, HUD-шрифт */
      cursor: none;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { display: none; }

    /* Хромированный текст (Как на картинке HQ VIP SOS) */
    .chrome-text {
      font-family: 'Michroma', sans-serif;
      /* Сложный градиент для имитации отражения на металле */
      background: linear-gradient(
        to bottom,
        #ffffff 0%,
        #b8c6db 30%,
        #4a5a7a 48%,
        #050a14 50%,
        #6e85a8 55%,
        #d5e0f2 80%,
        #ffffff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      /* Внешнее голубое свечение */
      filter: drop-shadow(0px 0px 20px rgba(100, 180, 255, 0.4)) drop-shadow(0px 5px 5px rgba(0,0,0,0.8));
      text-transform: uppercase;
    }

    /* Фоновое рассеянное свечение над глобусом */
    .bg-light-rays {
      background: radial-gradient(ellipse at bottom, rgba(30, 70, 150, 0.15) 0%, transparent 60%);
      filter: blur(50px);
      mix-blend-mode: screen;
    }

    /* Панели без рамок, только глубокое полупрозрачное затемнение и легкий блюр */
    .tech-border {
      background: rgba(0, 5, 15, 0.4);
      backdrop-filter: blur(8px);
    }
  `;

  return (
    <div className="min-h-[400vh] selection:bg-blue-900 selection:text-white relative">
      <style>{baseStyles}</style>

      {/* --- ТАКТИЧЕСКИЙ КУРСОР --- */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 z-[10000] pointer-events-none transition-transform duration-75 ease-out flex items-center justify-center mix-blend-screen"
        style={{ transform: `translate(${smoothMouse.rawX - 16}px, ${smoothMouse.rawY - 16}px)` }}
      >
        <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#fff]" />
        {/* Прицел */}
        <div className="absolute w-full h-[1px] bg-white/30" />
        <div className="absolute h-full w-[1px] bg-white/30" />
      </div>

      {/* =========================================
          СЛОЙ 0: ТЕМНЫЙ ФОН И ЛУЧИ
          ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#000000]">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-light-rays" />
      </div>

      {/* =========================================
          СЛОЙ 1: ГОЛОГРАФИЧЕСКИЙ ГЛОБУС (CANVAS)
          ========================================= */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-10 pointer-events-none"
      />

      {/* =========================================
          СЛОЙ 1.5: МАТОВОЕ СТЕКЛО (FROSTED GLASS)
          ========================================= */}
      {/* Полностью закрывает глобус и фон, создавая эффект толстого матового стекла */}
      <div 
        className="fixed inset-0 z-15 pointer-events-none backdrop-blur-[16px] bg-[#000510]/30"
      />

      {/* =========================================
          СЛОЙ 2: HUD ИНТЕРФЕЙС (Командный центр)
          ========================================= */}
      <div className="fixed inset-0 z-50 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start text-[11px] uppercase tracking-[0.3em] text-blue-200/50">
          <div className="flex flex-col gap-1">
            <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">SECURE_COMMS // V.09</span>
            <span>GLOBAL HQ NETWORK</span>
          </div>
          <div className="text-right flex flex-col gap-1">
            <span className="text-white">STATUS: <span className="text-blue-400 animate-pulse">ACTIVE</span></span>
            <span>ENCRYPTION_LEVEL_9</span>
          </div>
        </div>
        {/* Рамки убраны по вашей просьбе */}
      </div>

      {/* =========================================
          СЛОЙ 3: ОСНОВНОЙ КОНТЕНТ (СКРОЛЛ)
          ========================================= */}
      <div className="fixed inset-0 z-20 pointer-events-none perspective-[2000px]">
        
        {/* --- СЕКЦИЯ 1: ХРОМИРОВАННЫЙ ТИТР --- */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            transform: `translateZ(${smoothProgress * 1000}px) translateY(${smoothProgress * -20}vh)`,
            opacity: 1 - getPhase(0.15, 0.35),
          }}
        >
          <h1 className="chrome-text text-[8vw] md:text-[6vw] tracking-wider text-center" style={{ letterSpacing: '0.15em' }}>
            HQ VIP SOS
          </h1>
        </div>

        {/* --- СЕКЦИЯ 2: ТАКТИЧЕСКИЕ ДАННЫЕ (Без рамок) --- */}
        <div 
          className="absolute inset-0"
          style={{ display: smoothProgress > 0.05 ? 'block' : 'none' }}
        >
          {/* Левая информационная панель */}
          <div 
            className="absolute top-[30%] left-[5%] md:left-[10%] tech-border w-[85vw] md:w-[25vw] p-6 pointer-events-auto"
            style={{
              transform: `
                translateZ(${-1000 + smoothProgress * 1500}px) 
                translateX(${getPhase(0.1, 0.3) === 1 ? 0 : -50}px)
              `,
              opacity: getPhase(0.1, 0.3) - getPhase(0.6, 0.8),
            }}
          >
            <div className="text-[10px] tracking-widest text-blue-400 mb-4 border-b border-blue-900/50 pb-2">DATA STREAM INITIALIZED</div>
            <h2 className="text-2xl font-semibold tracking-wide text-white mb-4">GLOBAL REACH</h2>
            <p className="text-sm text-blue-100/60 leading-relaxed font-light mb-6">
              Мониторинг активов по всей планете. Интеграция систем связи и безопасности на уровне VIP. 
              Мгновенная реакция и координация в любой точке мира.
            </p>
            <div className="flex gap-4">
              <div className="w-1/2 bg-blue-900/20 p-2 text-center">
                <div className="text-[10px] text-blue-400 mb-1">NODES</div>
                <div className="text-xl font-bold">1,204</div>
              </div>
              <div className="w-1/2 bg-blue-900/20 p-2 text-center">
                <div className="text-[10px] text-blue-400 mb-1">LATENCY</div>
                <div className="text-xl font-bold">14ms</div>
              </div>
            </div>
          </div>
          
          {/* Правая панель (Сканирование) */}
          <div 
            className="absolute top-[40%] right-[5%] md:right-[10%] tech-border w-[85vw] md:w-[20vw] p-6 pointer-events-none"
            style={{
              transform: `
                translateZ(${-1500 + smoothProgress * 1800}px)
              `,
              opacity: getPhase(0.2, 0.4) - getPhase(0.7, 0.9),
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-[10px] tracking-widest text-red-400">TARGET_LOCK_ENGAGED</div>
            </div>
            
            {/* Имитация логов */}
            <div className="space-y-2 text-[10px] font-mono text-blue-200/50">
              <p>{'>'} Rerouting satellites...</p>
              <p>{'>'} Establishing secure connection...</p>
              <p>{'>'} Encryption key verified.</p>
              <p className="text-white mt-2">READY FOR PROTOCOL_EXECUTION.</p>
            </div>
          </div>
        </div>

        {/* --- СЕКЦИЯ 3: ФИНАЛ (Без рамки) --- */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{
            transform: `translateZ(${-1000 + (getPhase(0.6, 1.0) * 1000)}px)`,
            opacity: getPhase(0.6, 0.8),
            pointerEvents: getPhase(0.6, 1.0) > 0.5 ? 'auto' : 'none'
          }}
        >
          <div className="text-center group cursor-pointer relative bg-blue-900/20 p-12 backdrop-blur-md hover:bg-blue-800/30 transition-colors">
            <h1 className="font-['Michroma'] text-4xl md:text-6xl text-white tracking-widest drop-shadow-[0_0_15px_rgba(100,200,255,0.8)]">
              ACCESS GRANTED
            </h1>
            <div className="mt-6 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            <div className="mt-6 text-[11px] tracking-[0.4em] text-blue-200">
              ENTER SECURE PORTAL
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}