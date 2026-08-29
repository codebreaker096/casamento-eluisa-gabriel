/**
 * CENÁRIO 3D WEBGL COM THREE.JS
 * Efeitos: Pétalas de Rosas Brancas/Champagne com Sombra Suave, Folhinhas de Roseiras & Partículas Douradas
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
    this.createWhiteRosePetalsAndLeaves();
    this.bindEvents();
    this.animate();
  }

  initLights() {
    // Luz ambiente quente e suave que destaca o relevo das pétalas
    const ambientLight = new THREE.AmbientLight(0xF4EFE6, 1.1);
    this.scene.add(ambientLight);

    // Luz solar suave que cria sombra e contorno nas pétalas
    const sunLight = new THREE.DirectionalLight(0xE5C687, 1.8);
    sunLight.position.set(25, 35, 25);
    this.scene.add(sunLight);

    // Ponto de luz sutil de preenchimento
    const fillLight = new THREE.DirectionalLight(0x7E9271, 0.6);
    fillLight.position.set(-20, -15, 15);
    this.scene.add(fillLight);
  }

  createPearlAndGoldDust() {
    const particleCount = 120;
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

    // Partícula cintilante ouro & pérola
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 248, 220, 1)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.9)');
    grad.addColorStop(0.7, 'rgba(180, 140, 50, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      size: 1.3,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pearlDust = new THREE.Points(geometry, material);
    this.scene.add(this.pearlDust);
  }

  // Criação de pétalas de rosas brancas e folhinhas de roseira com contraste perfeito
  createWhiteRosePetalsAndLeaves() {
    // 1. Geometria de Pétala de Rosa com curvatura natural
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -1.5);
    petalShape.bezierCurveTo(1.2, -0.6, 1.4, 0.9, 0, 1.9);
    petalShape.bezierCurveTo(-1.4, 0.9, -1.2, -0.6, 0, -1.5);

    const petalSettings = {
      steps: 1,
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3
    };
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, petalSettings);
    petalGeometry.center();

    // 2. Geometria de Folha de Roseira
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -1.2);
    leafShape.bezierCurveTo(0.6, -0.6, 0.7, 0.6, 0, 1.5);
    leafShape.bezierCurveTo(-0.7, 0.6, -0.6, -0.6, 0, -1.2);
    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
      steps: 1, depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02
    });
    leafGeometry.center();

    // Materiais com sombreamento bem definido e contraste suave no fundo claro
    const petalMatChampagne = new THREE.MeshStandardMaterial({
      color: 0xEDE2D5, // Champagne suave com sombra natural
      roughness: 0.35,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    const petalMatBlush = new THREE.MeshStandardMaterial({
      color: 0xE6D5C7, // Branco rosado com profundidade
      roughness: 0.38,
      metalness: 0.10,
      side: THREE.DoubleSide
    });

    const petalMatIvory = new THREE.MeshStandardMaterial({
      color: 0xF4ECE1, // Marfim com relevo
      roughness: 0.32,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const roseLeafMat = new THREE.MeshStandardMaterial({
      color: 0x627556, // Verde sálvia/oliva de folhas de roseira
      roughness: 0.45,
      metalness: 0.18,
      side: THREE.DoubleSide
    });

    const petalMats = [petalMatChampagne, petalMatBlush, petalMatIvory];

    // 3. Cria 36 elementos (pétalas de rosas, mini rosas e folhas de roseiras)
    const count = 36;
    for (let i = 0; i < count; i++) {
      let mesh;
      const isLeaf = i % 6 === 0; // 1 a cada 6 é uma delicada folha de roseira
      const isFullRose = i % 7 === 0; // Mini botão de rosa

      if (isLeaf) {
        mesh = new THREE.Mesh(leafGeometry, roseLeafMat);
      } else if (isFullRose) {
        const roseGroup = new THREE.Group();
        for (let p = 0; p < 3; p++) {
          const petal = new THREE.Mesh(petalGeometry, petalMats[p % petalMats.length]);
          petal.rotation.z = (p * Math.PI * 2) / 3;
          petal.rotation.x = 0.35;
          petal.scale.set(0.75, 0.75, 0.75);
          roseGroup.add(petal);
        }
        mesh = roseGroup;
      } else {
        mesh = new THREE.Mesh(petalGeometry, petalMats[i % petalMats.length]);
      }

      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 22
      );

      const scale = Math.random() * 0.55 + 0.65;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        speedY: (Math.random() * 0.024 + 0.012) * -1,
        speedRotX: (Math.random() - 0.5) * 0.018,
        speedRotY: (Math.random() - 0.5) * 0.022,
        speedRotZ: (Math.random() - 0.5) * 0.016,
        swaySpeed: Math.random() * 0.8 + 0.6,
        swayAmplitude: Math.random() * 1.8 + 1.2,
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

    // Interpolação suave da câmera
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.camera.position.x = this.mouse.x;
    this.camera.position.y = -this.mouse.y;
    this.camera.lookAt(0, 0, 0);

    // Partículas ouro e pérola
    if (this.pearlDust) {
      this.pearlDust.rotation.y = elapsedTime * 0.025;
      this.pearlDust.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;
    }

    // Movimento e queda suave das pétalas de rosas e folhinhas de roseira
    this.petals.forEach((petal) => {
      petal.position.y += petal.userData.speedY;
      petal.position.x = petal.userData.initialX + Math.sin(elapsedTime * petal.userData.swaySpeed) * petal.userData.swayAmplitude;

      petal.rotation.x += petal.userData.speedRotX;
      petal.rotation.y += petal.userData.speedRotY;
      petal.rotation.z += petal.userData.speedRotZ;

      // Quando atinge a base, reaparece suavemente no topo
      if (petal.position.y < -26) {
        petal.position.y = 26;
        petal.position.x = (Math.random() - 0.5) * 50;
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
