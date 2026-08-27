import { CassetteType } from '../types';

export interface StarterTemplate {
  id: string;
  name: string;
  type: CassetteType;
  description: string;
  defaultCode: string;
  defaultTags: string[];
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'template-p5-generative',
    name: 'p5.js Generative Particles',
    type: 'p5',
    description: 'Particle system with Perlin noise motion and mouse interaction',
    defaultTags: ['p5js', 'generative', 'particles'],
    defaultCode: `// p5.js Sketch
let particles = [];
const NUM_PARTICLES = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(220, 20, 10);
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(3, 8),
      hue: random(160, 280)
    });
  }
}

function draw() {
  background(220, 20, 8, 0.15); // soft trail effect
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Add noise-based movement
    let angle = noise(p.x * 0.005, p.y * 0.005, frameCount * 0.005) * TWO_PI * 2;
    p.vx += cos(angle) * 0.2;
    p.vy += sin(angle) * 0.2;
    
    // Mouse attraction
    if (mouseIsPressed) {
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d < 300) {
        p.vx += (mouseX - p.x) * 0.002;
        p.vy += (mouseY - p.y) * 0.002;
      }
    }
    
    // Speed limit
    p.vx = constrain(p.vx, -3, 3);
    p.vy = constrain(p.vy, -3, 3);
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Screen wrap
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle
    noStroke();
    fill((p.hue + frameCount * 0.2) % 360, 85, 95, 0.9);
    circle(p.x, p.y, p.size);
    
    // Connect nearby particles with glowing lines
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let d = dist(p.x, p.y, p2.x, p2.y);
      if (d < 65) {
        stroke((p.hue + frameCount * 0.1) % 360, 80, 90, map(d, 0, 65, 0.6, 0));
        strokeWeight(1);
        line(p.x, p.y, p2.x, p2.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
`
  },
  {
    id: 'template-three-geometry',
    name: 'Three.js 3D Refractive Crystal',
    type: 'three',
    description: '3D animated wireframe geometry with glowing lights and orbit camera',
    defaultTags: ['threejs', '3d', 'geometry', 'neon'],
    defaultCode: `// Three.js Scene Setup
const container = document.getElementById('canvas-container') || document.body;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0c10, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// Lighting
const ambientLight = new THREE.AmbientLight(0x222244, 1.5);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0x7c5cff, 4, 20);
light1.position.set(4, 3, 2);
scene.add(light1);

const light2 = new THREE.PointLight(0x00f2ad, 4, 20);
light2.position.set(-4, -3, 2);
scene.add(light2);

// Main 3D Object: Torus Knot + Icosahedron
const group = new THREE.Group();

const geomKnot = new THREE.TorusKnotGeometry(1.5, 0.35, 128, 32, 2, 3);
const matKnot = new THREE.MeshStandardMaterial({
  color: 0x111625,
  metalness: 0.85,
  roughness: 0.2,
  wireframe: false
});
const meshKnot = new THREE.Mesh(geomKnot, matKnot);
group.add(meshKnot);

// Outer Wireframe Halo
const geomWire = new THREE.IcosahedronGeometry(2.6, 2);
const matWire = new THREE.MeshBasicMaterial({
  color: 0x7c5cff,
  wireframe: true,
  transparent: true,
  opacity: 0.35
});
const meshWire = new THREE.Mesh(geomWire, matWire);
group.add(meshWire);

scene.add(group);

// Background Particle Stars
const starCount = 600;
const starGeom = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {
  starPositions[i] = (Math.random() - 0.5) * 30;
  starPositions[i + 1] = (Math.random() - 0.5) * 30;
  starPositions[i + 2] = (Math.random() - 0.5) * 30;
}
starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0x64748b, size: 0.08 });
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

// Animation Loop
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  
  const elapsed = clock.getElapsedTime();
  meshKnot.rotation.x = elapsed * 0.4;
  meshKnot.rotation.y = elapsed * 0.6;
  meshWire.rotation.x = -elapsed * 0.2;
  meshWire.rotation.y = -elapsed * 0.3;
  
  light1.position.x = Math.sin(elapsed * 1.5) * 5;
  light1.position.y = Math.cos(elapsed * 1.5) * 5;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
`
  },
  {
    id: 'template-canvas-shader',
    name: 'Canvas 2D Cyber Wave',
    type: 'canvas',
    description: 'High-performance Canvas 2D pulsating wave synthesizer',
    defaultTags: ['canvas', 'waves', 'cyberpunk', 'interactive'],
    defaultCode: `<canvas id="art-canvas"></canvas>
<script>
  const canvas = document.getElementById('art-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: width / 2, y: height / 2 };
  window.addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let t = 0;
  function render() {
    t += 0.02;
    
    // Background with soft alpha for motion blur
    ctx.fillStyle = 'rgba(10, 12, 16, 0.2)';
    ctx.fillRect(0, 0, width, height);

    const lines = 32;
    const step = height / (lines + 2);

    for (let i = 1; i <= lines; i++) {
      const yBase = i * step;
      const progress = i / lines;
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      
      // Dynamic neon gradient
      const hue = (progress * 180 + t * 40) % 360;
      ctx.strokeStyle = 'hsl(' + hue + ', 85%, 65%)';
      ctx.shadowColor = 'hsl(' + hue + ', 90%, 55%)';
      ctx.shadowBlur = 10;

      for (let x = 0; x <= width; x += 12) {
        const dx = x - mouse.x;
        const dy = yBase - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseEffect = Math.max(0, 1 - dist / 250) * 80;

        const wave = Math.sin(x * 0.008 + t * 1.5 + progress * Math.PI) * 35;
        const subWave = Math.cos(x * 0.02 - t) * 15;
        const y = yBase + wave + subWave - mouseEffect;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    requestAnimationFrame(render);
  }
  render();
</script>
`
  },
  {
    id: 'template-react-microapp',
    name: 'React Generative Mandala',
    type: 'react',
    description: 'Interactive React-driven SVG geometric mandala generator with controls',
    defaultTags: ['react', 'svg', 'generative', 'interactive'],
    defaultCode: `function App() {
  const [petals, setPetals] = useState(16);
  const [layers, setLayers] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [hueBase, setHueBase] = useState(260);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animId;
    const loop = () => {
      setTime(t => t + 0.015 * speed);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div className="w-full h-full bg-[#0a0c10] text-slate-200 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background SVG Mandala */}
      <svg className="w-[85vw] h-[85vh] max-w-[600px] max-h-[600px]" viewBox="-300 -300 600 600">
        <defs>
          <radialGradient id="mandala-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={\`hsl(\${hueBase}, 90%, 65%)\`} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <circle cx="0" cy="0" r="280" fill="url(#mandala-glow)" />

        {Array.from({ length: layers }).map((_, l) => {
          const radius = (l + 1) * (260 / layers);
          const layerRot = (time * (l % 2 === 0 ? 25 : -25) * (1 + l * 0.2)) % 360;
          const currentHue = (hueBase + l * 35 + Math.sin(time) * 30) % 360;

          return (
            <g key={l} transform={\`rotate(\${layerRot})\`}>
              {Array.from({ length: petals }).map((_, p) => {
                const angle = (p * 360) / petals;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const scale = 0.5 + Math.sin(time * 2 + l + p) * 0.3;

                return (
                  <g key={p} transform={\`translate(\${x}, \${y}) rotate(\${angle + time * 40}) scale(\${scale})\`}>
                    <polygon
                      points="0,-18 12,0 0,18 -12,0"
                      fill="none"
                      stroke={\`hsl(\${currentHue}, 85%, 65%)\`}
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                    <circle cx="0" cy="0" r="3" fill={\`hsl(\${(currentHue + 60) % 360}, 95%, 70%)\`} />
                  </g>
                );
              })}
              <circle
                cx="0"
                cy="0"
                r={radius}
                fill="none"
                stroke={\`hsl(\${currentHue}, 70%, 50%)\`}
                strokeWidth="0.8"
                strokeDasharray="4 8"
                opacity="0.5"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Minimal HUD Controls */}
      <div className="absolute bottom-6 left-6 right-6 max-w-md mx-auto bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl flex items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Petals: </span>
          <span className="text-violet-400 font-bold">{petals}</span>
          <input
            type="range"
            min="6"
            max="32"
            value={petals}
            onChange={e => setPetals(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer mt-1"
          />
        </div>
        <div>
          <span className="text-slate-400">Layers: </span>
          <span className="text-emerald-400 font-bold">{layers}</span>
          <input
            type="range"
            min="2"
            max="10"
            value={layers}
            onChange={e => setLayers(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer mt-1"
          />
        </div>
        <button
          onClick={() => setHueBase(h => (h + 45) % 360)}
          className="px-3 py-2 bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/40 rounded-lg transition-colors"
        >
          Shift Hue
        </button>
      </div>
    </div>
  );
}
`
  }
];
