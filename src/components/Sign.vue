<template>
  <div class="relative w-full h-screen bg-gradient-to-b from-sky-400 to-amber-200">
    <div ref="mountRef" class="w-full h-full"></div>
    
    <!-- Écran de démarrage -->
    <div v-if="!gameStarted && !gameOver" 
         class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div class="text-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-500">
        <h1 class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-4">
          COURSE 3D ULTRA
        </h1>
        <p class="text-xl text-gray-300 mb-3">Utilisez ← → pour changer de voie</p>
        <p class="text-md text-yellow-400 mb-6">🏎️ Voitures réalistes • 🚚 Camionnettes • 🌄 Montées/Descentes</p>
        <button
          @click="startGame"
          class="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-2xl font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition shadow-lg">
          🏁 DÉMARRER LA COURSE
        </button>
      </div>
    </div>

    <!-- Écran Game Over -->
    <div v-if="gameOver" 
         class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div class="text-center p-8 bg-gradient-to-br from-gray-900 to-red-900 rounded-2xl shadow-2xl border-2 border-red-500">
        <h2 class="text-6xl font-bold text-red-500 mb-4 animate-pulse">💥 COLLISION !</h2>
        <p class="text-4xl text-white mb-8">
          Score Final: <span class="text-yellow-400 font-bold">{{ score }}</span>
        </p>
        <button
          @click="restartGame"
          class="px-10 py-5 bg-gradient-to-r from-green-600 to-blue-600 text-white text-2xl font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition shadow-lg">
          🔄 REJOUER
        </button>
      </div>
    </div>

    <!-- Interface de jeu -->
    <template v-if="gameStarted && !gameOver">
      <div class="absolute top-6 left-6 bg-gradient-to-br from-black to-gray-900 bg-opacity-80 backdrop-blur-md px-6 py-4 rounded-xl border-2 border-yellow-500 shadow-xl">
        <p class="text-yellow-400 text-lg font-semibold">SCORE</p>
        <p class="text-white text-4xl font-bold">{{ score }}</p>
      </div>
      
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-6">
        <button
          @click="moveLeft"
          class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-3xl font-bold rounded-2xl hover:from-blue-700 hover:to-blue-900 active:scale-95 transition shadow-2xl border-2 border-blue-400">
          ←
        </button>
        <button
          @click="moveRight"
          class="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-3xl font-bold rounded-2xl hover:from-blue-700 hover:to-blue-900 active:scale-95 transition shadow-2xl border-2 border-blue-400">
          →
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const mountRef = ref<HTMLDivElement | null>(null);
const score = ref(0);
const gameOver = ref(false);
const gameStarted = ref(false);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let playerCar: THREE.Group;
let roadGroup: THREE.Group;
let lines: THREE.Mesh[] = [];
let animationId: number;

interface CarEnemy {
  mesh: THREE.Group;
  lane: number;
  type: string;
  scored?: boolean;
}

const gameState = {
  score: 0,
  speed: 0.12,
  playerLane: 1,
  cars: [] as CarEnemy[],
  isMoving: false,
  lastSpawn: 0,
  gameRunning: false,
  roadCurve: 0,
  roadElevation: 0,
  targetCurve: 0,
  targetElevation: 0
};

function createRealisticCar(type: string = 'sedan'): THREE.Group {
  const carGroup = new THREE.Group();
  
  if (type === 'sedan') {
    // Carrosserie principale
    const bodyGeometry = new THREE.BoxGeometry(1.8, 0.7, 3.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    carGroup.add(body);

    // Cabine
    const cabinGeometry = new THREE.BoxGeometry(1.6, 0.6, 1.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({ 
      color: bodyMaterial.color,
      metalness: 0.8,
      roughness: 0.2
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 0.95;
    cabin.position.z = -0.2;
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Vitres
    const windowGeometry = new THREE.BoxGeometry(1.55, 0.55, 1.75);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const windows = new THREE.Mesh(windowGeometry, windowMaterial);
    windows.position.y = 0.95;
    windows.position.z = -0.2;
    carGroup.add(windows);

    // Roues
    const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.7
    });
    const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.27, 8);
    const rimMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1
    });

    const wheelPositions = [
      [-0.85, 0.35, 1.3], [0.85, 0.35, 1.3],
      [-0.85, 0.35, -1.3], [0.85, 0.35, -1.3]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      wheel.rotation.z = Math.PI / 2;
      rim.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      rim.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      carGroup.add(wheel);
      carGroup.add(rim);
    });

    // Phares
    const headlightGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.15);
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffcc,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5
    });
    [-0.6, 0.6].forEach(x => {
      const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight.position.set(x, 0.4, 1.76);
      carGroup.add(headlight);
    });

  } else if (type === 'truck') {
    // Cabine du camion
    const cabinGeometry = new THREE.BoxGeometry(2, 1.2, 2);
    const cabinMaterial = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      metalness: 0.7,
      roughness: 0.3
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 0.8;
    cabin.position.z = 0.8;
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Conteneur
    const containerGeometry = new THREE.BoxGeometry(2, 1.5, 3.5);
    const containerMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a4a,
      metalness: 0.6,
      roughness: 0.4
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.y = 1;
    container.position.z = -1.8;
    container.castShadow = true;
    carGroup.add(container);

    // Roues plus grandes
    const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.3,
      roughness: 0.7
    });

    const wheelPositions = [
      [-0.95, 0.45, 1.5], [0.95, 0.45, 1.5],
      [-0.95, 0.45, -1], [0.95, 0.45, -1],
      [-0.95, 0.45, -2.5], [0.95, 0.45, -2.5]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      carGroup.add(wheel);
    });
  }

  return carGroup;
}

