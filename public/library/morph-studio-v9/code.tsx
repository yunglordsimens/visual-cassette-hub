import React, { useEffect, useRef, useState } from 'react';

/**
 * MORPH STUDIO v9.0 - FERROFLUID CHROME
 * * НОВАЯ КОНЦЕПЦИЯ:
 * Вместо мягких метаболов (капель) мы используем "Spiky Displacement".
 * Это создает эффект магнитной жидкости или инопланетной биомассы с шипами.
 * * * FEATURES:
 * 1. Spikes & Thorns: Острые выросты вместо круглых капель.
 * 2. Iridescent Chrome: Бензиновые/радужные переливы на металле.
 * 3. Fractal Noise: Сложная детализация поверхности.
 */

const App = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  // --- ПАРАМЕТРЫ ---
  const [text, setText] = useState('VENOM');
  const [fontSize, setFontSize] = useState(160);
  
  // Настройки шейдера
  const [spikeHeight, setSpikeHeight] = useState(0.5); // Высота шипов
  const [turbulence, setTurbulence] = useState(0.8);   // "Нервность" жидкости
  const [iridescence, setIridescence] = useState(0.6); // Сила бензиновых переливов
  const [liquidSpeed, setLiquidSpeed] = useState(0.5);
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
    // alpha: false для максимальной производительности
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: false });
    if (!gl) return;

    // --- VERTEX SHADER ---
    const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    
    // --- FRAGMENT SHADER (THE MAGIC) ---
    const fs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform sampler2D u_text; // Текстура с текстом
      
      uniform float u_spikes;
      uniform float u_turb;
      uniform float u_irid;
      uniform vec3 u_tint;

      // --- NOISE FUNCTIONS (FRACTAL) ---
      // Более сложный шум для создания "органических" деталей
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // FBM (Fractal Brownian Motion) - несколько слоев шума
      float fbm(vec2 uv) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
              value += amplitude * snoise(uv);
              uv *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      // --- CHROME & IRIDESCENCE ---
      vec3 bumpMap(vec2 uv) {
          // Читаем текст
          float t = texture2D(u_text, uv).a;
          
          // Создаем "Spikes" (Шипы)
          // Мы используем шум, чтобы вытягивать высоту букв в случайных местах
          float noiseVal = fbm(uv * 4.0 + u_time * 0.2);
          
          // Смешиваем текст с шумом. 
          // u_turb контролирует, насколько сильно искажается форма букв.
          float h = t + smoothstep(0.2, 0.8, t) * noiseVal * u_spikes;
          
          // Резкий срез (Threshold), чтобы края были острыми, а не мыльными
          h = smoothstep(0.4, 0.5, h); 
          
          return vec3(h);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        uv.y = 1.0 - uv.y;

        // Вычисляем нормали на основе нашей "шипастой" карты высот
        vec2 e = vec2(1.0/u_resolution.x, 0.0);
        float h = bumpMap(uv).x;
        float h_x = bumpMap(uv + e).x - bumpMap(uv - e).x;
        float h_y = bumpMap(uv + e.yx).x - bumpMap(uv - e.yx).x;
        
        // Если пиксель пустой - выход (оптимизация)
        if (h < 0.01) {
             gl_FragColor = vec4(vec3(0.02), 1.0);
             return;
        }

        vec3 normal = normalize(vec3(-h_x * 4.0, -h_y * 4.0, 0.1)); // 0.1 - крутизна склонов
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        
        // --- LIGHTING ---
        // 1. Basic Specular
        vec3 lightPos = normalize(vec3(0.5, 1.0, 1.0));
        float spec = pow(max(dot(normal, lightPos), 0.0), 30.0);
        
        // 2. Reflection (Chrome)
        vec3 r = reflect(-viewDir, normal);
        float ref = smoothstep(0.0, 0.1, r.y); // Горизонт
        
        // 3. IRIDESCENCE (Бензин)
        // Используем нормаль как координату для сдвига цвета
        vec3 iridColor = 0.5 + 0.5 * cos(u_time * 0.5 + normal.xyx * 3.0 + vec3(0,2,4));
        
        // COMPOSITING
        vec3 col = vec3(0.05); // Темная база
        col += vec3(1.0) * ref * 0.8; // Белое отражение
        
        // Смешиваем цвет тинта и бензина
        vec3 mixColor = mix(u_tint, iridColor, u_irid);
        
        // Fresnel эффект (цвет виден под углом)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
        col += mixColor * fresnel * 1.5;
        
        col += vec3(1.0) * spec * 1.2; // Яркие блики

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
    const uSpikes = gl.getUniformLocation(program, 'u_spikes');
    const uTurb = gl.getUniformLocation(program, 'u_turb');
    const uIrid = gl.getUniformLocation(program, 'u_irid');
    const uTint = gl.getUniformLocation(program, 'u_tint');

    // --- TEXTURE SETUP ---
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    const texture = gl.createTexture();

    const render = (time) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); 
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      
      if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w; canvas.height = h;
          textCanvas.width = w; textCanvas.height = h;
      }
      
      const cx = w / 2;
      const cy = h / 2;

      // Рисуем текст (ОСНОВА)
      // В отличие от прошлых версий, мы НЕ размываем его здесь.
      // Мы хотим четкую маску, которую шейдер превратит в жидкость.
      ctx.clearRect(0, 0, w, h);
      
      // Рисуем текст жирным и размытым - это база для "тела" жидкости
      // Градиент блюра поможет создать объем
      ctx.filter = `blur(${10 * dpr}px)`;
      ctx.fillStyle = 'white';
      ctx.font = `900 ${fontSize * dpr}px "${customFont}", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, cx, cy);
      
      // Сверху рисуем четкий текст, чтобы сохранить читаемость
      ctx.filter = `blur(${2 * dpr}px)`;
      ctx.fillText(text, cx, cy);

      // Взаимодействие с мышью (просто искажение отрисовки текста не делаем, 
      // лучше доверить это шейдеру, но для простоты оставим статику пока)

      // WebGL
      gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time * 0.001 * liquidSpeed);
      gl.uniform1f(uSpikes, spikeHeight);
      gl.uniform1f(uTurb, turbulence);
      gl.uniform1f(uIrid, iridescence);
      
      const rgb = color.match(/[A-Za-z0-9]{2}/g).map(x => parseInt(x, 16) / 255);
      gl.uniform3fv(uTint, rgb);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);

  }, [text, fontSize, spikeHeight, turbulence, iridescence, color, customFont, liquidSpeed]);

  // Styles
  const styles = {
    container: { display: 'flex', height: '100vh', background: '#000', fontFamily: 'Inter, sans-serif', color: '#fff' },
    sidebar: { width: '320px', padding: '30px', background: 'rgba(5,5,5,0.95)', borderRight: '1px solid #222', zIndex: 10, overflowY: 'auto' },
    control: { marginBottom: '25px' },
    label: { fontSize: '10px', textTransform: 'uppercase', color: '#888', fontWeight: 'bold', marginBottom: '8px', display: 'block', letterSpacing: '1px' },
    input: { width: '100%', background: '#151515', border: '1px solid #333', color: '#fff', padding: '10px', fontSize: '14px', borderRadius: '4px', outline: 'none' },
    range: { width: '100%', accentColor: '#fff', cursor: 'pointer' },
    btn: { width: '100%', padding: '15px', background: '#fff', color: '#000', fontWeight: '900', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', letterSpacing: '1px', textTransform: 'uppercase' },
    fileInput: { fontSize: '11px', color: '#888', width: '100%' }
  };

  return (
    <div style={styles.container} onMouseMove={handleMouseMove}>
      <div style={styles.sidebar}>
        <h1 style={{fontSize: '22px', fontWeight: '900', marginBottom: '5px', letterSpacing: '-1px'}}>FERROFLUID</h1>
        <p style={{fontSize: '10px', color: '#666', marginBottom: '30px'}}>v9.0 / SPIKY CHROME</p>
        
        <div style={styles.control}>
            <label style={styles.label}>Текст</label>
            <input style={styles.input} value={text} onChange={e => setText(e.target.value.toUpperCase())} maxLength={10} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Custom Font</label>
            <input type="file" onChange={handleFontUpload} style={styles.fileInput} accept=".otf,.ttf,.woff,.woff2" />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Spikes (Острота): {spikeHeight}</label>
            <input type="range" min="0" max="2.0" step="0.1" value={spikeHeight} onChange={e => setSpikeHeight(Number(e.target.value))} style={styles.range} />
            <p style={{fontSize: '9px', color: '#444', marginTop:'5px'}}>Вытягивает острые иглы из текста</p>
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Turbulence (Искажение): {turbulence}</label>
            <input type="range" min="0" max="2.0" step="0.1" value={turbulence} onChange={e => setTurbulence(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Iridescence (Бензин): {iridescence}</label>
            <input type="range" min="0" max="1.0" step="0.05" value={iridescence} onChange={e => setIridescence(Number(e.target.value))} style={styles.range} />
        </div>
        
        <div style={styles.control}>
            <label style={styles.label}>Liquid Speed</label>
            <input type="range" min="0" max="2.0" step="0.1" value={liquidSpeed} onChange={e => setLiquidSpeed(Number(e.target.value))} style={styles.range} />
        </div>

        <div style={styles.control}>
            <label style={styles.label}>Base Tint</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{width: '100%', height: '40px', background: 'none', border: 'none'}} />
        </div>

        <button style={styles.btn} onClick={() => { 
            const link = document.createElement('a');
            link.download = 'ferrofluid_chrome.png';
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