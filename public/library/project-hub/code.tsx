import React, { useState, useMemo } from 'react';

// --- ДАННЫЕ ДЛЯ СПИСКА (АРХИВА) - РАЗДЕЛЕНЫ НА ОТДЕЛЬНЫЕ СТРОКИ ---
const LIST_MATERIALS = [
  { name: "Saigon 9", count: "9", imageSrc: "https://placehold.co/100x150?text=Saigon+9" },
  { name: "Veo red", count: "1", imageSrc: "https://placehold.co/100x150?text=Veo+Red" },
  { name: "Veo pink", count: "1", imageSrc: "https://placehold.co/100x150?text=Veo+Pink" },
  { name: "Elysee", count: "2", imageSrc: "https://placehold.co/100x150?text=Elysee" },
  { name: "Rotmans double cupsule", count: "4", imageSrc: "https://placehold.co/100x150?text=Rothmans" },
  { name: "LD slim", count: "1", imageSrc: "https://placehold.co/100x150?text=LD+Slim" },
  { name: "Terea mint turquoise", count: "13", imageSrc: "https://placehold.co/100x150?text=Terea" },
  { name: "Malboro gold", count: "3", imageSrc: "https://placehold.co/100x150?text=Marlboro+Gold" },
  { name: "Malboro blue", count: "2", imageSrc: "https://placehold.co/100x150?text=Marlboro+Blue" },
  { name: "Malboro red", count: "5", imageSrc: "https://placehold.co/100x150?text=Marlboro+Red" },
  { name: "Malboro red small", count: "1", imageSrc: "https://placehold.co/100x150?text=Marlboro+Red+S" },
  { name: "Marlboro gold (special) from Izrael", count: "1", imageSrc: "https://placehold.co/100x150?text=Marlboro+Izrael" },
  { name: "Camel mint (new edition)", count: "115", imageSrc: "https://placehold.co/100x150?text=Camel+Mint+New" },
  { name: "Camel mint (old edition)", count: "27", imageSrc: "https://placehold.co/100x150?text=Camel+Mint+Old" },
  { name: "Camel blue", count: "73", imageSrc: "https://placehold.co/100x150?text=Camel+Blue" },
  { name: "Camel blue (special edition 1)", count: "4", imageSrc: "https://placehold.co/100x150?text=Camel+Blue+Spc1" },
  { name: "Camel blue (special edition 2)", count: "3", imageSrc: "https://placehold.co/100x150?text=Camel+Blue+Spc2" },
  { name: "Camel blue (soft box)", count: "1", imageSrc: "https://placehold.co/100x150?text=Camel+Blue+Soft" },
  { name: "Camel black", count: "2", imageSrc: "https://placehold.co/100x150?text=Camel+Black" },
  { name: "Camel yellow", count: "2", imageSrc: "https://placehold.co/100x150?text=Camel+Yellow" },
  { name: "Camel activate cigarillos (new design)", count: "7", imageSrc: "https://placehold.co/100x150?text=Camel+Cig+New" },
  { name: "Camel activate cigarillos (old design)", count: "4", imageSrc: "https://placehold.co/100x150?text=Camel+Cig+Old" },
  { name: "Davidoff gold slim", count: "1", imageSrc: "https://placehold.co/100x150?text=Davidoff+Slim" },
  { name: "Davidoff gold", count: "13", imageSrc: "https://placehold.co/100x150?text=Davidoff+Gold" },
  { name: "Davidoff black", count: "26", imageSrc: "https://placehold.co/100x150?text=Davidoff+Black" },
  { name: "Davidoff white", count: "2", imageSrc: "https://placehold.co/100x150?text=Davidoff+White" },
  { name: "Winston blue", count: "1", imageSrc: "https://placehold.co/100x150?text=Winston+Blue" },
  { name: "LM Loft", count: "1", imageSrc: "https://placehold.co/100x150?text=LM+Loft" },
  { name: "LM blue", count: "10", imageSrc: "https://placehold.co/100x150?text=LM+Blue" }
];