function initGame() {
  if (!mountRef.value) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mountRef.value.appendChild(renderer.domElement);

  // Lumières améliorées
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0xd4a574, 0.6);
  scene.add(hemisphereLight);

  // Ciel amélioré avec gradient
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0xd4a574, 40, 120);

  // Sol désertique texturé
  const desertGeometry = new THREE.PlaneGeometry(200, 200);
  const desertMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd4a574,
    roughness: 0.9,
    metalness: 0.1
  });
  const desert = new THREE.Mesh(desertGeometry, desertMaterial);
  desert.rotation.x = -Math.PI / 2;
  desert.position.y = -0.1;
  desert.receiveShadow = true;
  scene.add(desert);

  // Route améliorée avec texture asphalte
  roadGroup = new THREE.Group();
  const roadGeometry = new THREE.PlaneGeometry(11, 150, 50, 150);
  const roadMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a,
    roughness: 0.95,
    metalness: 0.05
  });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  roadGroup.add(road);

  // 4 lignes blanches pour diviser en 3 voies
  const linePositions = [-3.75, -1.25, 1.25, 3.75];
  lines = [];
  
  for (let i = 0; i < 40; i++) {
    linePositions.forEach(xPos => {
      const lineGeometry = new THREE.BoxGeometry(0.15, 0.05, 2.5);
      const lineMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.set(xPos, 0.02, -i * 5 + 30);
      lines.push(line);
      roadGroup.add(line);
    });
  }
  scene.add(roadGroup);

  // Voiture du joueur
  playerCar = createRealisticCar('sedan');
  playerCar.children.forEach(child => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.color.set(0xff0000);
    }
  });
  playerCar.position.set(0, 0, 5);
  scene.add(playerCar);

  camera.position.set(0, 9, 14);
  camera.lookAt(0, 0, 0);

  gameState.gameRunning = true;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleResize);

  animate();
}

function createEnemyCar(): CarEnemy {
  const type = Math.random() > 0.7 ? 'truck' : 'sedan';
  const lane = Math.floor(Math.random() * 3);
  const xPos = (lane - 1) * 2.5;
  
  const car = createRealisticCar(type);
  car.position.set(xPos, 0, -60);
  (car as any).userData.type = type;
  (car as any).userData.speed = gameState.speed + (Math.random() * 0.04 - 0.02);
  
  scene.add(car);
  return { mesh: car, lane, type };
}

function handleKeyDown(e: KeyboardEvent) {
  if (!gameState.gameRunning || gameState.isMoving) return;
  
  if (e.key === 'ArrowLeft' && gameState.playerLane > 0) {
    gameState.isMoving = true;
    gameState.playerLane--;
    animatePlayerMove((gameState.playerLane - 1) * 2.5);
  } else if (e.key === 'ArrowRight' && gameState.playerLane < 2) {
    gameState.isMoving = true;
    gameState.playerLane++;
    animatePlayerMove((gameState.playerLane - 1) * 2.5);
  }
}

function animatePlayerMove(targetX: number) {
  const startX = playerCar.position.x;
  const duration = 250;
  const startTime = Date.now();
  
  function move() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    playerCar.position.x = startX + (targetX - startX) * eased;
    
    if (progress < 1) {
      requestAnimationFrame(move);
    } else {
      gameState.isMoving = false;
    }
  }
  move();
}

function moveLeft() {
  const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
  window.dispatchEvent(event);
}

function moveRight() {
  const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
  window.dispatchEvent(event);
}

let lastTime = Date.now();

