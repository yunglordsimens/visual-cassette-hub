import { Cassette } from '../types';

export const BUILTIN_CASSETTES: Cassette[] = [
  {
    manifest: {
      id: 'quantum-flowfield',
      title: 'Quantum Perlin Flowfield',
      tags: ['p5js', 'generative', 'perlin-noise', 'particles', 'interactive'],
      type: 'p5',
      description: 'Dynamic vector flowfield generated with multi-octave 3D Perlin noise and particle trails that react to mouse drag.',
      created: '2026-02-15',
      author: 'ArtStudio'
    },
    code: `// Quantum Flowfield p5.js Sketch
let particles = [];
let numParticles = 600;
let noiseScale = 0.007;
let speed = 2.2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(225, 25, 8);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Semi-transparent overlay creates long fluid light trails
  background(225, 25, 8, 0.06);

  let zOff = frameCount * 0.003;
  
  for (let p of particles) {
    let n = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, zOff);
    let angle = n * TWO_PI * 4;
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.6);
    
    // Mouse interaction
    if (mouseIsPressed) {
      let mouseV = createVector(mouseX, mouseY);
      let dir = p5.Vector.sub(p.pos, mouseV);
      let d = dir.mag();
      if (d < 220 && d > 1) {
        dir.normalize();
        dir.mult(map(d, 0, 220, 4, 0));
        p.applyForce(dir);
      }
    }
    
    p.applyForce(force);
    p.update();
    p.show();
    p.edges();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = speed + random(-0.5, 1.2);
    this.hue = random(170, 310);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.prevPos = this.pos.copy();
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  show() {
    let currentHue = (this.hue + frameCount * 0.15) % 360;
    stroke(currentHue, 85, 95, 0.65);
    strokeWeight(1.2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  }
  
  edges() {
    if (this.pos.x < 0) { this.pos.x = width; this.prevPos = this.pos.copy(); }
    if (this.pos.x > width) { this.pos.x = 0; this.prevPos = this.pos.copy(); }
    if (this.pos.y < 0) { this.pos.y = height; this.prevPos = this.pos.copy(); }
    if (this.pos.y > height) { this.pos.y = 0; this.prevPos = this.pos.copy(); }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(225, 25, 8);
}
`
  },
  {
    manifest: {
      id: 'hypercube-prism',
      title: 'Hypercube 3D Crystal Prism',
      tags: ['threejs', '3d', 'geometry', 'neon', 'interactive'],
      type: 'three',
      description: 'Luminous 3D geometric crystal structure with dynamic colored point lights, orbit controls, and starfield.',
      created: '2026-02-18',
      author: 'ArtStudio'
    },
    code: `const container = document.getElementById('canvas-container') || document.body;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0c10, 0.04);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.6;

// Lights
const ambientLight = new THREE.AmbientLight(0x1a1a2e, 1.5);
scene.add(ambientLight);

const lightPink = new THREE.PointLight(0xff3b81, 4, 25);
lightPink.position.set(5, 4, 3);
scene.add(lightPink);

const lightCyan = new THREE.PointLight(0x00f2ad, 4, 25);
lightCyan.position.set(-5, -4, 3);
scene.add(lightCyan);

const lightViolet = new THREE.PointLight(0x7c5cff, 3, 20);
lightViolet.position.set(0, 6, -3);
scene.add(lightViolet);

// Complex nested geometric core
const coreGroup = new THREE.Group();

// Central Torus Knot
const knotGeom = new THREE.TorusKnotGeometry(1.2, 0.28, 128, 32, 3, 4);
const knotMat = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  metalness: 0.9,
  roughness: 0.15,
  wireframe: false
});
const knotMesh = new THREE.Mesh(knotGeom, knotMat);
coreGroup.add(knotMesh);

// Outer Floating Polyhedron
const icosaGeom = new THREE.IcosahedronGeometry(2.4, 1);
const icosaMat = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const icosaMesh = new THREE.Mesh(icosaGeom, icosaMat);
coreGroup.add(icosaMesh);

// Dodecahedron Shell
const dodecaGeom = new THREE.DodecahedronGeometry(3.2, 0);
const dodecaMat = new THREE.MeshBasicMaterial({
  color: 0x00f2ad,
  wireframe: true,
  transparent: true,
  opacity: 0.25
});
const dodecaMesh = new THREE.Mesh(dodecaGeom, dodecaMat);
coreGroup.add(dodecaMesh);

scene.add(coreGroup);

// Background Particle Starfield
const starCount = 800;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
  starPositions[i] = (Math.random() - 0.5) * 35;
  starPositions[i + 1] = (Math.random() - 0.5) * 35;
  starPositions[i + 2] = (Math.random() - 0.5) * 35;
}
const starGeom = new THREE.BufferGeometry();
starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.08 });
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

// Animation
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  
  knotMesh.rotation.x = t * 0.35;
  knotMesh.rotation.y = t * 0.5;
  
  icosaMesh.rotation.x = -t * 0.2;
  icosaMesh.rotation.z = t * 0.25;
  
  dodecaMesh.rotation.y = t * 0.15;
  dodecaMesh.rotation.x = t * 0.1;
  
  lightPink.position.x = Math.sin(t * 1.2) * 5;
  lightPink.position.z = Math.cos(t * 1.2) * 5;
  
  lightCyan.position.x = Math.cos(t * 1.4) * -5;
  lightCyan.position.z = Math.sin(t * 1.4) * 5;

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
    manifest: {
      id: 'cyber-audio-spectrum',
      title: 'Neon Audio Spectrum Waveform',
      tags: ['canvas', 'audio-reactive', 'neon', 'cyberpunk', 'sound'],
      type: 'canvas',
      description: 'Synthesized audio frequency visualizer with 64 pulsating neon radial & horizontal spectrum bars with phosphorescent glow.',
      created: '2026-02-20',
      author: 'ArtStudio'
    },
    code: `<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let t = 0;
const BARS = 72;

function draw() {
  t += 0.03;
  
  ctx.fillStyle = 'rgba(10, 12, 16, 0.25)';
  ctx.fillRect(0, 0, w, h);
  
  const cx = w / 2;
  const cy = h / 2;
  const baseRadius = Math.min(w, h) * 0.22;
  
  // Outer Ring Waves
  for (let i = 0; i < BARS; i++) {
    const angle = (i / BARS) * Math.PI * 2 + t * 0.2;
    
    // Synthesized procedural frequency data
    const freq1 = Math.sin(i * 0.35 + t * 3.5) * 0.5 + 0.5;
    const freq2 = Math.cos(i * 0.15 - t * 2.0) * 0.5 + 0.5;
    const freq3 = Math.sin(i * 0.8 + t * 5.0) * 0.5 + 0.5;
    const intensity = (freq1 * 0.5 + freq2 * 0.3 + freq3 * 0.2);
    
    const barHeight = intensity * Math.min(w, h) * 0.25 + 8;
    
    const x1 = cx + Math.cos(angle) * baseRadius;
    const y1 = cy + Math.sin(angle) * baseRadius;
    const x2 = cx + Math.cos(angle) * (baseRadius + barHeight);
    const y2 = cy + Math.sin(angle) * (baseRadius + barHeight);
    
    const hue = (i * (360 / BARS) + t * 40) % 360;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = \`hsl(\${hue}, 90%, 65%)\`;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.shadowColor = \`hsl(\${hue}, 95%, 55%)\`;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  
  // Center Pulsing Core
  ctx.beginPath();
  const corePulse = baseRadius * 0.65 + Math.sin(t * 4) * 12;
  ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse);
  grad.addColorStop(0, 'rgba(124, 92, 255, 0.4)');
  grad.addColorStop(0.7, 'rgba(0, 242, 173, 0.2)');
  grad.addColorStop(1, 'rgba(10, 12, 16, 0.9)');
  ctx.fillStyle = grad;
  ctx.fill();
  
  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}
draw();
</script>
`
  },
  {
    manifest: {
      id: 'sacred-geometry-mandala',
      title: 'Sacred Kaleidoscopic Mandala',
      tags: ['p5js', 'mandala', 'sacred-geometry', 'meditative', 'kaleidoscope'],
      type: 'p5',
      description: 'Harmonic geometric kaleidoscope with 12-fold symmetry, shifting chromatic resonance, and interactive rotation.',
      created: '2026-02-22',
      author: 'ArtStudio'
    },
    code: `// Sacred Geometry Mandala in p5.js
let symmetry = 12;
let angleStep;
let rotAngle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 1);
  background(240, 25, 8);
  angleStep = 360 / symmetry;
}

function draw() {
  background(240, 25, 8, 0.08);
  
  translate(width / 2, height / 2);
  rotAngle += 0.25;
  
  let maxR = min(width, height) * 0.42;
  let rings = 7;
  
  for (let r = 1; r <= rings; r++) {
    let radius = (r / rings) * maxR;
    let dir = (r % 2 === 0 ? 1 : -1);
    let speed = dir * (rotAngle * (0.4 + r * 0.15));
    
    push();
    rotate(speed);
    
    for (let i = 0; i < symmetry; i++) {
      rotate(angleStep);
      
      let hue = (r * 40 + frameCount * 0.3) % 360;
      stroke(hue, 85, 95, 0.75);
      strokeWeight(1.4);
      noFill();
      
      // Geometric petals
      beginShape();
      vertex(0, 0);
      let cp1x = radius * 0.5 * cos(15);
      let cp1y = radius * 0.5 * sin(15);
      bezierVertex(cp1x, cp1y, radius * 0.8, -radius * 0.2, radius, 0);
      endShape();
      
      fill(hue, 70, 90, 0.3);
      circle(radius, 0, 4 + r * 1.2);
    }
    
    // Sacred perimeter rings
    noFill();
    stroke((r * 45 + frameCount * 0.2) % 360, 60, 80, 0.4);
    strokeWeight(0.8);
    ellipse(0, 0, radius * 2, radius * 2);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(240, 25, 8);
}
`
  },
  {
    manifest: {
      id: 'matrix-digital-rain',
      title: 'Matrix Neural Glyph Stream',
      tags: ['canvas', 'cyberpunk', 'matrix', 'terminal', 'retro'],
      type: 'canvas',
      description: 'Phosphor green and cyan cascading digital rain with Japanese katakana, mathematical runes, and variable stream speeds.',
      created: '2026-02-23',
      author: 'ArtStudio'
    },
    code: `<canvas id="matrix-canvas"></canvas>
<script>
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let w, h;
const fontSize = 16;
let columns;
let drops = [];

// Matrix katakana & cypher alphabet
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFΔΩΨ∑π√';

function init() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  columns = Math.floor(w / fontSize);
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -100);
  }
}
window.addEventListener('resize', init);
init();

function draw() {
  // Translucent background creates phosphor trail persistence
  ctx.fillStyle = 'rgba(8, 10, 14, 0.08)';
  ctx.fillRect(0, 0, w, h);
  
  ctx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const char = chars.charAt(Math.floor(Math.random() * chars.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    
    // Head glyph is blazing bright white-cyan
    ctx.fillStyle = '#f0fdf4';
    ctx.shadowColor = '#00f2ad';
    ctx.shadowBlur = 8;
    ctx.fillText(char, x, y);
    
    // Trailing body glyphs are deep neon green/mint
    ctx.fillStyle = '#00f2ad';
    ctx.shadowBlur = 3;
    const prevChar = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(prevChar, x, y - fontSize);
    
    if (y > h && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  
  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}
draw();
</script>
`
  },
  {
    manifest: {
      id: 'fluid-metaballs-shader',
      title: 'Chromatic Lava Metaballs',
      tags: ['canvas', 'shader', 'metaballs', 'liquid', 'organic'],
      type: 'canvas',
      description: 'Organic liquid metaballs that magnetically fuse, distort, and split with rich chromatic aberration and fluid physics.',
      created: '2026-02-24',
      author: 'ArtStudio'
    },
    code: `<canvas id="metaball-canvas"></canvas>
<script>
const canvas = document.getElementById('metaball-canvas');
const ctx = canvas.getContext('2d');

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const BALLS_COUNT = 9;
const balls = [];

for (let i = 0; i < BALLS_COUNT; i++) {
  balls.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 3.5,
    vy: (Math.random() - 0.5) * 3.5,
    radius: Math.random() * 80 + 70,
    hue: Math.random() * 360
  });
}

let t = 0;
function draw() {
  t += 0.02;
  
  // Clear canvas
  ctx.fillStyle = '#090b10';
  ctx.fillRect(0, 0, w, h);
  
  // Update positions
  for (let b of balls) {
    b.x += b.vx;
    b.y += b.vy;
    
    if (b.x - b.radius < 0 || b.x + b.radius > w) b.vx *= -1;
    if (b.y - b.radius < 0 || b.y + b.radius > h) b.vy *= -1;
  }
  
  // Draw glow metaball layers with blend mode
  ctx.globalCompositeOperation = 'screen';
  
  for (let b of balls) {
    const currentRadius = b.radius + Math.sin(t * 3 + b.hue) * 15;
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentRadius * 1.8);
    
    const hue = (b.hue + t * 25) % 360;
    grad.addColorStop(0, \`hsla(\${hue}, 95%, 60%, 0.85)\`);
    grad.addColorStop(0.4, \`hsla(\${(hue + 40) % 360}, 90%, 50%, 0.4)\`);
    grad.addColorStop(0.8, \`hsla(\${(hue + 80) % 360}, 80%, 40%, 0.1)\`);
    grad.addColorStop(1, 'rgba(9, 11, 16, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, currentRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(draw);
}
draw();
</script>
`
  },
  {
    manifest: {
      id: 'celestial-gravity-particles',
      title: 'Celestial Multi-Attractor Gravity',
      tags: ['p5js', 'physics', 'astronomy', 'gravity', 'simulation'],
      type: 'p5',
      description: 'N-body gravitational simulation with 4 rotating celestial attractor masses pulling orbiting solar dust particles.',
      created: '2026-02-24',
      author: 'ArtStudio'
    },
    code: `// Celestial Gravity in p5.js
let attractors = [];
let particles = [];
const NUM_PARTICLES = 320;
const G = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(220, 30, 6);
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(random(-1, 1), random(-1, 1)),
      hue: random(20, 280),
      mass: random(0.8, 2.5)
    });
  }
}

function draw() {
  background(220, 30, 6, 0.12);
  
  // Calculate dynamic moving attractors
  let cx = width / 2;
  let cy = height / 2;
  let t = frameCount * 0.015;
  let r = min(width, height) * 0.25;
  
  attractors = [
    { pos: createVector(cx + cos(t) * r, cy + sin(t) * r), mass: 22, hue: 340 },
    { pos: createVector(cx + cos(t + PI) * r, cy + sin(t + PI) * r), mass: 22, hue: 180 },
    { pos: createVector(cx + cos(-t * 1.5) * (r * 0.5), cy + sin(-t * 1.5) * (r * 0.5)), mass: 35, hue: 45 }
  ];
  
  if (mouseIsPressed) {
    attractors.push({ pos: createVector(mouseX, mouseY), mass: 45, hue: 280 });
  }
  
  // Render Attractors
  for (let att of attractors) {
    noStroke();
    fill(att.hue, 85, 100, 0.9);
    circle(att.pos.x, att.pos.y, att.mass * 0.8);
    fill(att.hue, 90, 100, 0.2);
    circle(att.pos.x, att.pos.y, att.mass * 2.2);
  }
  
  // Update particles
  for (let p of particles) {
    let netForce = createVector(0, 0);
    
    for (let att of attractors) {
      let force = p5.Vector.sub(att.pos, p.pos);
      let distSq = constrain(force.magSq(), 100, 10000);
      let strength = (G * att.mass * p.mass) / distSq;
      force.setMag(strength * 0.05);
      netForce.add(force);
    }
    
    p.vel.add(netForce);
    p.vel.limit(5);
    let prev = p.pos.copy();
    p.pos.add(p.vel);
    
    // Render particle trail
    stroke(p.hue, 80, 95, 0.7);
    strokeWeight(map(p.vel.mag(), 0, 5, 1, 2.5));
    line(p.pos.x, p.pos.y, prev.x, prev.y);
    
    // Bounds wrap
    if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.x > width) p.pos.x = 0;
    if (p.pos.y < 0) p.pos.y = height;
    if (p.pos.y > height) p.pos.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(220, 30, 6);
}
`
  },
  {
    manifest: {
      id: 'neon-tunnel-three',
      title: 'Hyperdrive Cyber Warp Tunnel',
      tags: ['threejs', '3d', 'tunnel', 'cyberpunk', 'synthwave'],
      type: 'three',
      description: 'Infinite neon wireframe highway warp tunnel with pulsating speed and luminous synthwave perspective.',
      created: '2026-02-24',
      author: 'ArtStudio'
    },
    code: `const container = document.getElementById('canvas-container') || document.body;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0c10, 10, 75);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Construct Tunnel Rings
const RINGS = 60;
const ringsArray = [];
const ringGeom = new THREE.TorusGeometry(3.5, 0.04, 16, 8); // Octagon tunnel

for (let i = 0; i < RINGS; i++) {
  const hue = (i / RINGS);
  const color = new THREE.Color().setHSL(hue * 0.6 + 0.6, 0.9, 0.6);
  const ringMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
  const mesh = new THREE.Mesh(ringGeom, ringMat);
  mesh.position.z = -i * 1.5;
  mesh.rotation.z = i * 0.08;
  scene.add(mesh);
  ringsArray.push(mesh);
}

// Center Speed Lines
const lineCount = 120;
const linePositions = new Float32Array(lineCount * 6);
for (let i = 0; i < lineCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 3.2 + 0.5;
  const z = -Math.random() * 80;
  
  linePositions[i * 6] = Math.cos(angle) * radius;
  linePositions[i * 6 + 1] = Math.sin(angle) * radius;
  linePositions[i * 6 + 2] = z;
  
  linePositions[i * 6 + 3] = Math.cos(angle) * radius;
  linePositions[i * 6 + 4] = Math.sin(angle) * radius;
  linePositions[i * 6 + 5] = z - 2.5;
}
const lineGeom = new THREE.BufferGeometry();
lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2ad, transparent: true, opacity: 0.7 });
const speedLines = new THREE.LineSegments(lineGeom, lineMat);
scene.add(speedLines);

// Animation Loop
let speed = 0.45;
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  
  // Shift rings towards camera
  for (let ring of ringsArray) {
    ring.position.z += speed;
    ring.rotation.z += 0.008;
    if (ring.position.z > 2) {
      ring.position.z = - (RINGS - 1) * 1.5;
    }
  }
  
  // Camera wobble
  const t = clock.getElapsedTime();
  camera.position.x = Math.sin(t * 1.5) * 0.35;
  camera.position.y = Math.cos(t * 1.2) * 0.35;
  camera.rotation.z = Math.sin(t * 0.8) * 0.1;
  
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
`
  }
];
