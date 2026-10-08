export type CassetteType = 'p5' | 'three' | 'html' | 'react' | 'canvas';

export type NavigationTab = 'vault' | 'references' | 'projects';

export interface CassetteManifest {
  id: string;
  title: string;
  tags: string[];
  groups?: string[]; // High-level semantic categories (e.g. "Шрифты", "Цвета", "Анимация")
  comments?: string[]; // User notes & artist feedback
  type: CassetteType;
  description: string;
  created: string;
  author?: string;
  thumbnail?: string; // Data URL or 'auto'
  version?: string;
  sourceUrl?: string;
  codeUrl?: string; // Library cassettes: lazily fetched source file
  previewUrl?: string; // Library cassettes: standalone runnable page
  lang?: string; // Original source language (html, typescript, javascript…)
  source?: string; // Where the cassette came from (e.g. 'gemini')
}

export interface Cassette {
  manifest: CassetteManifest;
  code: string;
  isCustom?: boolean;
  isFavorite?: boolean;
  updatedAt?: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  image: string; // Base64 data URL or public URL
  comments: string[];
  tags: string[];
  groups?: string[];
  description?: string;
  created: string;
  author?: string;
  sourceUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  siteVisionPrompt?: string;
  selectedElementIds: string[]; // List of cassette IDs or reference IDs
  assembledCode?: string;
  assembledCassetteId?: string;
  tags: string[];
  groups?: string[];
  comments?: string[];
  created: string;
  updatedAt?: string;
}

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  autoSync?: boolean;
}

export interface GeminiConfig {
  customApiKey: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'type';

export interface FilterState {
  search: string;
  type: string; // 'all' or CassetteType
  selectedTags: string[];
  selectedGroups?: string[];
  sortBy: SortOption;
  favoritesOnly: boolean;
}

