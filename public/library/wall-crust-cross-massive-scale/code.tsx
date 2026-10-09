import React, { useState, useMemo } from 'react';

const RAW_INVENTORY = [
  { id: 'camel_mint', brand: 'Camel Mint', qty: 142, size: 'standard', color: 'bg-teal-600', text: 'text-white' },
  { id: 'camel_blue', brand: 'Camel Blue', qty: 81, size: 'standard', color: 'bg-blue-700', text: 'text-white' },
  { id: 'davidoff_black', brand: 'Davidoff Black', qty: 26, size: 'standard', color: 'bg-zinc-950', text: 'text-stone-300' },
  { id: 'davidoff_gold', brand: 'Davidoff Gold', qty: 13, size: 'standard', color: 'bg-amber-100', text: 'text-amber-900' },
  { id: 'terea', brand: 'Terea Turquoise', qty: 13, size: 'small', color: 'bg-emerald-300', text: 'text-emerald-900' },
  { id: 'camel_cigarillos', brand: 'Camel Cigarillos', qty: 11, size: 'wide', color: 'bg-stone-800', text: 'text-stone-300' },
  { id: 'lm_blue', brand: 'LM Blue', qty: 10, size: 'standard', color: 'bg-sky-600', text: 'text-white' },
  { id: 'saigon', brand: 'Saigon 9', qty: 9, size: 'standard', color: 'bg-red-800', text: 'text-white' },
  { id: 'marlboro_red', brand: 'Marlboro Red', qty: 5, size: 'standard', color: 'bg-red-600', text: 'text-white' },
  { id: 'rothmans', brand: 'Rothmans Caps', qty: 4, size: 'standard', color: 'bg-indigo-600', text: 'text-white' },
  { id: 'marlboro_gold', brand: 'Marlboro Gold', qty: 3, size: 'standard', color: 'bg-yellow-400', text: 'text-yellow-900' },
  { id: 'marlboro_blue', brand: 'Marlboro Blue', qty: 2, size: 'standard', color: 'bg-cyan-600', text: 'text-white' },
  { id: 'camel_black', brand: 'Camel Black', qty: 2, size: 'standard', color: 'bg-black', text: 'text-white' },
  { id: 'camel_yellow', brand: 'Camel Yellow', qty: 2, size: 'standard', color: 'bg-yellow-500', text: 'text-black' },
  { id: 'davidoff_white', brand: 'Davidoff White', qty: 2, size: 'standard', color: 'bg-white', text: 'text-black' },
  { id: 'elysee', brand: 'Elysee', qty: 2, size: 'slim', color: 'bg-pink-200', text: 'text-pink-900' },
  { id: 'marlboro_israel', brand: 'Marlboro Israel ✨', qty: 1, size: 'standard', color: 'bg-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.8)]', text: 'text-yellow-900' },
  { id: 'veo_red', brand: 'Veo Red', qty: 1, size: 'slim', color: 'bg-rose-500', text: 'text-white' },
  { id: 'veo_pink', brand: 'Veo Pink', qty: 1, size: 'slim', color: 'bg-pink-400', text: 'text-white' },
  { id: 'ld_slim', brand: 'LD Slim', qty: 1, size: 'slim', color: 'bg-stone-300', text: 'text-stone-800' },
  { id: 'marlboro_small', brand: 'Marlboro Small', qty: 1, size: 'small', color: 'bg-red-700', text: 'text-white' },
  { id: 'winston_blue', brand: 'Winston Blue', qty: 1, size: 'standard', color: 'bg-blue-800', text: 'text-white' },
  { id: 'davidoff_slim', brand: 'Davidoff Slim', qty: 1, size: 'slim', color: 'bg-amber-100', text: 'text-amber-900' },
  { id: 'lm_loft', brand: 'LM Loft', qty: 1, size: 'standard', color: 'bg-sky-400', text: 'text-white' },
];