// --- ДАННЫЕ ДЛЯ 3D КРЕСТА ---
const CROSS_INVENTORY = [
  { id: 'camel_mint', brand: 'Camel Mint', qty: 142, size: 'standard', bg: '#0d9488', fg: '#ffffff' },
  { id: 'camel_blue', brand: 'Camel Blue', qty: 81, size: 'standard', bg: '#1d4ed8', fg: '#ffffff' },
  { id: 'davidoff_black', brand: 'Davidoff Black', qty: 26, size: 'standard', bg: '#18181b', fg: '#d6d3d1' },
  { id: 'davidoff_gold', brand: 'Davidoff Gold', qty: 13, size: 'standard', bg: '#fcd34d', fg: '#78350f' },
  { id: 'terea', brand: 'Terea Turquoise', qty: 13, size: 'small', bg: '#6ee7b7', fg: '#064e3b' },
  { id: 'camel_cigarillos', brand: 'Camel Cigarillos', qty: 11, size: 'wide', bg: '#292524', fg: '#d6d3d1' },
  { id: 'lm_blue', brand: 'LM Blue', qty: 10, size: 'standard', bg: '#0284c7', fg: '#ffffff' },
  { id: 'saigon', brand: 'Saigon 9', qty: 9, size: 'standard', bg: '#991b1b', fg: '#ffffff' },
  { id: 'marlboro_red', brand: 'Marlboro Red', qty: 5, size: 'standard', bg: '#dc2626', fg: '#ffffff' },
  { id: 'rothmans', brand: 'Rothmans Caps', qty: 4, size: 'standard', bg: '#4f46e5', fg: '#ffffff' },
  { id: 'marlboro_gold', brand: 'Marlboro Gold', qty: 3, size: 'standard', bg: '#facc15', fg: '#713f12' },
  { id: 'marlboro_blue', brand: 'Marlboro Blue', qty: 2, size: 'standard', bg: '#0891b2', fg: '#ffffff' },
  { id: 'camel_black', brand: 'Camel Black', qty: 2, size: 'standard', bg: '#000000', fg: '#ffffff' },
  { id: 'camel_yellow', brand: 'Camel Yellow', qty: 2, size: 'standard', bg: '#eab308', fg: '#000000' },
  { id: 'davidoff_white', brand: 'Davidoff White', qty: 2, size: 'standard', bg: '#ffffff', fg: '#000000' },
  { id: 'elysee', brand: 'Elysee', qty: 2, size: 'slim', bg: '#fbcfe8', fg: '#831843' },
  { id: 'marlboro_israel', brand: 'Marlboro Israel ✨', qty: 1, size: 'standard', bg: '#fde047', fg: '#713f12' },
  { id: 'veo_red', brand: 'Veo Red', qty: 1, size: 'slim', bg: '#f43f5e', fg: '#ffffff' },
  { id: 'veo_pink', brand: 'Veo Pink', qty: 1, size: 'slim', bg: '#f472b6', fg: '#ffffff' },
  { id: 'ld_slim', brand: 'LD Slim', qty: 1, size: 'slim', bg: '#d6d3d1', fg: '#1c1917' },
  { id: 'marlboro_small', brand: 'Marlboro Small', qty: 1, size: 'small', bg: '#b91c1c', fg: '#ffffff' },
  { id: 'winston_blue', brand: 'Winston Blue', qty: 1, size: 'standard', bg: '#1e40af', fg: '#ffffff' },
  { id: 'davidoff_slim', brand: 'Davidoff Slim', qty: 1, size: 'slim', bg: '#fef3c7', fg: '#78350f' },
  { id: 'lm_loft', brand: 'LM Loft', qty: 1, size: 'standard', bg: '#38bdf8', fg: '#ffffff' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('list'); 

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '14px', width: '100%', height: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {/* МАКСИМАЛЬНО ПРОСТОЕ МЕНЮ С СЕРОЙ ПОЛОСОЙ */}
      <div style={{ display: 'flex', gap: '20px', padding: '10px', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => setCurrentPage('list')} 
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', textDecoration: currentPage === 'list' ? 'underline' : 'none' }}
        >
          Archive List
        </button>
        <button 
          onClick={() => setCurrentPage('cross')} 
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', textDecoration: currentPage === 'cross' ? 'underline' : 'none' }}
        >
          Cross Visualization
        </button>
        <button 
          onClick={() => setCurrentPage('about')} 
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', textDecoration: currentPage === 'about' ? 'underline' : 'none' }}
        >
          About Project
        </button>
      </div>

      {currentPage === 'list' && <ListView />}
      {currentPage === 'cross' && <CrossView />}
      {currentPage === 'about' && <AboutView />}
    </div>
  );
}

function ListView() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {LIST_MATERIALS.map((item, idx) => {
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%', borderBottom: '1px solid #eee' }}>
            <div style={{ flex: 1, padding: '10px' }}>{item.name}</div>
            <div style={{ flex: 1, padding: '10px' }}>{item.count}</div>
            <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageSrc} alt={item.name} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- СТРАНИЦА ABOUT PROJECT ---
function AboutView() {
  return (
    <div style={{ display: 'flex', width: '100%', flex: 1, overflow: 'hidden' }}>
      {/* 1/2 экрана - Фотография */}
      <div style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
        <img 
          src="https://placehold.co/800x1200?text=Project+Result" 
          alt="Project Result" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
      </div>
      
      {/* 1/4 экрана - Instagram Iframe (пропорция 9:16) */}
      <div style={{ width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
        <iframe 
          src="https://www.instagram.com/p/C-EXAMPLE/embed" 
          frameBorder="0" 
          scrolling="no" 
          allowtransparency="true"
          style={{ width: '100%', aspectRatio: '9/16', border: 'none', background: '#fff' }}
        ></iframe>
      </div>

      {/* 1/4 экрана - Текстовое описание со скроллом */}
      <div style={{ width: '25%', height: '100%', padding: '10px', overflowY: 'auto' }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>
{`# Project Description

Here you can insert your markdown text.

This text block takes exactly 1/4 of the screen width and has a scrollbar if the text becomes too long.

- Point 1
- Point 2
- Point 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

[Insert your full text here]`}
        </div>
      </div>
    </div>
  );
}

// --- КОМПОНЕНТ ДЛЯ ОТРИСОВКИ РЕАЛЬНОГО 3D-КУБА ---
function Box3D({ w, h, d, bg, fg, text, x, y, rotateZ, translateZ }) {
  const shadeColor = (color, amt) => {
    let col = color.replace(/^#/, '');
    if (col.length === 3) col = col.split('').map(c => c + c).join('');
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt, g = ((num >> 8) & 0x00FF) + amt, b = (num & 0x0000FF) + amt;
    r = r < 255 ? (r < 0 ? 0 : r) : 255;
    g = g < 255 ? (g < 0 ? 0 : g) : 255;
    b = b < 255 ? (b < 0 ? 0 : b) : 255;
    return "#" + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const sideCol = shadeColor(bg, -30); 
  const topCol = shadeColor(bg, 15);   
  const borderStyle = '1px solid rgba(0,0,0,0.5)';

  return (
    <div style={{
      position: 'absolute',
      width: `${w}px`,
      height: `${h}px`,
      left: `${x}px`,
      top: `${y}px`,
      transformStyle: 'preserve-3d',
      transform: `translateZ(${translateZ}px) rotateZ(${rotateZ}deg)`,
    }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: sideCol, border: borderStyle, transform: 'translateZ(0)' }} />
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: bg, border: borderStyle, transform: `translateZ(${d}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fg, fontWeight: 'bold', fontSize: '9px', textAlign: 'center', padding: '2px', boxSizing: 'border-box' }}>
        <span style={{ transform: 'translateZ(1px)' }}>{text}</span>
      </div>
      <div style={{ position: 'absolute', width: `${d}px`, height: '100%', background: sideCol, border: borderStyle, left: 0, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />
      <div style={{ position: 'absolute', width: `${d}px`, height: '100%', background: sideCol, border: borderStyle, right: 0, transformOrigin: 'right', transform: 'rotateY(90deg)' }} />
      <div style={{ position: 'absolute', width: '100%', height: `${d}px`, background: topCol, border: borderStyle, top: 0, transformOrigin: 'top', transform: 'rotateX(-90deg)' }} />
      <div style={{ position: 'absolute', width: '100%', height: `${d}px`, background: sideCol, border: borderStyle, bottom: 0, transformOrigin: 'bottom', transform: 'rotateX(90deg)' }} />
    </div>
  );
}

function CrossView() {
  const [viewAngle, setViewAngle] = useState('front');
  const [showBase, setShowBase] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [showRelief, setShowRelief] = useState(true);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.4);
  const [rot, setRot] = useState({ x: 0, y: 0 }); 
  
  const isPanning = React.useRef(false); 
  const isRotating = React.useRef(false); 
  const lastMouse = React.useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      isPanning.current = true;
    } else if (e.button === 1) {
      e.preventDefault(); 
      isRotating.current = true;
      setViewAngle('free'); 
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    } else if (isRotating.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      setRot(prev => ({ x: prev.x - dy * 0.5, y: prev.y + dx * 0.5 }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => { 
    isPanning.current = false; 
    isRotating.current = false;
  };
  
  const handleWheel = (e) => {
    const zoomFactor = 0.05;
    if (e.deltaY < 0) setZoom(prev => Math.min(prev + zoomFactor, 2));
    else setZoom(prev => Math.max(prev - zoomFactor, 0.1));
  };

  const sizeMap = {
    standard: { w: 55, h: 85, d: 22 },
    slim: { w: 45, h: 85, d: 15 },
    small: { w: 55, h: 55, d: 22 },
    wide: { w: 65, h: 85, d: 22 },
  };

  const { packs } = useMemo(() => {
    let inventory = CROSS_INVENTORY.map(item => ({ ...item, remaining: item.qty }));
    const generatedPacks = [];
    let idCounter = 0;
    
    const takePack = (filterFn) => {
      const available = inventory.filter(p => p.remaining > 0 && filterFn(p));
      if (available.length === 0) return null;
      available.sort((a, b) => b.remaining - a.remaining); 
      const pack = available[0];
      pack.remaining -= 1;
      return { brand: pack.brand, sizeType: pack.size, bg: pack.bg, fg: pack.fg };
    };

    const sCoords = new Set();
    const addRect = (x1, x2, y1, y2) => {
      for(let x=x1; x<=x2; x++) for(let y=y1; y<=y2; y++) sCoords.add(`${x},${y}`);
    };

    addRect(14, 17, 1, 27); 
    addRect(3, 28, 10, 13); 
    addRect(9, 22, 5, 6); 
    addRect(9, 10, 19, 20);
    addRect(11, 13, 20, 21);
    addRect(18, 20, 23, 24);
    addRect(21, 22, 24, 25);

    const coordsArray = Array.from(sCoords).map(c => {
      const [x, y] = c.split(',').map(Number);
      return { x, y };
    });

    coordsArray.forEach(coord => {
      let p = takePack(p => p.size === 'standard' && (p.brand === 'Camel Blue' || p.brand === 'Camel Mint'));
      if (!p) p = takePack(p => p.size === 'standard');
      if (p) generatedPacks.push({ id: idCounter++, layer: 1, type: 'base', x: coord.x, y: coord.y, rotate: 0, ...p });
    });

    const rays = [
      {x: 8, y: 4, rot: -45}, {x: 23, y: 4, rot: 45},
      {x: 8, y: 7, rot: 45}, {x: 23, y: 7, rot: -45},
      {x: 2, y: 9, rot: -45}, {x: 29, y: 9, rot: 45},
      {x: 2, y: 14, rot: 45}, {x: 29, y: 14, rot: -45},
      {x: 8, y: 18, rot: -45}, {x: 23, y: 26, rot: -45}
    ];

    rays.forEach(ray => {
      let p = takePack(p => p.brand === 'Davidoff Black' || p.brand === 'LM Blue');
      if (!p) p = takePack(p => true);
      if (p) generatedPacks.push({ id: idCounter++, layer: 1, type: 'ray', x: ray.x, y: ray.y, rotate: ray.rot, ...p });
    });

    coordsArray.forEach(coord => {
      const isCenter = (coord.x >= 15 && coord.x <= 16) || (coord.y >= 11 && coord.y <= 12);
      if (isCenter && Math.random() > 0.4) {
        let p = takePack(p => p.size === 'small' || p.size === 'slim' || p.brand.includes('Marlboro') || p.brand.includes('Gold'));
        if (p) {
          const offsetX = p.sizeType === 'slim' ? 5 : 0;
          const offsetY = p.sizeType === 'small' ? 15 : 0;
          generatedPacks.push({ id: idCounter++, layer: 2, type: 'relief', x: coord.x, y: coord.y, offsetX, offsetY, rotate: 0, ...p });
        }
      }
    });

    let remainingPack = takePack(() => true);
    while (remainingPack) {
      const randomBaseCoord = coordsArray[Math.floor(Math.random() * coordsArray.length)];
      generatedPacks.push({ id: idCounter++, layer: 2, type: 'relief', x: randomBaseCoord.x, y: randomBaseCoord.y, offsetX: 0, offsetY: 0, rotate: 0, ...remainingPack });
      remainingPack = takePack(() => true);
    }

    return { packs: generatedPacks.sort((a, b) => a.layer - b.layer) };
  }, []);

  const VIEWS = {
    front: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
    left: 'rotateX(0deg) rotateY(90deg) rotateZ(0deg)',
    right: 'rotateX(0deg) rotateY(-90deg) rotateZ(0deg)',
    top: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)',
    bottom: 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)',
  };

  const currentTransform = viewAngle === 'free' 
    ? `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(0deg)`
    : VIEWS[viewAngle];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', gap: '20px', padding: '10px', borderBottom: '1px solid #eee', flexWrap: 'wrap', background: '#fff' }}>
        <label>
          View Angle:
          <select value={viewAngle} onChange={e => setViewAngle(e.target.value)} style={{ marginLeft: '5px', font: 'inherit' }}>
            <option value="front">Front</option>
            <option value="left">Left Side</option>
            <option value="right">Right Side</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="free">Free Angle (Custom)</option>
          </select>
        </label>
        <label><input type="checkbox" checked={showBase} onChange={e => setShowBase(e.target.checked)} /> Base Layer</label>
        <label><input type="checkbox" checked={showRays} onChange={e => setShowRays(e.target.checked)} /> Rays</label>
        <label><input type="checkbox" checked={showRelief} onChange={e => setShowRelief(e.target.checked)} /> Relief Layer</label>
        
        <span style={{ color: '#888', marginLeft: 'auto', display: 'flex', gap: '15px' }}>
          <span>Left Click: Pan</span>
          <span>Middle Click: Rotate (Free Angle)</span>
          <span>Scroll: Zoom</span>
        </span>
      </div>

      <div 
        style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fff', cursor: isRotating.current ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center',
        }}>
          <div style={{ 
            width: '1600px', 
            height: '2400px', 
            transform: currentTransform, 
            transformStyle: 'preserve-3d', 
            transition: viewAngle === 'free' ? 'none' : 'transform 0.8s ease-in-out',
            position: 'relative' 
          }}>
            {packs.map(pack => {
              if (pack.type === 'base' && !showBase) return null;
              if (pack.type === 'ray' && !showRays) return null;
              if (pack.layer === 2 && !showRelief) return null;

              const dims = sizeMap[pack.sizeType];
              const translateZ = pack.layer === 2 ? 22 : 0; 

              return (
                <Box3D
                  key={pack.id}
                  w={dims.w}
                  h={dims.h}
                  d={dims.d}
                  bg={pack.bg}
                  fg={pack.fg}
                  text={pack.brand.replace(' ', '\n')}
                  x={(pack.x * 55) + (pack.offsetX || 0)}
                  y={(pack.y * 85) + (pack.offsetY || 0)}
                  rotateZ={pack.rotate}
                  translateZ={translateZ}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}