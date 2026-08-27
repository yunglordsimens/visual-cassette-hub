import { Cassette, GitHubSyncConfig } from '../types';
import { getFileExtensionForType } from './storage';

export interface GitHubSyncResult {
  success: boolean;
  message: string;
  manifestUrl?: string;
  codeUrl?: string;
}

// Convert UTF-8 string to base64 safely in browser
function utf8ToBase64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

/**
 * Gets file SHA if it already exists on GitHub
 */
async function getFileSha(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
  } catch {
    // File doesn't exist yet
  }
  return null;
}

/**
 * Commits a single file to GitHub via Contents API
 */
async function putGitHubFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  commitMessage: string,
  branch: string,
  token: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const sha = await getFileSha(owner, repo, path, branch, token);
    const body: Record<string, any> = {
      message: commitMessage,
      content: utf8ToBase64(content),
      branch: branch || 'main'
    };
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || 'GitHub API returned ' + res.status };
    }

    const data = await res.json();
    return { success: true, url: data.content?.html_url };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

/**
 * Synchronizes a cassette to GitHub repo:
 * Commits manifest.json and code.{ext}
 */
export async function pushCassetteToGitHub(
  config: GitHubSyncConfig,
  cassette: Cassette
): Promise<GitHubSyncResult> {
  if (!config.owner || !config.repo) {
    return {
      success: false,
      message: 'GitHub Owner and Repository name are required. Please configure them in Settings.'
    };
  }

  if (!config.token) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is required for automatic API sync. Or use the "Edit on GitHub Web" button.'
    };
  }

  const branch = config.branch || 'main';
  const id = cassette.manifest.id;
  const ext = getFileExtensionForType(cassette.manifest.type);

  // 1. Commit manifest.json
  const manifestPath = `src/cassettes/${id}/manifest.json`;
  const manifestContent = JSON.stringify(cassette.manifest, null, 2);
  const manifestRes = await putGitHubFile(
    config.owner,
    config.repo,
    manifestPath,
    manifestContent,
    `feat(cassette): update ${cassette.manifest.title} manifest`,
    branch,
    config.token
  );

  if (!manifestRes.success) {
    return {
      success: false,
      message: `Failed to commit manifest.json: ${manifestRes.error}`
    };
  }

  // 2. Commit code file
  const codePath = `src/cassettes/${id}/code.${ext}`;
  const codeRes = await putGitHubFile(
    config.owner,
    config.repo,
    codePath,
    cassette.code,
    `feat(cassette): update ${cassette.manifest.title} code`,
    branch,
    config.token
  );

  if (!codeRes.success) {
    return {
      success: false,
      message: `Manifest saved, but code commit failed: ${codeRes.error}`
    };
  }

  return {
    success: true,
    message: `Cassette "${cassette.manifest.title}" committed successfully to GitHub!`,
    manifestUrl: manifestRes.url,
    codeUrl: codeRes.url
  };
}

/**
 * Deletes a cassette from GitHub repository
 */
export async function deleteCassetteFromGitHub(
  config: GitHubSyncConfig,
  cassette: Cassette
): Promise<{ success: boolean; message: string }> {
  if (!config.owner || !config.repo || !config.token) {
    return { success: false, message: 'GitHub credentials missing' };
  }

  const branch = config.branch || 'main';
  const id = cassette.manifest.id;
  const ext = getFileExtensionForType(cassette.manifest.type);

  try {
    const manifestPath = `src/cassettes/${id}/manifest.json`;
    const manifestSha = await getFileSha(config.owner, config.repo, manifestPath, branch, config.token);
    if (manifestSha) {
      await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${manifestPath}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `chore: remove cassette ${cassette.manifest.title} manifest`,
          sha: manifestSha,
          branch
        })
      });
    }

    const codePath = `src/cassettes/${id}/code.${ext}`;
    const codeSha = await getFileSha(config.owner, config.repo, codePath, branch, config.token);
    if (codeSha) {
      await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${codePath}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `chore: remove cassette ${cassette.manifest.title} code`,
          sha: codeSha,
          branch
        })
      });
    }

    return { success: true, message: `Cassette removed from GitHub repository.` };
  } catch (err: any) {
    return { success: false, message: `Delete failed: ${err.message}` };
  }
}

/**
 * Generates direct Web Editor link on GitHub (e.g. github.dev or standard repo tree)
 */
export function getGitHubWebUrl(config: GitHubSyncConfig, cassette?: Cassette): string {
  if (!config.owner || !config.repo) {
    return 'https://github.com';
  }
  const branch = config.branch || 'main';
  if (!cassette) {
    return `https://github.com/${config.owner}/${config.repo}/tree/${branch}/src/cassettes`;
  }
  return `https://github.com/${config.owner}/${config.repo}/tree/${branch}/src/cassettes/${cassette.manifest.id}`;
}

export function getGitHubDevWebUrl(config: GitHubSyncConfig): string {
  if (!config.owner || !config.repo) return 'https://github.dev';
  return `https://github.dev/${config.owner}/${config.repo}`;
}
