import { ReferenceItem } from '../types';

export const BUILTIN_REFERENCES: ReferenceItem[] = [
  {
    id: 'ref-kinetic-typography-poster',
    title: 'Kinetic Neon Swiss Typography',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230c0e15"/><stop offset="100%" stop-color="%231a0b2e"/></linearGradient><linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23a855f7"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg)"/><text x="40" y="90" fill="white" font-family="monospace" font-weight="900" font-size="44" letter-spacing="-2">FUTURE_POSTER</text><text x="40" y="140" fill="url(%23neon)" font-family="sans-serif" font-weight="800" font-size="32">KINETIC DISPLACEMENT</text><rect x="40" y="165" width="520" height="2" fill="%23ec4899" opacity="0.6"/><text x="40" y="210" fill="%2394a3b8" font-family="monospace" font-size="14">GRID: 12-COL // MODULAR ARCHETYPE</text><text x="40" y="240" fill="%2364748b" font-family="sans-serif" font-size="13">High-contrast brutalist layout with neon pink and violet accents.</text><circle cx="480" cy="270" r="60" fill="none" stroke="%23a855f7" stroke-width="3" stroke-dasharray="6,4"/><text x="480" y="275" fill="%23c084fc" font-family="monospace" font-size="12" text-anchor="middle">2026 // VAULT</text></svg>',
    comments: [
      'Отличная кинетическая типографика и акцентный градиент #a855f7 -> #ec4899',
      'Использовать модульную 12-колоночную сетку с моноширинными метаданными',
      'Добавить эффект размытия и свечения на заголовках при ховере'
    ],
    tags: ['typography', 'swiss-style', 'neon', 'poster', 'brutalist'],
    groups: ['Шрифты', 'Цвета', 'Сетка'],
    description: 'Swiss-style kinetic poster with heavy display fonts, modular grid dividers and bright neon magenta glow.',
    created: '2026-02-24',
    author: 'Elena Rostova'
  },
  {
    id: 'ref-holographic-card-interface',
    title: 'Holographic Glassmorphic HUD',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23060b14"/><stop offset="100%" stop-color="%230d1b2a"/></linearGradient><linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg2)"/><rect x="50" y="50" width="500" height="300" rx="20" fill="%230f172a" fill-opacity="0.8" stroke="%2338bdf8" stroke-width="1.5" stroke-opacity="0.4"/><text x="80" y="110" fill="%2338bdf8" font-family="monospace" font-weight="700" font-size="20">01 // QUANTUM HUD DASHBOARD</text><text x="80" y="150" fill="white" font-family="sans-serif" font-weight="600" font-size="28">Frosted Glass Multi-Layer</text><rect x="80" y="180" width="180" height="120" rx="12" fill="%231e293b" fill-opacity="0.6" stroke="%2306b6d4" stroke-width="1"/><rect x="280" y="180" width="230" height="120" rx="12" fill="%231e293b" fill-opacity="0.6" stroke="%23818cf8" stroke-width="1"/><text x="100" y="230" fill="%2338bdf8" font-family="monospace" font-size="24" font-weight="bold">98.4%</text><text x="100" y="260" fill="%2394a3b8" font-family="sans-serif" font-size="12">GPU RENDER FLUIDITY</text><text x="300" y="230" fill="%23a78bfa" font-family="monospace" font-size="24" font-weight="bold">60 FPS</text><text x="300" y="260" fill="%2394a3b8" font-family="sans-serif" font-size="12">WEBGL REALTIME LOOP</text></svg>',
    comments: [
      'Полупрозрачные стеклянные карточки с тонкой неоновой обводкой (1px cyan)',
      'Информационная плотность в стиле Sci-Fi / Cyber HUD',
      'Индикаторы производительности с крупными цифрами'
    ],
    tags: ['glassmorphism', 'hud', 'dashboard', 'cyan', 'scifi', 'ui'],
    groups: ['Структура', 'Интерактив', 'Цвета'],
    description: 'Futuristic frosted-glass interface HUD with cyan highlights, telemetry statistics and glowing borders.',
    created: '2026-02-23',
    author: 'Alex K.'
  },
  {
    id: 'ref-organic-3d-gradient-sphere',
    title: 'Chromatic Iridescent 3D Blob',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><radialGradient id="sphereGrad" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="%23f472b6"/><stop offset="40%" stop-color="%23818cf8"/><stop offset="80%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%230f172a"/></radialGradient></defs><rect width="600" height="400" fill="%23090a0f"/><circle cx="300" cy="200" r="140" fill="url(%23sphereGrad)" opacity="0.9"/><text x="40" y="60" fill="%23cbd5e1" font-family="monospace" font-size="14">CHROMATIC_IRIDESCENCE // 3D</text><text x="40" y="360" fill="%2394a3b8" font-family="sans-serif" font-size="13">Smooth organic deformation with fluid subsurface scattering</text></svg>',
    comments: [
      'Органическая 3D сфера с переливами цвета (розовый -> индиго -> бирюзовый)',
      'Подходит для центрального Hero-элемента лендинга',
      'Интерактивная деформация при движении курсора мыши'
    ],
    tags: ['3d', 'threejs', 'iridescent', 'organic', 'shader', 'hero'],
    groups: ['3D / WebGL', 'Анимация', 'Цвета'],
    description: 'Iridescent organic 3D fluid sphere with smooth color transitions and subsurface lighting.',
    created: '2026-02-22',
    author: 'Studio Chromatic'
  }
];
