import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON payload limit for image data
  app.use(express.json({ limit: '25mb' }));

  // Helper to get GoogleGenAI instance
  function getGeminiClient(customApiKey?: string): GoogleGenAI {
    const key = customApiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured on the server or provided in the request.');
    }
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  // API Health & Status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasServerKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // API 1: Generate landing page from moodboard reference
  app.post('/api/gemini/generate-page', async (req, res) => {
    try {
      const { prompt, refTitle, refComments, refImageBase64, refImageMime, apiKey } = req.body;
      const ai = getGeminiClient(apiKey);

      const parts: any[] = [];

      // If reference image provided, pass multimodal image part
      if (refImageBase64) {
        let cleanBase64 = refImageBase64;
        let mime = refImageMime || 'image/png';
        if (cleanBase64.includes(',')) {
          const match = cleanBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
          if (match) {
            mime = match[1];
            cleanBase64 = match[2];
          } else {
            cleanBase64 = cleanBase64.split(',')[1];
          }
        }
        parts.push({
          inlineData: {
            mimeType: mime,
            data: cleanBase64
          }
        });
      }

      const instructions = `
You are an expert creative web developer and UI/UX artist.
The user wants to generate a complete, standalone, responsive, interactive single-page landing website / creative experience inspired by a visual reference.

Reference Title: ${refTitle || 'Visual Inspiration'}
Reference Notes / Comments: ${Array.isArray(refComments) ? refComments.join('; ') : (refComments || 'None')}
User Custom Request: ${prompt || 'Create a visually stunning landing page capturing the exact aesthetic, color palette, typography, and interactive mood of this reference.'}

Requirements:
1. Output ONLY valid, complete HTML with embedded CSS (<style>) and JavaScript (<script>).
2. Do not use Markdown backticks (like \`\`\`html) in the final code output if possible, or provide standard clean code that can run directly inside a sandboxed iframe.
3. Include modern, beautiful typography, smooth animations, interactive hover states, glassmorphism or neon accents matching the mood, and mobile-friendly responsive layout.
4. You can include standard public CDN scripts if needed (e.g. Tailwind via <script src="https://cdn.tailwindcss.com"></script>, FontAwesome, Google Fonts, or Lucide icons).
5. Ensure the page is rich, fully styled, has hero, features/visual showcase, interactive demo, and footer sections.
`;

      parts.push({ text: instructions });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          temperature: 0.7,
        }
      });

      let generatedHtml = response.text || '';
      // Strip markdown code fences if model wrapped it
      if (generatedHtml.startsWith('```html')) {
        generatedHtml = generatedHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
      } else if (generatedHtml.startsWith('```')) {
        generatedHtml = generatedHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      res.json({
        success: true,
        html: generatedHtml.trim()
      });
    } catch (err: any) {
      console.error('Error generating page from reference:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate page'
      });
    }
  });

  // API 2: Auto-tagging & Group categorization
  app.post('/api/gemini/auto-tag', async (req, res) => {
    try {
      const { title, description, comments, code, type, apiKey } = req.body;
      const ai = getGeminiClient(apiKey);

      const promptText = `
Analyze this creative code / visual design asset and generate accurate, relevant tags and high-level semantic group categories in English and Russian.

Asset Title: ${title || 'Untitled'}
Asset Type: ${type || 'visual'}
Description: ${description || ''}
Comments / Artist Notes: ${Array.isArray(comments) ? comments.join('\n') : (comments || '')}
Code snippet / context: ${(code || '').slice(0, 1500)}

Task:
1. Return 4-8 concise, specific tags (e.g. ["typography", "neon", "flowfield", "particles", "dark-mode", "kinetic", "landing"]).
2. Return 2-4 high-level semantic groups/categories (e.g. ["Шрифты", "Цвета", "Анимация", "Сетка", "3D / WebGL", "Интерактив"]).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 4-8 specific descriptive tags'
              },
              groups: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 2-4 thematic category groups'
              }
            },
            required: ['tags', 'groups']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{"tags":[], "groups":[]}');
      res.json({
        success: true,
        tags: parsed.tags || [],
        groups: parsed.groups || []
      });
    } catch (err: any) {
      console.error('Error auto-tagging:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to auto-tag asset'
      });
    }
  });

  // API 3: Project Assembly (Combining multiple cassettes/references into a unified site)
  app.post('/api/gemini/assemble', async (req, res) => {
    try {
      const { projectName, description, prompt, items, apiKey } = req.body;
      const ai = getGeminiClient(apiKey);

      const itemsSummary = (items || []).map((item: any, idx: number) => {
        return `
--- ELEMENT #${idx + 1} ---
Title: ${item.title}
Kind: ${item.kind || 'cassette'} (Type: ${item.type || 'html'})
Tags: ${(item.tags || []).join(', ')}
Notes/Comments: ${(item.comments || []).join('; ')}
Code or description:
${(item.code || item.description || '').slice(0, 2500)}
`;
      }).join('\n');

      const assemblyPrompt = `
You are an ultra-skilled creative developer and design architect.
The user is assembling a unified, cohesive, high-end web application / landing site named "${projectName || 'Assembled Creative Project'}".

User's Site Vision & Prompt:
${prompt || 'Harmoniously combine the visual animations, shader effects, typography, color palette, and layout structure from all selected elements into a single responsive, interactive web page.'}

Project Description:
${description || 'A unified project synthesized from selected creative code cassettes and moodboard references.'}

Selected Elements to integrate:
${itemsSummary}

Requirements for the assembled HTML:
1. Combine all the selected visual ideas, animations, interactive canvas / three / shader logic, and aesthetic themes into ONE cohesive, gorgeous standalone HTML document with embedded CSS (<style>) and JS (<script>).
2. Use Tailwind CDN (<script src="https://cdn.tailwindcss.com"></script>) and any required CDNs (Three.js, p5.js, Lucide icons, Google Fonts) to guarantee all components render seamlessly.
3. Make sure the visual styles blend elegantly (unified dark luxury color palette, fluid layout, responsive navigation, hero section featuring key visuals, interactive showcase sections, and sleek footer).
4. Provide ONLY the complete, ready-to-run HTML code with no conversational wrapper.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: assemblyPrompt,
        config: {
          temperature: 0.7,
        }
      });

      let assembledHtml = response.text || '';
      if (assembledHtml.startsWith('```html')) {
        assembledHtml = assembledHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
      } else if (assembledHtml.startsWith('```')) {
        assembledHtml = assembledHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      res.json({
        success: true,
        html: assembledHtml.trim()
      });
    } catch (err: any) {
      console.error('Error assembling project:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to assemble project'
      });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Art Playground Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
