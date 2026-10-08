import { CassetteType } from '../types';

export interface RunnerOptions {
  interactive?: boolean;
  captureErrors?: boolean;
  background?: string;
}

/**
 * Builds a standalone HTML document to be injected into an iframe srcdoc.
 * Injects required CDNs, CSS resets, error wrappers, and handles resize properly.
 */

/** True when React code is written as an ES module (imports / export default), e.g. Gemini Canvas output. */
export function isModuleReactCode(code: string): boolean {
  return /^\s*import\s[\s\S]*?from\s+['"]|^\s*export\s+default\b/m.test(code);
}

export const REACT_IMPORT_MAP = {
  imports: {
    react: 'https://esm.sh/react@18.3.1',
    'react/': 'https://esm.sh/react@18.3.1/',
    'react-dom': 'https://esm.sh/react-dom@18.3.1',
    'react-dom/': 'https://esm.sh/react-dom@18.3.1/'
  }
};

/**
 * Builds a page for module-style React/TSX code. Babel (TS + JSX) runs in the
 * iframe, bare imports go to esm.sh with React kept external, and the default
 * export (or App) is mounted into #root. Pages can scroll like real sites.
 */
export function buildReactModuleHtml(code: string, errorCatcherScript = ''): string {
  const json = JSON.stringify(code).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <script type="importmap">${JSON.stringify(REACT_IMPORT_MAP)}</script>
  <style>
    html, body { margin: 0; min-height: 100%; }
    #runtime-error-toast { display:none; position:fixed; bottom:12px; left:12px; right:12px; background:rgba(225,29,72,.9); color:#fff; padding:8px 12px; border-radius:6px; font:11px monospace; z-index:999999; }
  </style>
  ${errorCatcherScript}
</head>
<body>
  <div id="runtime-error-toast"></div>
  <div id="root"></div>
  <script type="module">
    const src = ${json};
    const show = (m) => { const t = document.getElementById('runtime-error-toast'); t.style.display = 'block'; t.innerText = m; };
    try {
      let out = Babel.transform(src, {
        filename: 'App.tsx',
        presets: [['typescript', { isTSX: true, allExtensions: true }], ['react', { runtime: 'automatic' }]]
      }).code;
      out = out.replace(/(from\\s*|import\\s*\\(\\s*|import\\s+)(['"])([^'"./][^'"]*)\\2/g, (m, pre, q, spec) => {
        if (/^(react|react-dom)(\\/|$)/.test(spec) || /^https?:/.test(spec)) return m;
        return pre + q + 'https://esm.sh/' + spec + '?external=react,react-dom' + q;
      });
      const url = URL.createObjectURL(new Blob([out], { type: 'text/javascript' }));
      const mod = await import(url);
      const C = mod.default || mod.App;
      if (C) {
        const React = await import('react');
        const { createRoot } = await import('react-dom/client');
        createRoot(document.getElementById('root')).render(React.createElement(C));
      }
    } catch (err) { show('Runtime Error: ' + (err && err.message || err)); console.error(err); }
  </script>
</body>
</html>`;
}

export function buildSandboxedHtml(
  type: CassetteType,
  code: string,
  options: RunnerOptions = {}
): string {
  const bg = options.background || '#0a0c10';

  // Base error handling & console interceptor to prevent silent crashes
  const errorCatcherScript = `
    <script>
      window.onerror = function(msg, url, lineNo, columnNo, error) {
        const errContainer = document.getElementById('runtime-error-toast');
        if (errContainer) {
          errContainer.style.display = 'block';
          errContainer.innerText = 'Runtime Error: ' + msg + ' (Line ' + lineNo + ')';
        }
        console.error('Cassette Runtime Error:', msg, 'line:', lineNo, error);
        return false;
      };
      window.addEventListener('unhandledrejection', function(event) {
        const errContainer = document.getElementById('runtime-error-toast');
        if (errContainer) {
          errContainer.style.display = 'block';
          errContainer.innerText = 'Promise Rejection: ' + (event.reason ? (event.reason.message || event.reason) : 'Unknown error');
        }
      });
    </script>
  `;

  const commonStyles = `
    <style>
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: ${bg};
        color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
      }
      canvas {
        display: block;
        touch-action: none;
      }
      #runtime-error-toast {
        display: none;
        position: fixed;
        bottom: 12px;
        left: 12px;
        right: 12px;
        background: rgba(225, 29, 72, 0.9);
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 11px;
        z-index: 999999;
        backdrop-filter: blur(4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
    </style>
  `;

  if (type === 'p5') {
    // p5.js sketch
    // Standard p5 global mode or instance mode
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ${commonStyles}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/addons/p5.sound.min.js"></script>
  ${errorCatcherScript}
</head>
<body>
  <div id="runtime-error-toast"></div>
  <script>
    // Ensure window resize is handled cleanly in p5
    const originalSetup = window.setup;
    const originalWindowResized = window.windowResized;
    
    // Inject user code
    try {
      ${code}
    } catch(err) {
      window.onerror(err.message, '', 0, 0, err);
    }

    if (typeof window.windowResized !== 'function') {
      window.windowResized = function() {
        if (typeof resizeCanvas === 'function') {
          resizeCanvas(windowWidth, windowHeight);
        }
      };
    }
  </script>
</body>
</html>`;
  }

  if (type === 'three') {
    // Three.js Scene
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ${commonStyles}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>
  ${errorCatcherScript}
</head>
<body>
  <div id="runtime-error-toast"></div>
  <div id="canvas-container" style="width: 100%; height: 100%;"></div>
  <script>
    try {
      ${code}
    } catch(err) {
      window.onerror(err.message, '', 0, 0, err);
    }
  </script>
</body>
</html>`;
  }

  if (type === 'react' && isModuleReactCode(code)) {
    return buildReactModuleHtml(code, errorCatcherScript);
  }

  if (type === 'react') {
    // React + Babel Standalone
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ${commonStyles}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  ${errorCatcherScript}
</head>
<body>
  <div id="runtime-error-toast"></div>
  <div id="root" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    
    try {
      ${code}
      
      // If code defines App or Component, render it
      const ComponentToRender = typeof App !== 'undefined' ? App : 
                                typeof Cassette !== 'undefined' ? Cassette : 
                                typeof Art !== 'undefined' ? Art : null;
      
      if (ComponentToRender) {
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(ComponentToRender));
      }
    } catch(err) {
      window.onerror(err.message, '', 0, 0, err);
    }
  </script>
</body>
</html>`;
  }

  // HTML / Canvas standard format
  // If user provided a complete <html> document, embed error toast and return
  if (code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html')) {
    return code;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  ${commonStyles}
  ${errorCatcherScript}
</head>
<body>
  <div id="runtime-error-toast"></div>
  ${code}
</body>
</html>`;
}
