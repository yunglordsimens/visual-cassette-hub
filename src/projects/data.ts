import { ProjectItem } from '../types';

export const BUILTIN_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-cyber-portfolio',
    title: 'Cyberpunk Creative Studio Portfolio',
    description: 'A unified single-page showcase combining interactive fluid particle dynamics, 3D holographic cards, and Swiss kinetic typography.',
    siteVisionPrompt: 'Create a high-impact creative tech portfolio site with a full-screen interactive background particle field, floating frosted-glass case study cards, and live sound wave reactive footer.',
    selectedElementIds: [
      'quantum-flowfield',
      'ref-kinetic-typography-poster',
      'hypercube-prism',
      'ref-holographic-card-interface'
    ],
    tags: ['project', 'portfolio', 'interactive', 'cyberpunk', 'threejs'],
    groups: ['Структура', '3D / WebGL', 'Интерактив'],
    comments: [
      'Собрать частицы на фоне Hero-секции',
      'Сделать меню в стиле минималистичного HUD',
      'Добавить секцию с 3D интерактивным кубом'
    ],
    created: '2026-02-24'
  }
];
