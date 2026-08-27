import { ReferenceItem, Cassette } from '../types';

const STORAGE_KEY_GEMINI_API_KEY = 'art_playground_gemini_api_key_v1';

export function getStoredGeminiApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_GEMINI_API_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_GEMINI_API_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save Gemini API key:', e);
  }
}

export interface GeneratePageOptions {
  prompt: string;
  refTitle: string;
  refComments: string[];
  refImageBase64?: string;
  refImageMime?: string;
}

export interface GeneratePageResult {
  success: boolean;
  html?: string;
  error?: string;
}

export async function generatePageFromReference(options: GeneratePageOptions): Promise<GeneratePageResult> {
  const userApiKey = getStoredGeminiApiKey();

  try {
    const res = await fetch('/api/gemini/generate-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: options.prompt,
        refTitle: options.refTitle,
        refComments: options.refComments,
        refImageBase64: options.refImageBase64,
        refImageMime: options.refImageMime,
        apiKey: userApiKey || undefined
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Server responded with ${res.status}`);
    }

    return {
      success: true,
      html: data.html
    };
  } catch (err: any) {
    console.error('generatePageFromReference error:', err);
    return {
      success: false,
      error: err.message || 'Failed to communicate with AI generation endpoint'
    };
  }
}

export interface AutoTagOptions {
  title: string;
  description?: string;
  comments?: string[];
  code?: string;
  type?: string;
}

export interface AutoTagResult {
  success: boolean;
  tags?: string[];
  groups?: string[];
  error?: string;
}

export async function autoTagAsset(options: AutoTagOptions): Promise<AutoTagResult> {
  const userApiKey = getStoredGeminiApiKey();

  try {
    const res = await fetch('/api/gemini/auto-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: options.title,
        description: options.description,
        comments: options.comments,
        code: options.code,
        type: options.type,
        apiKey: userApiKey || undefined
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Auto-tag failed with status ${res.status}`);
    }

    return {
      success: true,
      tags: data.tags || [],
      groups: data.groups || []
    };
  } catch (err: any) {
    console.error('autoTagAsset error:', err);
    return {
      success: false,
      error: err.message || 'Failed to auto-tag with AI'
    };
  }
}

export interface AssembleProjectOptions {
  projectName: string;
  description: string;
  prompt: string;
  items: Array<{
    id: string;
    title: string;
    kind: 'cassette' | 'reference';
    type?: string;
    code?: string;
    comments?: string[];
    tags?: string[];
    description?: string;
  }>;
}

export interface AssembleProjectResult {
  success: boolean;
  html?: string;
  error?: string;
}

export async function assembleProject(options: AssembleProjectOptions): Promise<AssembleProjectResult> {
  const userApiKey = getStoredGeminiApiKey();

  try {
    const res = await fetch('/api/gemini/assemble', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectName: options.projectName,
        description: options.description,
        prompt: options.prompt,
        items: options.items,
        apiKey: userApiKey || undefined
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Project assembly failed with status ${res.status}`);
    }

    return {
      success: true,
      html: data.html
    };
  } catch (err: any) {
    console.error('assembleProject error:', err);
    return {
      success: false,
      error: err.message || 'Failed to assemble site with AI'
    };
  }
}