export default function App() {
  const [viewAngle, setViewAngle] = useState('wall'); // 'wall' | 'angled'
  const [showBase, setShowBase] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [showRelief, setShowRelief] = useState(true);

  // РЕАЛЬНЫЕ ПРОПОРЦИИ ПАЧЕК ПЛАШМЯ (Лицевая сторона)
  // В мм: стандарт 55х85, мы берем масштаб для экрана
  const sizeMap = {
    standard: { w: 55, h: 85 },
    slim: { w: 45, h: 85 }, // Слимки у́же
    small: { w: 55, h: 55 }, // Terea - квадратики
    wide: { w: 65, h: 85 },  // Сигариллы
  };

  const { packs, stats } = useMemo(() => {
    let inventory = RAW_INVENTORY.map(item => ({ ...item, remaining: item.qty }));
    const generatedPacks = [];
    let idCounter = 0;
    
    const takePack = (filterFn) => {
      const available = inventory.filter(p => p.remaining > 0 && filterFn(p));
      if (available.length === 0) return null;
      available.sort((a, b) => b.remaining - a.remaining); 
      const pack = available[0];
      pack.remaining -= 1;
      return { brand: pack.brand, sizeType: pack.size, color: pack.color, text: pack.text };
    };

    // --- МАССИВНАЯ ГЕОМЕТРИЯ (По мотивам фото, но БОЛЬШЕ) ---
    const sCoords = new Set();
    const addRect = (x1, x2, y1, y2) => {
      for(let x=x1; x<=x2; x++) {
        for(let y=y1; y<=y2; y++) sCoords.add(`${x},${y}`);
      }
    };

    // 1. ВЕРТИКАЛЬНЫЙ СТОЛБ (Ширина 4 пачки = 22 см. Высота 27 пачек = 2.3 метра!)
    const spineX1 = 14, spineX2 = 17;
    addRect(spineX1, spineX2, 1, 27); 

    // 2. СРЕДНЯЯ ПЕРЕКЛАДИНА (Размах 28 пачек = 1.54 метра в ширину!)
    addRect(3, 28, 10, 13); // Высота 4 пачки

    // 3. ВЕРХНЯЯ ПЕРЕКЛАДИНА
    addRect(9, 22, 5, 6); // Высота 2 пачки, ширина 14 пачек

    // 4. НИЖНЯЯ КОСАЯ ПЕРЕКЛАДИНА (Ступеньками)
    addRect(9, 10, 19, 20);
    addRect(11, 13, 20, 21);
    addRect(18, 20, 23, 24);
    addRect(21, 22, 24, 25);

    // ЗАПОЛНЕНИЕ ОСНОВНОГО СЛОЯ (L1 - Плоская база на стене)
    const coordsArray = Array.from(sCoords).map(c => {
      const [x, y] = c.split(',').map(Number);
      return { x, y };
    });

    coordsArray.forEach(coord => {
      // База строится из Кэмела и Давидоффа
      let p = takePack(p => p.size === 'standard' && (p.brand === 'Camel Blue' || p.brand === 'Camel Mint'));
      if (!p) p = takePack(p => p.size === 'standard');
      if (p) {
        generatedPacks.push({ id: idCounter++, layer: 1, type: 'base', x: coord.x, y: coord.y, rotate: 0, ...p });
      }
    });

    // 5. КОСЫЕ ЛУЧИ (Как на фото!) - L1 (type: 'ray')
    const rays = [
      // Вокруг верхней перекладины
      {x: 8, y: 4, rot: -45}, {x: 23, y: 4, rot: 45},
      {x: 8, y: 7, rot: 45}, {x: 23, y: 7, rot: -45},
      // Вокруг центральной перекладины
      {x: 2, y: 9, rot: -45}, {x: 29, y: 9, rot: 45},
      {x: 2, y: 14, rot: 45}, {x: 29, y: 14, rot: -45},
      // Возле косой
      {x: 8, y: 18, rot: -45}, {x: 23, y: 26, rot: -45}
    ];

    rays.forEach(ray => {
      let p = takePack(p => p.brand === 'Davidoff Black' || p.brand === 'LM Blue'); // Темные/синие лучи
      if (!p) p = takePack(p => true);
      if (p) {
        generatedPacks.push({ id: idCounter++, layer: 1, type: 'ray', x: ray.x, y: ray.y, rotate: ray.rot, ...p });
      }
    });

    // 6. РЕЛЬЕФ / АЛТАРЬ (L2 - Накладываем поверх креста)
    // Раз у нас стена, мы можем приклеить 2-й слой прямо поверх 1-го по центральным осям
    coordsArray.forEach(coord => {
      const isCenter = (coord.x >= 15 && coord.x <= 16) || (coord.y >= 11 && coord.y <= 12);
      if (isCenter && Math.random() > 0.4) { // 60% шанс положить пачку сверху
        let p = takePack(p => p.size === 'small' || p.size === 'slim' || p.brand.includes('Marlboro') || p.brand.includes('Gold'));
        if (p) {
          // Центрируем слимки и Terea на координатной сетке
          const offsetX = p.sizeType === 'slim' ? 5 : p.sizeType === 'small' ? 0 : 0;
          const offsetY = p.sizeType === 'small' ? 15 : 0;
          generatedPacks.push({ id: idCounter++, layer: 2, type: 'relief', x: coord.x, y: coord.y, offsetX, offsetY, rotate: 0, ...p });
        }
      }
    });

    // Добиваем все оставшиеся пачки в рельеф (Layer 2)
    let remainingPack = takePack(() => true);
    while (remainingPack) {
      const randomBaseCoord = coordsArray[Math.floor(Math.random() * coordsArray.length)];
      generatedPacks.push({ id: idCounter++, layer: 2, type: 'relief', x: randomBaseCoord.x, y: randomBaseCoord.y, offsetX: 0, offsetY: 0, rotate: 0, ...remainingPack });
      remainingPack = takePack(() => true);
    }

    return { 
      packs: generatedPacks.sort((a, b) => a.layer - b.layer),
      stats: { total: RAW_INVENTORY.reduce((sum, item) => sum + item.qty, 0), used: generatedPacks.length }
    };
  }, []);

  const transforms = {
    'wall': 'rotateX(0deg) rotateZ(0deg) scale(0.35) translateY(-20%)',
    'angled': 'rotateX(30deg) rotateZ(-15deg) rotateY(15deg) scale(0.3) translateY(-10%)'
  };
  const sceneTransform = transforms[viewAngle];

  return (
    <div className="min-h-screen bg-[#e3ded9] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] text-stone-800 font-sans flex flex-col xl:flex-row overflow-hidden">
      
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="w-full xl:w-[350px] bg-stone-100/90 backdrop-blur-md border-r border-stone-300 p-6 flex flex-col h-auto xl:h-screen overflow-y-auto z-10 shadow-2xl">
        <h1 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-none mb-1">Wall Scale Cross</h1>
        <p className="text-xs text-stone-500 font-mono mb-4">Size: ~160cm ✕ ~240cm</p>
        
        <div className="bg-white rounded-xl p-3 border border-stone-200 mb-6 shadow-sm">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-bold px-1">Камера:</p>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewAngle('wall')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded uppercase ${viewAngle === 'wall' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              Прямо на стене
            </button>
            <button 
              onClick={() => setViewAngle('angled')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded uppercase ${viewAngle === 'angled' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              В перспективе
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-stone-200 mb-6 shadow-sm">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-bold px-1">Элементы сборки:</p>
          <div className="flex flex-col gap-2 font-mono text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-stone-50 transition">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-stone-300 border border-stone-400"></div> База (Тело креста)
              </span>
              <input type="checkbox" checked={showBase} onChange={e => setShowBase(e.target.checked)} className="accent-stone-600 w-4 h-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-stone-50 transition">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-stone-800 transform rotate-45"></div> Косые Лучи (Как на фото)
              </span>
              <input type="checkbox" checked={showRays} onChange={e => setShowRays(e.target.checked)} className="accent-stone-600 w-4 h-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-stone-50 transition">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 shadow-md"></div> 2 Слой (Рельеф из Terea/Marlboro)
              </span>
              <input type="checkbox" checked={showRelief} onChange={e => setShowRelief(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
            </label>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 text-xs text-teal-900 mb-4">
            <strong className="block mb-1 font-bold">Огромный масштаб:</strong>
            Все {stats.used} пачек использованы! 
            Горизонталь — 28 пачек (по 5.5 см) = 1.54 метра.<br/>
            Вертикаль — 27 пачек (по 8.5 см) = 2.3 метра.
          </div>
        </div>
      </div>

      {/* КАНВАС (СЦЕНА) - Имитация обоев из 2000-х для вайба */}
      <div className="flex-1 relative flex justify-center items-center overflow-hidden">
        
        {/* Обои в стиле твоего референса */}
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: 'radial-gradient(circle, #f0e6d2 10%, transparent 10%), radial-gradient(circle, #f0e6d2 10%, transparent 10%)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />

        <div 
          className="relative transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] preserve-3d z-10"
          style={{ width: '1600px', height: '2400px', transform: sceneTransform, transformStyle: 'preserve-3d' }}
        >
          {packs.map(pack => {
            if (pack.type === 'base' && !showBase) return null;
            if (pack.type === 'ray' && !showRays) return null;
            if (pack.layer === 2 && !showRelief) return null;

            const dims = sizeMap[pack.sizeType];
            const gridW = 55; // 55mm
            const gridH = 85; // 85mm
            
            // Слой 2 (рельеф) клеится поверх слоя 1. 
            // Толщина пачки примерно 22мм, зададим ее как Z-индекс в перспективе.
            const translateZ = pack.layer === 2 ? (viewAngle === 'angled' ? 40 : 0) : 0;
            
            // Тени как от реальных пачек на стене
            let shadow = '2px 4px 10px rgba(0,0,0,0.3)';
            if (pack.layer === 2) {
              shadow = '4px 8px 15px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.2)'; // 2 слой отбрасывает бОльшую тень
            }

            return (
              <div
                key={pack.id}
                className={`absolute flex flex-col justify-between overflow-hidden transition-all duration-[800ms] ${pack.color} border border-black/10`}
                style={{
                  width: `${dims.w}px`,
                  height: `${dims.h}px`,
                  left: `${(pack.x * gridW) + (pack.offsetX || 0)}px`, 
                  top: `${(pack.y * gridH) + (pack.offsetY || 0)}px`,
                  transform: `translateZ(${translateZ}px) rotateZ(${pack.rotate}deg)`,
                  zIndex: pack.layer * 10 + Math.floor(pack.y),
                  boxShadow: shadow,
                  borderRadius: '2px', // У пачек чуть скругленные углы
                }}
              >
                {/* Дизайн "Лица" пачки */}
                <div className={`w-full ${pack.sizeType === 'small' ? 'h-1/2' : 'h-[35%]'} bg-white/20 border-b border-black/10 flex items-center justify-center`}>
                  {/* Имитация акцизной марки или крышки */}
                  <div className="w-1/3 h-1/2 bg-white/40 blur-[1px]"></div>
                </div>
                <div className={`text-[9px] font-black tracking-tighter text-center leading-tight ${pack.text} uppercase overflow-hidden px-1 py-1 drop-shadow-md`}>
                  {pack.brand.replace(' ', '\n')}
                </div>
                {/* Имитация предупреждения о вреде курения (черная рамка внизу) */}
                <div className="w-[90%] h-[15%] mx-auto mb-1 border border-black/40 bg-white/80 flex items-center justify-center">
                  <div className="w-full h-[2px] bg-black/40"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}