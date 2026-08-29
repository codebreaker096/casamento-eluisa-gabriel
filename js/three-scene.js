/**
 * CENÁRIO 3D WEBGL COM THREE.JS
 * Efeito Exclusivo: Brilho Perolado Sutil & Poeira Dourada Delicada de Fundo
 * Quantidade suave para trazer vida e elegância ao fundo verde e ao convite.
 */

class Wedding3DScene {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 30;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.initLights();
    this.createSubtlePearlDust();
    this.bindEvents();
    this.animate();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFDF8EE, 1.4);
    sunLight.position.set(20, 40, 30);
    this.scene.add(sunLight);
  }

  createSubtlePearlDust() {
    // Quantidade suave e equilibrada (80 partículas sutis)
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
      scales[i] = Math.random() * 0.9 + 0.35;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Textura perolada suave com halo dourado translúcido
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.25, 'rgba(253, 246, 227, 0.8)');
    grad.addColorStop(0.55, 'rgba(212, 175, 55, 0.35)');
    grad.addColorStop(0.85, 'rgba(212, 175, 55, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      size: 1.25,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    this.pearlDust = new THREE.Points(geometry, material);
    this.scene.add(this.pearlDust);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 3;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 3;
    });

    // Suporte a Giroscópio para Smartphones
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.mouse.targetX = (e.gamma / 45) * 2;
          this.mouse.targetY = ((e.beta - 45) / 45) * 2;
        }
      });
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Movimento suave com o mouse / giroscópio
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.camera.position.x = this.mouse.x;
    this.camera.position.y = -this.mouse.y;
    this.camera.lookAt(0, 0, 0);

    // Flutuação lenta e sutil das partículas peroladas
    if (this.pearlDust) {
      this.pearlDust.rotation.y = elapsedTime * 0.015;
      this.pearlDust.rotation.x = Math.sin(elapsedTime * 0.012) * 0.06;
      
      const positions = this.pearlDust.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.018; // Descida bem calma e suave
        if (positions[i] < -35) {
          positions[i] = 35;
        }
      }
      this.pearlDust.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.wedding3D = new Wedding3DScene();
});
