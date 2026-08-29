/**
 * CENÁRIO 3D WEBGL COM THREE.JS
 * Efeitos: Pétalas de Rosas Brancas e Rosas em 3D Flutuantes & Partículas de Brilho Pérola e Ouro
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
    this.petals = [];
    this.clock = new THREE.Clock();

    this.initLights();
    this.createPearlAndGoldDust();
    this.createWhiteRosePetals();
    this.bindEvents();
    this.animate();
  }

  initLights() {
    // Luz ambiente suave e pura
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3);
    this.scene.add(ambientLight);

    // Luz direcional dourada solar
    const sunLight = new THREE.DirectionalLight(0xFDF8EE, 1.6);
    sunLight.position.set(20, 40, 30);
    this.scene.add(sunLight);

    // Ponto de luz suave marfim
    const pointLight = new THREE.PointLight(0xF5EFEB, 1.4, 60);
    pointLight.position.set(-15, -10, 15);
    this.scene.add(pointLight);
  }

  createPearlAndGoldDust() {
    const particleCount = 130;
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

    // Partícula cintilante pérola & ouro
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(245, 235, 210, 0.9)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      size: 1.1,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pearlDust = new THREE.Points(geometry, material);
    this.scene.add(this.pearlDust);
  }

  // Criação da geometria curva realista de pétalas de rosas brancas
  createWhiteRosePetals() {
    // 1. Curva orgânica da pétala de rosa
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -1.4);
    petalShape.bezierCurveTo(1.1, -0.6, 1.3, 0.9, 0, 1.8);
    petalShape.bezierCurveTo(-1.3, 0.9, -1.1, -0.6, 0, -1.4);

    const extrudeSettings = {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3
    };

    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
    petalGeometry.center();

    // Materiais de seda branca, marfim e pérola
    const whitePetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const ivoryPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xF9F6F0,
      roughness: 0.32,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const champagnePetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5EFEB,
      roughness: 0.28,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const materials = [whitePetalMaterial, ivoryPetalMaterial, champagnePetalMaterial];

    // 2. Cria 32 pétalas individuais e botões de rosas brancas flutuantes
    const petalCount = 32;
    for (let i = 0; i < petalCount; i++) {
      const selectedMat = materials[i % materials.length];
      
      // Criação de pétala única ou rosa sobreposta
      const isFullRose = i % 5 === 0;
      let mesh;

      if (isFullRose) {
        // Mini Rosa Branca composta por 3 pétalas entrelaçadas
        const roseGroup = new THREE.Group();
        for (let p = 0; p < 3; p++) {
          const petal = new THREE.Mesh(petalGeometry, selectedMat);
          petal.rotation.z = (p * Math.PI * 2) / 3;
          petal.rotation.x = 0.3;
          petal.scale.set(0.7, 0.7, 0.7);
          roseGroup.add(petal);
        }
        mesh = roseGroup;
      } else {
        // Pétala individual de rosa branca
        mesh = new THREE.Mesh(petalGeometry, selectedMat);
      }
      
      mesh.position.set(
        (Math.random() - 0.5) * 48,
        (Math.random() - 0.5) * 48,
        (Math.random() - 0.5) * 22
      );

      const scale = Math.random() * 0.5 + 0.55;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        speedY: (Math.random() * 0.025 + 0.012) * -1,
        speedRotX: (Math.random() - 0.5) * 0.018,
        speedRotY: (Math.random() - 0.5) * 0.022,
        speedRotZ: (Math.random() - 0.5) * 0.015,
        swaySpeed: Math.random() * 0.8 + 0.6,
        swayAmplitude: Math.random() * 1.8 + 1.0,
        initialX: mesh.position.x
      };

      this.petals.push(mesh);
      this.scene.add(mesh);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 3.5;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 3.5;
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

    // Partículas pérola
    if (this.pearlDust) {
      this.pearlDust.rotation.y = elapsedTime * 0.025;
      this.pearlDust.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;
    }

    // Flutuação realista e suave das pétalas de rosas brancas
    this.petals.forEach((petal) => {
      petal.position.y += petal.userData.speedY;
      petal.position.x = petal.userData.initialX + Math.sin(elapsedTime * petal.userData.swaySpeed) * petal.userData.swayAmplitude;

      petal.rotation.x += petal.userData.speedRotX;
      petal.rotation.y += petal.userData.speedRotY;
      petal.rotation.z += petal.userData.speedRotZ;

      // Quando a pétala atinge o fundo, reaparece suavemente no topo
      if (petal.position.y < -26) {
        petal.position.y = 26;
        petal.position.x = (Math.random() - 0.5) * 48;
        petal.userData.initialX = petal.position.x;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.wedding3D = new Wedding3DScene();
});
