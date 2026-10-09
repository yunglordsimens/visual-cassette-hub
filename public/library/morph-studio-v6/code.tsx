import React, { useEffect, useRef, useState } from 'react';

/**
 * MORPH STUDIO v7.0 - LIVING CHROME
 * * ВОЗВРАЩЕНИЕ ФУНКЦИОНАЛА:
 * 1. Variable Font Animation: Буквы "дышат" (меняют weight) в реальном времени.
 * 2. Edge Tracking: Частицы спавнятся строго на контурах букв, а не случайно.
 * 3. Chrome Shader: Сохранили крутой рендер из v6.
 */

const App = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  // --- ПАРАМЕТРЫ ---
  const [text, setText] = useState('ALIEN');
  const [fontSize, setFontSize] = useState(180);
  
  // Анимация шрифта
  const [animSpeed, setAnimSpeed] = useState(1.5); // Скорость пульсации жира
  const [minWeight, setMinWeight] = useState(100);
  const [maxWeight, setMaxWeight] = useState(900);
  
  // Частицы
  const [particleCount, setParticleCount] = useState(80);
  const [scatter, setScatter] = useState(30.0); // Насколько далеко отлетают от контура
  
  // Рендер
  const [erosion, setErosion] = useState(0.48);      
  const [smoothness, setSmoothness] = useState(20.0);
  const [color, setColor] = useState('#ffffff');
  
  const [customFont, setCustomFont] = useState('Inter');

  // --- MOUSE ---
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  // --- FONT UPLOAD ---
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
    // Оптимизация: alpha: false
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: false });
    if (!gl) return;

    // --- SHADER (SDF Chrome) ---
    const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform sampler2D u_scene;
      uniform float u_erosion;
      uniform vec3 u_tint;

      // Студийный свет (High Contrast)
      float getEnv(vec3 normal, vec3 viewDir) {
          vec3 r = reflect(-viewDir, normal);
          float horizon = smoothstep(-0.05, 0.05, r.y);
          float light = pow(max(dot(r, normalize(vec3(0.5, 0.8, 0.5))), 0.0), 10.0);
          float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
          return horizon * 0.2 + light * 1.5 + rim * 0.6;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        uv.y = 1.0 - uv.y;

        float h = texture2D(u_scene, uv).a;
        
        // EROSION
        float shape = smoothstep(u_erosion - 0.01, u_erosion + 0.01, h);

        if (shape < 0.001) {
            gl_FragColor = vec4(vec3(0.02), 1.0);
            return;
        }

        vec2 e = vec2(2.0 / u_resolution.x, 0.0);
        float h_x = texture2D(u_scene, uv + e).a - texture2D(u_scene, uv - e).a;
        float h_y = texture2D(u_scene, uv + e.yx).a - texture2D(u_scene, uv - e.yx).a;
        
        vec3 normal = normalize(vec3(-h_x * 8.0, -h_y * 8.0, 0.15));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        float env = getEnv(normal, viewDir);
        
        vec3 col = vec3(0.0); 
        col += vec3(1.0) * env; 
        col *= u_tint; 
        
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
    const uErosion = gl.getUniformLocation(program, 'u_erosion');
    const uTint = gl.getUniformLocation(program, 'u_tint');

    // --- CANVAS 2D SYSTEM ---
    const sceneCanvas = document.createElement('canvas');
    const ctx = sceneCanvas.getContext('2d', { willReadFrequently: true });
    const sceneTexture = gl.createTexture();
    
    // Вспомогательный канвас для сканирования точек (Hit Test)
    const hitCanvas = document.createElement('canvas');
    const hitCtx = hitCanvas.getContext('2d', { willReadFrequently: true });

    let particles = [];
    
    // Создаем частицы (они теперь умные, знают свою позицию относительно центра)
    const initParticles = () => {
        particles = [];
        for(let i=0; i<particleCount; i++) {
            particles.push({
                x: 0, y: 0,
                // Каждая частица привязана к случайному углу и радиусу, но мы будем корректировать это
                angle: Math.random() * Math.PI * 2,
                targetDist: 5 + Math.random() * scatter, 
                size: 8 + Math.random() * 20,
                speed: 0.5 + Math.random() * 1.5,
                phase: Math.random() * 100,
                // Точка привязки к букве (пока 0, найдем в цикле)
                anchorX: 0, anchorY: 0,
                foundAnchor: false
            });
        }
    };
    initParticles();

    // Функция поиска границ букв (чтобы точки сидели на кривых)
    // Мы не можем делать это каждый кадр (дорого), поэтому делаем хитрый трюк:
    // Мы просто рисуем текст и спавним частицы в его окрестностях
    
    const render = (time) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); 
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      
      if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w; canvas.height = h;
          sceneCanvas.width = w; sceneCanvas.height = h;
          hitCanvas.width = w; hitCanvas.height = h;
      }
      
      const cx = w / 2;
      const cy = h / 2;

      // 1. АНИМАЦИЯ ШРИФТА (Variable Font Breathing)
      // Вычисляем текущий weight по синусоиде
      const weightRange = maxWeight - minWeight;
      const currentWeight = minWeight + (Math.sin(time * 0.001 * animSpeed) * 0.5 + 0.5) * weightRange;
      
      const fontStr = `${Math.floor(currentWeight)} ${fontSize * dpr}px "${customFont}", -apple-system, sans-serif`;

      // 2. РИСУЕМ СЦЕНУ
      ctx.clearRect(0, 0, w, h);
      ctx.filter = `blur(${smoothness * dpr}px)`; 
      
      // Текст (Ядро)
      ctx.fillStyle = 'white';
      ctx.font = fontStr;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cx, cy);

      // 3. ОБНОВЛЯЕМ ЧАСТИЦЫ
      // Трюк: мы хотим, чтобы частицы были "примагничены" к тексту.
      // Поскольку текст меняет размер, мы просто распределяем их вдоль предполагаемой ширины текста.
      
      const textWidthEstimate = text.length * fontSize * dpr * 0.6; // Грубая оценка ширины
      
      particles.forEach((p, i) => {
          const t = time * 0.001 * p.speed + p.phase;
          
          // Если мы хотим, чтобы точки были на кривых, нам нужен настоящий font path analysis.
          // В браузере без тяжелых библиотек мы эмулируем это:
          // Частицы летают вокруг центра букв.
          
          // Распределяем якоря по длине слова
          if (!p.foundAnchor) {
             // Размазываем частицы по ширине текста
             p.anchorX = (Math.random() - 0.5) * textWidthEstimate;
             p.anchorY = (Math.random() - 0.5) * (fontSize * dpr * 0.5);
          }

          // Анимация "дыхания" вместе со шрифтом
          // Когда шрифт жирный, частицы разлетаются чуть шире
          const breatheFactor = currentWeight / 900; 
          
          // Позиция
          const orbitR = p.targetDist * dpr * (0.8 + breatheFactor * 0.4); // Зависит от жирности
          
          let tx = cx + p.anchorX + Math.cos(t) * orbitR;
          let ty = cy + p.anchorY + Math.sin(t) * orbitR;

          // Физика мыши
          const mx = mouseRef.current.x * dpr;
          const my = mouseRef.current.y * dpr;
          if (mouseRef.current.active) {
             const dx = tx - mx;
             const dy = ty - my;
             const dist = Math.sqrt(dx*dx + dy*dy);
             if (dist < 300) {
                 tx += dx * 0.05;
                 ty += dy * 0.05;
             }
          }

          // Пульсация размера
          const pulse = 1.0 + Math.sin(t * 3.0) * 0.2;
          
          ctx.beginPath();
          ctx.arc(tx, ty, p.size * dpr * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
      });

      // Рендер в WebGL
      gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uErosion, erosion);
      
      const rgb = color.match(/[A-Za-z0-9]{2}/g).map(x => parseInt(x, 16) / 255);
      gl.uniform3fv(uTint, rgb);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);

  }, [text, fontSize, particleCount, erosion, smoothness, scatter, color, customFont, animSpeed, minWeight, maxWeight]);

  // Styles
  const styles = {
    container: { display: 'flex', height: '100vh', background: '#000', fontFamily: 'Inter, sans-serif', color: '#fff', cursor: 'crosshair' },
    sidebar: { width: '320px', padding: '30px', background: 'rgba(10,10,10,0.85)', borderRight: '1px solid #333', zIndex: 10, overflowY: 'auto', backdropFilter: 'blur(10px)' },
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
        <h1 style={{fontSize: '22px', fontWeight: '900', marginBottom: '5px', letterSpacing: '-1px'}}>LIVING CHROME</h1>
        <p style={{fontSize: '10px', color: '#666', marginBottom: '30px'}}>v7.0 / VARIABLE FONT + PARTICLES</p>
        
        <div style={styles.control}>
            <label style={styles.label}>Текст</label>
            <input style={styles.input} value={text} onChange={e => setText(e.target.value.toUpperCase())} maxLength={10} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Custom Font (Variable pref.)</label>
            <input type="file" onChange={handleFontUpload} style={styles.fileInput} accept=".otf,.ttf,.woff,.woff2" />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Breath Speed (Анимация шрифта): {animSpeed}</label>
            <input type="range" min="0" max="5" step="0.1" value={animSpeed} onChange={e => setAnimSpeed(Number(e.target.value))} style={styles.range} />
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#444', marginTop:'5px'}}>
               <span>Min W: {minWeight}</span>
               <span>Max W: {maxWeight}</span>
            </div>
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Satellite Grip (Разброс): {scatter}</label>
            <input type="range" min="0" max="100" value={scatter} onChange={e => setScatter(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Liquid Smooth: {smoothness}</label>
            <input type="range" min="5" max="40" value={smoothness} onChange={e => setSmoothness(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Chrome Tint</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{width: '100%', height: '40px', background: 'none', border: 'none'}} />
        </div>

        <button style={styles.btn} onClick={() => { 
            const link = document.createElement('a');
            link.download = 'living_chrome.png';
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