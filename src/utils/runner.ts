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
