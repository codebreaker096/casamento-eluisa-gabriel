/**
 * CENÁRIO 3D WEBGL COM THREE.JS
 * Efeitos: Folhas de Oliveira 3D Flutuantes & Partículas de Poeira Dourada
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
    this.leaves = [];
    this.clock = new THREE.Clock();

    this.initLights();
    this.createGoldDustParticles();
    this.createOliveLeaves();
    this.bindEvents();
    this.animate();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.2);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    sunLight.position.set(20, 40, 30);
    this.scene.add(sunLight);

    const pointLight = new THREE.PointLight(0x627556, 1.5, 50);
    pointLight.position.set(-15, -10, 15);
    this.scene.add(pointLight);
  }

  createGoldDustParticles() {
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Canvas de partícula cintilante
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 235, 160, 1)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    grad.addColorStop(0.8, 'rgba(180, 140, 40, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.goldDust = new THREE.Points(geometry, material);
    this.scene.add(this.goldDust);
  }

  createOliveLeaves() {
    // Geometria de Folha de Oliveira realista
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -1.8);
    leafShape.bezierCurveTo(0.6, -1.0, 0.8, 0.8, 0, 2.2);
    leafShape.bezierCurveTo(-0.8, 0.8, -0.6, -1.0, 0, -1.8);

    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    geometry.center();

    // Materiais verde oliva e verde oliva sálvia
    const oliveMaterial = new THREE.MeshStandardMaterial({
      color: 0x4D5D43,
      roughness: 0.4,
      metalness: 0.2,
      side: THREE.DoubleSide
    });

    const sageMaterial = new THREE.MeshStandardMaterial({
      color: 0x627556,
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide
    });

    const leafCount = 28;
    for (let i = 0; i < leafCount; i++) {
      const mesh = new THREE.Mesh(geometry, Math.random() > 0.5 ? oliveMaterial : sageMaterial);
      
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 20
      );

      const scale = Math.random() * 0.6 + 0.5;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        speedY: (Math.random() * 0.03 + 0.01) * -1,
        speedRotX: (Math.random() - 0.5) * 0.02,
        speedRotY: (Math.random() - 0.5) * 0.02,
        speedRotZ: (Math.random() - 0.5) * 0.02,
        windFactor: Math.random() * 0.5 + 0.5,
        initialX: mesh.position.x
      };

      this.leaves.push(mesh);
      this.scene.add(mesh);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 4;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 4;
    });

    // Suporte a Giroscópio para Mobile
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

    // Interpolação suave do mouse / câmera
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.camera.position.x = this.mouse.x;
    this.camera.position.y = -this.mouse.y;
    this.camera.lookAt(0, 0, 0);

    // Animação das partículas de poeira dourada
    if (this.goldDust) {
      this.goldDust.rotation.y = elapsedTime * 0.03;
      this.goldDust.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
    }

    // Animação e flutuação das folhas de oliveira
    this.leaves.forEach((leaf) => {
      leaf.position.y += leaf.userData.speedY;
      leaf.position.x = leaf.userData.initialX + Math.sin(elapsedTime * leaf.userData.windFactor) * 1.5;

      leaf.rotation.x += leaf.userData.speedRotX;
      leaf.rotation.y += leaf.userData.speedRotY;
      leaf.rotation.z += leaf.userData.speedRotZ;

      // Reposiciona folha no topo ao atingir o limite inferior
      if (leaf.position.y < -25) {
        leaf.position.y = 25;
        leaf.position.x = (Math.random() - 0.5) * 45;
        leaf.userData.initialX = leaf.position.x;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.wedding3D = new Wedding3DScene();
});
