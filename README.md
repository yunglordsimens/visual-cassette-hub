# Personal Art Playground

A lightweight, high-performance web vault and interactive runner for your creative code experiments (**«кассеты»** / cassettes). Store, preview, filter, live-edit, and bundle your visual sketches (Processing/p5.js, Three.js 3D scenes, Canvas 2D / Shaders, Pure HTML/CSS, and React JSX).

Designed for artists: add new experiments from your phone, remix existing sketches, collect visual assets into a project mix basket, and sync with GitHub.

---

## How Cassettes Are Structured

Every visual experiment is a self-contained cassette located in `/src/cassettes/<cassette-id>/`:

```
src/cassettes/
  ├── quantum-flowfield/
  │   ├── manifest.json
  │   └── code.js
  ├── hypercube-prism/
  │   ├── manifest.json
  │   └── code.js
  ├── cyber-audio-spectrum/
  │   ├── manifest.json
  │   └── code.html
  └── custom-sketch-name/
      ├── manifest.json
      └── code.jsx
```

### `manifest.json` Format:
```json
{
  "id": "my-generative-sketch",
  "title": "Neon Quantum Wave",
  "tags": ["p5js", "generative", "particles", "neon"],
  "type": "p5",
  "description": "Perlin noise particle stream with mouse attraction.",
  "created": "2026-02-24",
  "author": "Artist"
}
```

### Supported Types:
- `p5` — Processing / p5.js (`setup()`, `draw()`, `windowResized()`)
- `three` — Three.js 3D WebGL scenes (with OrbitControls & lighting)
- `canvas` — HTML5 Canvas / WebGL shaders / 2D animation loops
- `react` — React JSX micro-applications
- `html` — Raw standalone HTML / CSS / JS

---

## How to Add & Edit Cassettes

### Method 1: Right from the Web UI (Phone or Desktop)
1. Open the app and tap **"+ New Cassette"** (or the floating **"+" button** on mobile).
2. Choose a starter template or write your code.
3. Use the live **Test Preview** to check the visual output in real-time.
4. Tap **"Save to Library"** (instant local persistence) or **"Push to GitHub"** (commits directly to your repository if you configured a GitHub Token in Settings).

### Method 2: Directly via GitHub Web (Zero Setup)
1. In your GitHub repository, navigate to `src/cassettes/`.
2. Click **Add file -> Create new file**.
3. Create `src/cassettes/<your-id>/manifest.json` and paste your metadata.
4. Create `src/cassettes/<your-id>/code.js` (or `.html` / `.jsx`) and paste your sketch code.
5. Commit to `main` — your deployed site will automatically update!

### Method 3: Mix Basket & ZIP Export
- Click the **Mix Basket (Layers)** icon on any card to collect sketches.
- Open the Mix Basket to **Export all selected sketches as a ZIP archive** or copy a merged code bundle for downstream production projects.

---

## Free 1-Click Deployment

### Option A: GitHub Pages (Automatic on push to `main`)
1. Push your repository to GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. Choose the default **Vite / Static HTML** workflow.
5. Every push to `main` automatically builds and deploys your Art Playground!

### Option B: Vercel / Netlify
1. Log in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Click **"Import Project"** and select your GitHub repository.
3. Framework Preset: **Vite**.
4. Click **Deploy**.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
