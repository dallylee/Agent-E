import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

async function loadShader(url) {
  const res = await fetch(url);
  return res.text();
}

export class WebglScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.clock = new THREE.Clock();
    this.stars = [];
    this.dimmed = false;
  }

  async init() {
    await this.createNebula();
    this.createStars();
    this.createGalaxy();
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  async createNebula() {
    const [vert, frag] = await Promise.all([
      loadShader('./shaders/nebula.vert'),
      loadShader('./shaders/nebula.frag')
    ]);
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.uniforms = { uTime: { value: 0 } };
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  createStars() {
    const layers = [ { count: 600, speed: 0.0006 }, { count: 400, speed: 0.0012 } ];
    layers.forEach(layer => {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const sizes = [];
      for (let i = 0; i < layer.count; i++) {
        positions.push((Math.random() - 0.5) * 2);
        positions.push((Math.random() - 0.5) * 2);
        positions.push(-0.1 - Math.random() * 0.2);
        sizes.push(0.8 + Math.random() * 1.2);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.006, sizeAttenuation: true, transparent: true, opacity: 0.7 });
      const points = new THREE.Points(geometry, material);
      points.userData.speed = layer.speed;
      this.scene.add(points);
      this.stars.push(points);
    });
  }

  createGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();
    const count = 260;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.1 + Math.random() * 0.2;
      const spiral = radius * (0.5 + 0.5 * Math.sin(angle * 3));
      positions.push(Math.cos(angle) * spiral * 0.7);
      positions.push(Math.sin(angle) * spiral * 0.35 + 0.2);
      positions.push(-0.05);
      color.setHSL(0.75 + Math.random() * 0.1, 0.6, 0.7);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.01, vertexColors: true, transparent: true, opacity: 0.6 });
    this.galaxy = new THREE.Points(geometry, material);
    this.scene.add(this.galaxy);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    if (this.uniforms) this.uniforms.uTime.value = elapsed;
    this.stars.forEach(s => {
      const pos = s.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) + s.userData.speed;
        pos.setY(i, y > 1 ? -1 : y);
      }
      pos.needsUpdate = true;
    });
    if (this.galaxy) {
      this.galaxy.rotation.z = elapsed * 0.02;
    }
    this.renderer.render(this.scene, this.camera);
  }

  setDimmed(dim) {
    this.dimmed = dim;
    this.renderer.toneMappingExposure = dim ? 0.75 : 1;
  }
}
