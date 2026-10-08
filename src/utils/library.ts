import { Cassette, CassetteManifest } from '../types';

/**
 * Library cassettes live as static files in /public/library/<id>/:
 *   code.<ext>    — original source (html / jsx / tsx)
 *   preview.html  — standalone runnable page used for card + viewer previews
 * and are listed in /public/library/index.json (manifests only), so the
 * main bundle stays small and code is fetched only when it's needed.
 */

let LIBRARY: Cassette[] = [];
const codeCache = new Map<string, string>();

const base = (import.meta as any).env?.BASE_URL ?? './';

export function resolveLibraryUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return base.replace(/\/?$/, '/') + url.replace(/^\.?\//, '');
}

export function getLibraryCassettes(): Cassette[] {
  return LIBRARY;
}

export async function loadLibraryIndex(): Promise<Cassette[]> {
  try {
    const res = await fetch(resolveLibraryUrl('library/index.json'), { cache: 'no-cache' });
    if (!res.ok) return LIBRARY;
    const manifests: CassetteManifest[] = await res.json();
    LIBRARY = manifests.map((m) => ({ manifest: m, code: '' }));
  } catch (e) {
    console.error('Failed to load library index:', e);
  }
  return LIBRARY;
}

/** Returns the cassette's code, fetching it from the library if it isn't inlined. */
export async function getCassetteCode(c: Cassette): Promise<string> {
  if (c.code) return c.code;
  const url = c.manifest.codeUrl;
  if (!url) return '';
  if (codeCache.has(url)) return codeCache.get(url)!;
  try {
    const res = await fetch(resolveLibraryUrl(url));
    const text = res.ok ? await res.text() : '';
    codeCache.set(url, text);
    return text;
  } catch {
    return '';
  }
}

/** Resolves code for a list of cassettes (used by bundle export / project assembly). */
export async function withCode(list: Cassette[]): Promise<Cassette[]> {
  return Promise.all(list.map(async (c) => (c.code ? c : { ...c, code: await getCassetteCode(c) })));
}
