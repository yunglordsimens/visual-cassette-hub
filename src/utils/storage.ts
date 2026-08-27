import JSZip from 'jszip';
import { BUILTIN_CASSETTES } from '../cassettes/data';
import { BUILTIN_REFERENCES } from '../references/data';
import { BUILTIN_PROJECTS } from '../projects/data';
import { Cassette, ReferenceItem, ProjectItem, GitHubSyncConfig } from '../types';

const STORAGE_KEY_CUSTOM = 'art_playground_custom_cassettes_v1';
const STORAGE_KEY_DELETED = 'art_playground_deleted_ids_v1';
const STORAGE_KEY_FAVORITES = 'art_playground_favorites_v1';
const STORAGE_KEY_GITHUB = 'art_playground_github_config_v1';
const STORAGE_KEY_REFERENCES = 'art_playground_references_v1';
const STORAGE_KEY_DELETED_REFS = 'art_playground_deleted_refs_v1';
const STORAGE_KEY_PROJECTS = 'art_playground_projects_v1';
const STORAGE_KEY_DELETED_PROJECTS = 'art_playground_deleted_projects_v1';

export function getFileExtensionForType(type: string): string {
  switch (type) {
    case 'p5':
    case 'three':
    case 'canvas':
      return 'js';
    case 'html':
      return 'html';
    case 'react':
      return 'jsx';
    default:
      return 'js';
  }
}

// ----------------------------------------------------
// Cassettes Storage
// ----------------------------------------------------

export function loadStoredCustomCassettes(): Cassette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom cassettes from localStorage:', e);
    return [];
  }
}

export function saveStoredCustomCassettes(cassettes: Cassette[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(cassettes));
  } catch (e) {
    console.error('Failed to save custom cassettes:', e);
  }
}

export function getDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getFavoriteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function toggleFavoriteId(id: string): boolean {
  const favs = getFavoriteIds();
  let isNowFav = false;
  if (favs.has(id)) {
    favs.delete(id);
    isNowFav = false;
  } else {
    favs.add(id);
    isNowFav = true;
  }
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favs)));
  return isNowFav;
}

export function loadAllCassettes(): Cassette[] {
  const deletedIds = getDeletedIds();
  const favoriteIds = getFavoriteIds();
  const customCassettes = loadStoredCustomCassettes();

  const customMap = new Map<string, Cassette>();
  for (const c of customCassettes) {
    customMap.set(c.manifest.id, c);
  }

  const combined: Cassette[] = [];

  for (const builtin of BUILTIN_CASSETTES) {
    if (deletedIds.has(builtin.manifest.id)) continue;
    
    if (customMap.has(builtin.manifest.id)) {
      const customVer = customMap.get(builtin.manifest.id)!;
      combined.push({
        ...customVer,
        isFavorite: favoriteIds.has(customVer.manifest.id)
      });
      customMap.delete(builtin.manifest.id);
    } else {
      combined.push({
        ...builtin,
        isFavorite: favoriteIds.has(builtin.manifest.id)
      });
    }
  }

  for (const [_, custom] of customMap) {
    if (!deletedIds.has(custom.manifest.id)) {
      combined.push({
        ...custom,
        isCustom: true,
        isFavorite: favoriteIds.has(custom.manifest.id)
      });
    }
  }

  return combined;
}

export function saveCassette(cassette: Cassette): void {
  const custom = loadStoredCustomCassettes();
  const idx = custom.findIndex(c => c.manifest.id === cassette.manifest.id);
  
  const deleted = getDeletedIds();
  if (deleted.has(cassette.manifest.id)) {
    deleted.delete(cassette.manifest.id);
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(Array.from(deleted)));
  }

  const updatedCassette: Cassette = {
    ...cassette,
    updatedAt: new Date().toISOString(),
    isCustom: true
  };

  if (idx >= 0) {
    custom[idx] = updatedCassette;
  } else {
    custom.unshift(updatedCassette);
  }

  saveStoredCustomCassettes(custom);
}

export function deleteCassette(id: string): void {
  const custom = loadStoredCustomCassettes().filter(c => c.manifest.id !== id);
  saveStoredCustomCassettes(custom);

  const deleted = getDeletedIds();
  deleted.add(id);
  localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(Array.from(deleted)));
}

// ----------------------------------------------------
// References (Moodboard) Storage
// ----------------------------------------------------

export function getDeletedRefIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_REFS);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function loadStoredCustomReferences(): ReferenceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REFERENCES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom references:', e);
    return [];
  }
}

export function saveStoredCustomReferences(refs: ReferenceItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REFERENCES, JSON.stringify(refs));
  } catch (e) {
    console.error('Failed to save custom references:', e);
  }
}

export function loadAllReferences(): ReferenceItem[] {
  const deleted = getDeletedRefIds();
  const custom = loadStoredCustomReferences();

  const customMap = new Map<string, ReferenceItem>();
  for (const r of custom) {
    customMap.set(r.id, r);
  }

  const combined: ReferenceItem[] = [];

  for (const b of BUILTIN_REFERENCES) {
    if (deleted.has(b.id)) continue;
    if (customMap.has(b.id)) {
      combined.push(customMap.get(b.id)!);
      customMap.delete(b.id);
    } else {
      combined.push(b);
    }
  }

  for (const [_, item] of customMap) {
    if (!deleted.has(item.id)) {
      combined.push(item);
    }
  }

  return combined;
}

