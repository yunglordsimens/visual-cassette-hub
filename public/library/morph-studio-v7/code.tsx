import React, { useEffect, useRef, useState } from 'react';

/**
 * MORPH STUDIO v6.0 - ULTRA LIQUID CHROME
 * * Ключевые изменения для реализма:
 * 1. Domain Warping: Искажение UV-координат шумом, чтобы капли были не круглыми, а "жидкими".
 * 2. High-Contrast Reflection: Новая формула света для имитации "дорогого" студийного хрома.
 * 3. Deep Integration: Капли теперь сильнее вплавляются в текст.
 */

const App = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  // --- ПАРАМЕТРЫ ---
  const [text, setText] = useState('ALIEN');
  const [fontSize, setFontSize] = useState(160);
  const [particleCount, setParticleCount] = useState(70);
  const [erosion, setErosion] = useState(0.48);
  const [smoothness, setSmoothness] = useState(20.0);
  const [warp, setWarp] = useState(0.3); // НОВОЕ: Сила искажения формы
  const [scatter, setScatter] = useState(60.0);
  const [color, setColor] = useState('#ffffff');
  const [customFont, setCustomFont] = useState('Inter');

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fontName = `CustomFont_${Date.now()}`;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fontFace = new FontFace(fontName, event.target.result);
        await fontFace.load();
        document.fonts.add(fontFace);
        setCustomFont(fontName);
      } catch (err) { console.error(err); }
    };
    reader.readAsArrayBuffer(file);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: false });
    if (!gl) return;

    // --- ШЕЙДЕР ---
    const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    
    const fs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_scene;
      uniform float u_erosion;
      uniform float u_warp;
      uniform vec3 u_tint;

      // Простой шум для искажения формы
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), f.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), f.x), f.y);
      }

      // Студийный свет (High Contrast)
      float getEnv(vec3 normal, vec3 viewDir) {
          vec3 r = reflect(-viewDir, normal);
          
          // 1. Горизонт (резкий переход)
          float horizon = smoothstep(-0.1, 0.1, r.y);
          
          // 2. Блики от "ламп"
          float light1 = pow(max(dot(r, normalize(vec3(0.5, 0.8, 0.5))), 0.0), 10.0); // Основной свет
          float light2 = pow(max(dot(r, normalize(vec3(-0.5, 0.2, 0.5))), 0.0), 4.0); // Заполняющий
          
          // 3. Rim light (свет по контуру)
          float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
          
          // Комбинируем: темный низ, яркие блики
          return horizon * 0.2 + light1 * 1.5 + light2 * 0.5 + rim * 0.5;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        uv.y = 1.0 - uv.y;

        // --- DOMAIN WARPING ---
        // Искажаем UV координаты шумом, чтобы жидкость "плыла"
        // Это делает капли неидеальными
        vec2 warpedUV = uv;
        warpedUV += vec2(
            noise(uv * 3.0 + u_time * 0.2),
            noise(uv * 3.0 - u_time * 0.3)
        ) * u_warp * 0.03;

        // Читаем высоту
        float h = texture2D(u_scene, warpedUV).a;
        
        // EROSION
        float shape = smoothstep(u_erosion - 0.01, u_erosion + 0.01, h);

        if (shape < 0.01) {
             gl_FragColor = vec4(vec3(0.02), 1.0); 
             return;
        }

        // Нормали
        vec2 e = vec2(2.0 / u_resolution.x, 0.0);
        float h_x = texture2D(u_scene, warpedUV + e).a - texture2D(u_scene, warpedUV - e).a;
        float h_y = texture2D(u_scene, warpedUV + e.yx).a - texture2D(u_scene, warpedUV - e.yx).a;
        
        // Нормаль: чем меньше Z (0.15), тем "выпуклее" кажется поверхность
        vec3 normal = normalize(vec3(-h_x * 8.0, -h_y * 8.0, 0.15));

        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        float env = getEnv(normal, viewDir);
        
        // COLOR GRADING
        vec3 col = vec3(0.0); // Черная база
        col += vec3(1.0) * env; // Отражения
        col *= u_tint; // Тинт
        
        // Добавляем хроматическую аберрацию по краям (для реализма)
        col.r += 0.02 * shape;
        col.b -= 0.02 * shape;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (gl, type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uErosion = gl.getUniformLocation(program, 'u_erosion');
    const uWarp = gl.getUniformLocation(program, 'u_warp');
    const uTint = gl.getUniformLocation(program, 'u_tint');

    // --- CANVAS ---
    const sceneCanvas = document.createElement('canvas');
    const ctx = sceneCanvas.getContext('2d', { willReadFrequently: true });
    const sceneTexture = gl.createTexture();
    
    let particles = [];
    const initParticles = () => {
        particles = [];
        for(let i=0; i<particleCount; i++) {
            particles.push({
                dist: 45 + Math.random() * scatter,
                size: 10 + Math.random() * 25,
                speed: 0.1 + Math.random() * 0.6,
                offset: Math.random() * 100,
                targetX: (Math.random() - 0.5) * (text.length * fontSize * 0.55),
            });
        }
    };
    initParticles();

    const render = (time) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); 
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      
      if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w; canvas.height = h;
          sceneCanvas.width = w; sceneCanvas.height = h;
      }
      
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      
      // Блюр создает карту высот
      ctx.filter = `blur(${smoothness * dpr}px)`; 
      
      // 1. Текст
      ctx.fillStyle = 'white';
      ctx.font = `900 ${fontSize * dpr}px "${customFont}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Рисуем текст несколько раз для плотности
      ctx.fillText(text, cx, cy);
      ctx.fillText(text, cx, cy);

      // 2. Частицы
      const mx = mouseRef.current.x * dpr;
      const my = mouseRef.current.y * dpr;
      const mouseActive = mouseRef.current.active;

      particles.forEach(p => {
          const t = time * 0.001 * p.speed + p.offset;
          
          let tx = cx + p.targetX * dpr + Math.cos(t) * (p.dist * dpr);
          let ty = cy + Math.sin(t * 0.8) * (p.dist * 0.6 * dpr);

          if (mouseActive) {
            const dx = tx - mx;
            const dy = ty - my;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 300) {
                tx += dx * 0.05; // Мягко убегают
                ty += dy * 0.05;
            }
          }
          
          // Пульсация
          const pulse = 1.0 + Math.sin(t * 3.0) * 0.1;
          
          ctx.beginPath();
          ctx.arc(tx, ty, p.size * pulse * dpr, 0, Math.PI * 2);
          ctx.fill();
      });

      gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform1f(uErosion, erosion);
      gl.uniform1f(uWarp, warp);
      
      const rgb = color.match(/[A-Za-z0-9]{2}/g).map(x => parseInt(x, 16) / 255);
      gl.uniform3fv(uTint, rgb);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);

  }, [text, fontSize, particleCount, erosion, smoothness, scatter, color, customFont, warp]);

  // UI Styles
  const styles = {
    container: { display: 'flex', height: '100vh', background: '#000', fontFamily: 'Inter, sans-serif', color: '#fff', cursor: 'crosshair' },
    sidebar: { width: '300px', padding: '30px', background: 'rgba(10,10,10,0.85)', borderRight: '1px solid #333', zIndex: 10, overflowY: 'auto', backdropFilter: 'blur(10px)' },
    control: { marginBottom: '20px' },
    label: { fontSize: '10px', textTransform: 'uppercase', color: '#888', fontWeight: 'bold', marginBottom: '8px', display: 'block', letterSpacing: '1px' },
    input: { width: '100%', background: '#151515', border: '1px solid #333', color: '#fff', padding: '10px', fontSize: '14px', borderRadius: '4px', outline: 'none' },
    range: { width: '100%', accentColor: '#fff', cursor: 'pointer' },
    btn: { width: '100%', padding: '15px', background: '#fff', color: '#000', fontWeight: '900', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', letterSpacing: '1px', textTransform: 'uppercase' },
    fileInput: { fontSize: '11px', color: '#888', width: '100%' }
  };

  return (
    <div style={styles.container} onMouseMove={handleMouseMove}>
      <div style={styles.sidebar}>
        <h1 style={{fontSize: '22px', fontWeight: '900', marginBottom: '5px', letterSpacing: '-1px'}}>ULTRA CHROME</h1>
        <p style={{fontSize: '10px', color: '#666', marginBottom: '30px'}}>v6.0 / DOMAIN WARPING</p>
        
        <div style={styles.control}>
            <label style={styles.label}>Text Specimen</label>
            <input style={styles.input} value={text} onChange={e => setText(e.target.value.toUpperCase())} maxLength={10} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Custom Font (.otf / .ttf)</label>
            <input type="file" onChange={handleFontUpload} style={styles.fileInput} accept=".otf,.ttf,.woff,.woff2" />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Warp (Искажение формы): {warp}</label>
            <input type="range" min="0" max="1.5" step="0.1" value={warp} onChange={e => setWarp(Number(e.target.value))} style={styles.range} />
            <p style={{fontSize: '9px', color: '#444', marginTop: '5px'}}>Делает капли "неидеальными"</p>
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Liquid Smooth: {smoothness}</label>
            <input type="range" min="5" max="40" value={smoothness} onChange={e => setSmoothness(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Erosion (Cutoff): {erosion}</label>
            <input type="range" min="0.1" max="0.8" step="0.01" value={erosion} onChange={e => setErosion(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Satellites: {particleCount}</label>
            <input type="range" min="0" max="100" value={particleCount} onChange={e => setParticleCount(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Chrome Tint</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{width: '100%', height: '40px', background: 'none', border: 'none'}} />
        </div>

        <button style={styles.btn} onClick={() => { 
            const link = document.createElement('a');
            link.download = 'ultra_chrome.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }}>
            Export HD Asset
        </button>
      </div>

      <div style={{flex: 1, background: '#000', position: 'relative'}}>
        <canvas ref={canvasRef} style={{width: '100%', height: '100%', display: 'block'}} />
      </div>
    </div>
  );
};

export default App;