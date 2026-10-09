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

  // --- Кинематографичная анимация скролла ---
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
      const cy = canvas.height / 2 + 150; 
      const radius = Math.min(canvas.width, canvas.height) * 0.45;

      const numNodes = 30;
      for (let i = 0; i < numNodes; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius * 0.9;
        
        nodes.push({
          x: cx + Math.cos(angle) * r,
          y: cy - Math.abs(Math.sin(angle) * r * 0.5) - (Math.random() * radius * 0.3),
          size: Math.random() * 1.5 + 1.5,
          pulseSpeed: Math.random() * 0.05 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      for (let i = 0; i < 20; i++) {
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const n2 = nodes[Math.floor(Math.random() * nodes.length)];
        if (n1 !== n2) {
          connections.push({ n1, n2, progress: Math.random() });
        }
      }
    };

    const drawGlobeGrid = (cx, cy, radius) => {
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * (i/6), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
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

      // Слегка прозрачная основа глобуса, чтобы сквозь него просвечивала планета на фоне
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx, cy - radius * 0.5, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(5, 10, 25, 0.4)');
      grad.addColorStop(0.7, 'rgba(0, 5, 15, 0.6)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.shadowBlur = 50;
      ctx.shadowColor = 'rgba(100, 180, 255, 0.3)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      drawGlobeGrid(cx, cy, radius);

      connections.forEach(conn => {
        const p1 = { x: conn.n1.x + (cx - canvas.width/2), y: conn.n1.y + (cy - canvas.height/2 - 150) };
        const p2 = { x: conn.n2.x + (cx - canvas.width/2), y: conn.n2.y + (cy - canvas.height/2 - 150) };
        
        const cpX = (p1.x + p2.x) / 2;
        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const cpY = Math.min(p1.y, p2.y) - dist * 0.3;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
        ctx.strokeStyle = 'rgba(150, 220, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        conn.progress += 0.005;
        if (conn.progress > 1) conn.progress = 0;
        
        const t = conn.progress;
        const currentX = (1-t)*(1-t)*p1.x + 2*(1-t)*t*cpX + t*t*p2.x;
        const currentY = (1-t)*(1-t)*p1.y + 2*(1-t)*t*cpY + t*t*p2.y;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      nodes.forEach(node => {
        node.pulsePhase += node.pulseSpeed;
        const alpha = 0.5 + Math.sin(node.pulsePhase) * 0.5;
        
        const currentX = node.x + (cx - canvas.width/2);
        const currentY = node.y + (cy - canvas.height/2 - 150);

        ctx.beginPath();
        ctx.arc(currentX, currentY, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(150, 200, 255, 1)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, node.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.25})`;
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

  const getPhase = (start, end) => {
    if (isNaN(smoothProgress)) return 0;
    if (smoothProgress <= start) return 0;
    if (smoothProgress >= end) return 1;
    return (smoothProgress - start) / (end - start);
  };

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@400;500;600;700&display=swap');
    
    body {
      background-color: #020617; /* Темный космос */
      color: #FFFFFF;
      font-family: 'Rajdhani', sans-serif;
      cursor: none;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { display: none; }

    /* Обновленный хромированный текст - более контрастный и объемный */
    .chrome-text {
      font-family: 'Michroma', sans-serif;
      background: linear-gradient(
        to bottom,
        #ffffff 0%,
        #e0e7ff 25%,
        #818cf8 45%,
        #1e1b4b 50%,
        #6366f1 55%,
        #c7d2fe 80%,
        #ffffff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0px 0px 25px rgba(99, 102, 241, 0.5)) drop-shadow(0px 8px 10px rgba(0,0,0,0.9));
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Матовое стекло (Glassmorphism) */
    .glass-panel {
      background: rgba(15, 23, 42, 0.35); /* Полупрозрачный темный */
      backdrop-filter: blur(24px); /* Сильный блюр */
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1); /* Тончайшая белая граница */
      border-top: 1px solid rgba(255, 255, 255, 0.2); /* Блик сверху */
      border-left: 1px solid rgba(255, 255, 255, 0.15); /* Блик слева */
      border-radius: 2rem; /* Закругленные углы */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02);
    }
  `;

  return (
    <div className="min-h-[400vh] selection:bg-indigo-500/50 selection:text-white relative">
      <style>{baseStyles}</style>

      {/* --- ТАКТИЧЕСКИЙ КУРСОР --- */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 z-[10000] pointer-events-none transition-transform duration-75 ease-out flex items-center justify-center mix-blend-screen"
        style={{ transform: `translate(${smoothMouse.rawX - 16}px, ${smoothMouse.rawY - 16}px)` }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_#fff]" />
        <div className="absolute w-full h-[1px] bg-white/40" />
        <div className="absolute h-full w-[1px] bg-white/40" />
      </div>

      {/* =========================================
          СЛОЙ 0: ПЛАНЕТА НА ФОНЕ И БЛЮР ОВЕРЛЕЙ
          ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
        {/* Картинка планеты (вид из космоса) */}
        <img 
          src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=2000&q=80" 
          alt="Earth" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
          style={{
            transform: `translateY(${smoothProgress * -5}vh) scale(1.05)` // Легкий параллакс планеты
          }}
        />
        {/* Голубой матовый блюр-оверлей поверх планеты */}
        <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[12px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
      </div>

      {/* =========================================
          СЛОЙ 1: ГОЛОГРАФИЧЕСКИЙ ГЛОБУС (CANVAS HUD)
          ========================================= */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-10 pointer-events-none mix-blend-screen opacity-80"
      />

      {/* =========================================
          СЛОЙ 2: HUD ИНТЕРФЕЙС (Без рамок, мягкий)
          ========================================= */}
      <div className="fixed inset-0 z-50 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start text-[11px] uppercase tracking-[0.3em] text-indigo-200/60 font-medium">
          <div className="flex flex-col gap-1">
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">SECURE_COMMS // V.09</span>
            <span>GLOBAL HQ NETWORK</span>
          </div>
          <div className="text-right flex flex-col gap-1">
            <span className="text-white">STATUS: <span className="text-indigo-400 animate-pulse font-bold">ACTIVE</span></span>
            <span>ENCRYPTION_L9</span>
          </div>
        </div>
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
          <h1 className="chrome-text text-[12vw] md:text-[8vw] text-center leading-none">
            HQVIPSOS
          </h1>
        </div>

        {/* --- СЕКЦИЯ 2: МАТОВЫЕ СТЕКЛЯННЫЕ ПАНЕЛИ --- */}
        <div 
          className="absolute inset-0"
          style={{ display: smoothProgress > 0.05 ? 'block' : 'none' }}
        >
          {/* Левая стеклянная панель */}
          <div 
            className="absolute top-[25%] left-[5%] md:left-[8%] glass-panel w-[90vw] md:w-[28vw] p-8 pointer-events-auto transition-transform"
            style={{
              transform: `
                translateZ(${-1000 + smoothProgress * 1500}px) 
                translateX(${getPhase(0.1, 0.3) === 1 ? 0 : -50}px)
              `,
              opacity: getPhase(0.1, 0.3) - getPhase(0.6, 0.8),
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] tracking-widest text-indigo-300 font-bold uppercase">Data Stream</div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-wider text-white mb-4">GLOBAL REACH</h2>
            <p className="text-sm text-indigo-100/70 leading-relaxed font-light mb-8">
              Мониторинг активов по всей планете. Интеграция систем связи и безопасности на уровне VIP. 
              Мгновенная реакция и координация в любой точке мира с использованием квантового шифрования.
            </p>
            
            <div className="flex gap-4">
              <div className="w-1/2 bg-white/5 rounded-xl p-4 text-center border border-white/5 backdrop-blur-sm">
                <div className="text-[10px] text-indigo-300 mb-1 uppercase tracking-wider">Nodes Active</div>
                <div className="text-2xl font-bold text-white">1,204</div>
              </div>
              <div className="w-1/2 bg-white/5 rounded-xl p-4 text-center border border-white/5 backdrop-blur-sm">
                <div className="text-[10px] text-indigo-300 mb-1 uppercase tracking-wider">Net Latency</div>
                <div className="text-2xl font-bold text-white">14ms</div>
              </div>
            </div>
          </div>
          
          {/* Правая стеклянная панель (Логи) */}
          <div 
            className="absolute top-[45%] right-[5%] md:right-[8%] glass-panel w-[90vw] md:w-[22vw] p-8 pointer-events-none"
            style={{
              transform: `
                translateZ(${-1500 + smoothProgress * 1800}px)
              `,
              opacity: getPhase(0.2, 0.4) - getPhase(0.7, 0.9),
            }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
              <div className="text-[11px] font-bold tracking-widest text-rose-400">TARGET LOCK</div>
            </div>
            
            <div className="space-y-3 text-[12px] font-mono text-indigo-200/70">
              <p className="flex justify-between"><span>Rerouting sat-link</span> <span className="text-indigo-400">OK</span></p>
              <p className="flex justify-between"><span>Bypassing firewalls</span> <span className="text-indigo-400">OK</span></p>
              <p className="flex justify-between"><span>Decrypting payload</span> <span className="text-indigo-400 animate-pulse">...</span></p>
              <div className="h-1 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3 rounded-full" />
              </div>
              <p className="text-white mt-4 font-bold tracking-widest pt-2">PROTOCOL READY.</p>
            </div>
          </div>
        </div>

        {/* --- СЕКЦИЯ 3: ФИНАЛ --- */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{
            transform: `translateZ(${-1000 + (getPhase(0.6, 1.0) * 1000)}px)`,
            opacity: getPhase(0.6, 0.8),
            pointerEvents: getPhase(0.6, 1.0) > 0.5 ? 'auto' : 'none'
          }}
        >
          <div className="text-center group cursor-pointer relative glass-panel p-16 hover:bg-white/10 transition-all duration-500 transform hover:scale-105">
            <h1 className="font-['Michroma'] text-4xl md:text-6xl text-white tracking-widest drop-shadow-[0_0_20px_rgba(100,150,255,0.5)]">
              ACCESS GRANTED
            </h1>
            <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
            <div className="mt-8 text-[12px] font-bold tracking-[0.5em] text-indigo-200 group-hover:text-white transition-colors">
              ENTER SECURE PORTAL
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}