function animate() {
  if (!gameState.gameRunning) return;
  
  animationId = requestAnimationFrame(animate);
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Changement de courbe tous les 75 points
  if (Math.floor(gameState.score / 75) !== Math.floor((gameState.score - 1) / 75)) {
    const curveTypes = [-0.15, -0.1, 0, 0.1, 0.15];
    const elevationTypes = [-0.05, -0.03, 0, 0.03, 0.05];
    gameState.targetCurve = curveTypes[Math.floor(Math.random() * curveTypes.length)];
    gameState.targetElevation = elevationTypes[Math.floor(Math.random() * elevationTypes.length)];
  }

  // Interpolation douce de la courbe et de l'élévation
  gameState.roadCurve += (gameState.targetCurve - gameState.roadCurve) * 0.02;
  gameState.roadElevation += (gameState.targetElevation - gameState.roadElevation) * 0.02;

  // Appliquer la courbe et l'élévation à la route
  const road = roadGroup.children[0] as THREE.Mesh;
  const positions = (road.geometry as THREE.PlaneGeometry).attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const z = positions.getZ(i);
    const normalizedZ = z / 75;
    positions.setX(i, positions.getX(i) * 0 + normalizedZ * gameState.roadCurve * 15);
    positions.setY(i, Math.sin(normalizedZ * Math.PI) * gameState.roadElevation * 10);
  }
  positions.needsUpdate = true;

  // Incliner la caméra avec la route
  camera.position.x = gameState.roadCurve * 3;
  camera.rotation.z = -gameState.roadCurve * 0.3;

  // Déplacer les lignes
  lines.forEach(line => {
    line.position.z += gameState.speed * deltaTime / 16;
    if (line.position.z > 30) {
      line.position.z -= 200;
    }
  });

  // Rotation des roues du joueur
  playerCar.children.forEach(child => {
    if (child instanceof THREE.Mesh && child.geometry.type === 'CylinderGeometry') {
      child.rotation.x += gameState.speed * 0.6;
    }
  });

  // Spawn des voitures
  if (currentTime - gameState.lastSpawn > 1200) {
    const occupiedLanes = gameState.cars
      .filter(car => car.mesh.position.z > -40 && car.mesh.position.z < -15)
      .map(car => car.lane);
    
    const availableLanes = [0, 1, 2].filter(lane => !occupiedLanes.includes(lane));
    
    if (availableLanes.length > 0) {
      const newCar = createEnemyCar();
      const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      newCar.mesh.position.x = (randomLane - 1) * 2.5;
      newCar.lane = randomLane;
      gameState.cars.push(newCar);
      gameState.lastSpawn = currentTime;
    }
  }

  // Déplacer et vérifier collisions
  for (let i = gameState.cars.length - 1; i >= 0; i--) {
    const car = gameState.cars[i];
    const carSpeed = (car.mesh as any).userData.speed || gameState.speed;
    car.mesh.position.z += carSpeed * deltaTime / 16;
    
    // Rotation des roues
    car.mesh.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.geometry.type === 'CylinderGeometry') {
        child.rotation.x += carSpeed * 0.6;
      }
    });

    // Détection de collision
    const distance = Math.abs(car.mesh.position.z - playerCar.position.z);
    const lateralDistance = Math.abs(car.mesh.position.x - playerCar.position.x);
    
    if (distance < 3 && lateralDistance < 1.5) {
      gameState.gameRunning = false;
      gameOver.value = true;
      return;
    }

    // Incrémenter le score
    if (car.mesh.position.z > 10 && !car.scored) {
      car.scored = true;
      const points = car.type === 'truck' ? 15 : 10;
      gameState.score += points;
      score.value = gameState.score;
      
      // Augmenter la vitesse tous les 100 points
      if (gameState.score % 100 === 0) {
        gameState.speed += 0.02;
      }
    }

    // Supprimer les voitures hors écran
    if (car.mesh.position.z > 20) {
      scene.remove(car.mesh);
      gameState.cars.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
}

function handleResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function startGame() {
  gameStarted.value = true;
  gameOver.value = false;
  score.value = 0;
  gameState.score = 0;
  gameState.speed = 0.12;
  gameState.playerLane = 1;
  gameState.cars = [];
  gameState.isMoving = false;
  gameState.lastSpawn = 0;
  gameState.gameRunning = false;
  gameState.roadCurve = 0;
  gameState.roadElevation = 0;
  gameState.targetCurve = 0;
  gameState.targetElevation = 0;
  
  setTimeout(() => {
    initGame();
  }, 100);
}

function restartGame() {
  cleanup();
  gameStarted.value = false;
  setTimeout(() => {
    startGame();
  }, 100);
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('resize', handleResize);
  gameState.gameRunning = false;
  
  if (mountRef.value && renderer && renderer.domElement) {
    mountRef.value.removeChild(renderer.domElement);
  }
  
  if (renderer) {
    renderer.dispose();
  }
}

onMounted(() => {
  // Le jeu s'initialise quand l'utilisateur clique sur démarrer
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