export function saveReference(item: ReferenceItem): void {
  const custom = loadStoredCustomReferences();
  const idx = custom.findIndex(r => r.id === item.id);

  const deleted = getDeletedRefIds();
  if (deleted.has(item.id)) {
    deleted.delete(item.id);
    localStorage.setItem(STORAGE_KEY_DELETED_REFS, JSON.stringify(Array.from(deleted)));
  }

  if (idx >= 0) {
    custom[idx] = item;
  } else {
    custom.unshift(item);
  }

  saveStoredCustomReferences(custom);
}

export function deleteReference(id: string): void {
  const custom = loadStoredCustomReferences().filter(r => r.id !== id);
  saveStoredCustomReferences(custom);

  const deleted = getDeletedRefIds();
  deleted.add(id);
  localStorage.setItem(STORAGE_KEY_DELETED_REFS, JSON.stringify(Array.from(deleted)));
}

// ----------------------------------------------------
// Projects Storage
// ----------------------------------------------------

export function getDeletedProjectIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_PROJECTS);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function loadStoredCustomProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom projects:', e);
    return [];
  }
}

export function saveStoredCustomProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save custom projects:', e);
  }
}

export function loadAllProjects(): ProjectItem[] {
  const deleted = getDeletedProjectIds();
  const custom = loadStoredCustomProjects();

  const customMap = new Map<string, ProjectItem>();
  for (const p of custom) {
    customMap.set(p.id, p);
  }

  const combined: ProjectItem[] = [];

  for (const b of BUILTIN_PROJECTS) {
    if (deleted.has(b.id)) continue;
    if (customMap.has(b.id)) {
      combined.push(customMap.get(b.id)!);
      customMap.delete(b.id);
    } else {
      combined.push(b);
    }
  }

  for (const [_, item] of customMap) {
    if (!deleted.has(item.id)) {
      combined.push(item);
    }
  }

  return combined;
}

export function saveProject(item: ProjectItem): void {
  const custom = loadStoredCustomProjects();
  const idx = custom.findIndex(p => p.id === item.id);

  const deleted = getDeletedProjectIds();
  if (deleted.has(item.id)) {
    deleted.delete(item.id);
    localStorage.setItem(STORAGE_KEY_DELETED_PROJECTS, JSON.stringify(Array.from(deleted)));
  }

  const updated: ProjectItem = {
    ...item,
    updatedAt: new Date().toISOString()
  };

  if (idx >= 0) {
    custom[idx] = updated;
  } else {
    custom.unshift(updated);
  }

  saveStoredCustomProjects(custom);
}

export function deleteProject(id: string): void {
  const custom = loadStoredCustomProjects().filter(p => p.id !== id);
  saveStoredCustomProjects(custom);

  const deleted = getDeletedProjectIds();
  deleted.add(id);
  localStorage.setItem(STORAGE_KEY_DELETED_PROJECTS, JSON.stringify(Array.from(deleted)));
}

// ----------------------------------------------------
// GitHub Config & Packaging
// ----------------------------------------------------

export function getGitHubConfig(): GitHubSyncConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GITHUB);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse GitHub config:', e);
  }
  return {
    owner: '',
    repo: '',
    branch: 'main',
    token: '',
    autoSync: false
  };
}

export function saveGitHubConfig(config: GitHubSyncConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save GitHub config:', e);
  }
}

export async function downloadCassetteZip(cassette: Cassette): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(cassette.manifest.id) || zip;
  
  const manifestJson = JSON.stringify(cassette.manifest, null, 2);
  folder.file('manifest.json', manifestJson);
  
  const ext = getFileExtensionForType(cassette.manifest.type);
  folder.file(`code.${ext}`, cassette.code);
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cassette-${cassette.manifest.id}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllCassettesZip(
  cassettes: Cassette[],
  references: ReferenceItem[] = [],
  projects: ProjectItem[] = []
): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('src')!;
  const cassettesFolder = root.folder('cassettes')!;
  
  for (const c of cassettes) {
    const folder = cassettesFolder.folder(c.manifest.id)!;
    folder.file('manifest.json', JSON.stringify(c.manifest, null, 2));
    const ext = getFileExtensionForType(c.manifest.type);
    folder.file(`code.${ext}`, c.code);
  }

  // Include references
  if (references.length > 0) {
    const refsFolder = root.folder('references')!;
    for (const r of references) {
      refsFolder.file(`${r.id}.json`, JSON.stringify(r, null, 2));
    }
  }

  // Include projects
  if (projects.length > 0) {
    const projsFolder = root.folder('projects')!;
    for (const p of projects) {
      projsFolder.file(`${p.id}.json`, JSON.stringify(p, null, 2));
      if (p.assembledCode) {
        projsFolder.file(`${p.id}-assembled.html`, p.assembledCode);
      }
    }
  }

  // Root index manifest
  const indexManifest = {
    vault: cassettes.map(c => c.manifest),
    references: references.map(r => ({ id: r.id, title: r.title, tags: r.tags, groups: r.groups })),
    projects: projects.map(p => ({ id: p.id, title: p.title, tags: p.tags }))
  };
  zip.file('index.json', JSON.stringify(indexManifest, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `art-playground-full-vault.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

