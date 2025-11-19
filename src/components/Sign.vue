<template>
  <div class="game-container">
    <div ref="gameCanvas" class="canvas-container"></div>
    
    <!-- Écran de démarrage -->
    <div v-if="!gameStarted && !gameOver" class="overlay">
      <div class="menu-box">
        <h1 class="title">Jeu de Voiture 3D</h1>
        <p class="instructions">
          Utilisez les flèches ← → ou les boutons pour éviter les voitures
        </p>
        <button @click="startGame" class="btn-start">
          Démarrer
        </button>
      </div>
    </div>

    <!-- Interface de jeu -->
    <div v-if="gameStarted" class="game-ui">
      <div class="score-display">
        Score: {{ score }}
      </div>

      <div class="controls">
        <button @click="moveLeft" class="btn-control">
          ←
        </button>
        <button @click="moveRight" class="btn-control">
          →
        </button>
      </div>
    </div>

    <!-- Écran Game Over -->
    <div v-if="gameOver" class="overlay">
      <div class="menu-box">
        <h2 class="game-over-title">Game Over!</h2>
        <p class="final-score">Score Final: {{ score }}</p>
        <button @click="resetGame" class="btn-start">
          Rejouer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sign',
  data() {
    return {
      score: 0,
      gameOver: false,
      gameStarted: false,
      scene: null,
      camera: null,
      renderer: null,
      playerCar: null,
      enemyCars: [],
      currentLane: 1,
      speed: 0.1,
      animationId: null,
      spawnInterval: null,
      THREE: null
    };
  },
  mounted() {
    // Charger Three.js depuis CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      this.THREE = window.THREE;
      console.log('Three.js chargé avec succès');
    };
    document.head.appendChild(script);
  },
  methods: {
    startGame() {
      if (!this.THREE) {
        alert('Three.js est en cours de chargement, veuillez patienter...');
        return;
      }
      this.gameStarted = true;
      this.gameOver = false;
      this.score = 0;
      this.$nextTick(() => {
        this.initGame();
      });
    },

    resetGame() {
      this.cleanup();
      this.gameOver = false;
      this.gameStarted = false;
      this.score = 0;
      this.enemyCars = [];
      this.currentLane = 1;
      this.speed = 0.1;
    },

    initGame() {
      const THREE = this.THREE;
      
      // Configuration de la scène
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB);
      this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

      // Caméra
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 5, 8);
      this.camera.lookAt(0, 0, -5);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.$refs.gameCanvas.appendChild(this.renderer.domElement);

      // Lumières
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      // Route
      const roadGeometry = new THREE.PlaneGeometry(9, 100);
      const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.z = -25;
      road.receiveShadow = true;
      this.scene.add(road);

      // Lignes de route
      for (let i = 0; i < 20; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.1, 2);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
        line1.position.set(-1.5, 0.05, -5 * i);
        this.scene.add(line1);
        
        const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
        line2.position.set(1.5, 0.05, -5 * i);
        this.scene.add(line2);
      }

      // Voiture du joueur
      this.playerCar = this.createCar(0xFF0000);
      this.playerCar.position.set(0, 0, 5);
      this.scene.add(this.playerCar);

      // Événements clavier
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('resize', this.handleResize);

      // Spawn des voitures ennemies
      this.spawnInterval = setInterval(() => {
        if (!this.gameOver) {
          this.spawnEnemyCar();
        }
      }, 2000);

      // Démarrer l'animation
      this.animate();
    },

    createCar(color) {
      const THREE = this.THREE;
      const carGroup = new THREE.Group();
      
      // Corps
      const bodyGeometry = new THREE.BoxGeometry(1.2, 0.6, 2);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.3;
      body.castShadow = true;
      carGroup.add(body);
      
      // Cabine
      const cabinGeometry = new THREE.BoxGeometry(1, 0.5, 1);
      const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.set(0, 0.8, -0.2);
      cabin.castShadow = true;
      carGroup.add(cabin);
      
      // Roues
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
      const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      
      const positions = [
        [-0.6, 0.3, 0.7],
        [0.6, 0.3, 0.7],
        [-0.6, 0.3, -0.7],
        [0.6, 0.3, -0.7]
      ];
      
      positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });
      
      return carGroup;
    },

    spawnEnemyCar() {
      const lanes = [-3, 0, 3];
      const availableLanes = lanes.filter(lane => {
        const hasCarInLane = this.enemyCars.some(
          car => Math.abs(car.position.x - lane) < 1 && car.position.z > -10
        );
        return !hasCarInLane;
      });
      
      if (availableLanes.length === 0) return;
      
      const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      const colors = [0x0000FF, 0x00FF00, 0xFFFF00, 0xFF00FF, 0x00FFFF];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const enemyCar = this.createCar(color);
      enemyCar.position.set(lane, 0, -30);
      enemyCar.rotation.y = Math.PI;
      this.scene.add(enemyCar);
      this.enemyCars.push(enemyCar);
    },

    moveLeft() {
      if (this.gameOver || !this.gameStarted) return;
      const lanes = [-3, 0, 3];
      if (this.currentLane > 0) {
        this.currentLane--;
        this.playerCar.position.x = lanes[this.currentLane];
      }
    },

    moveRight() {
      if (this.gameOver || !this.gameStarted) return;
      const lanes = [-3, 0, 3];
      if (this.currentLane < 2) {
        this.currentLane++;
        this.playerCar.position.x = lanes[this.currentLane];
      }
    },

    handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        this.moveLeft();
      } else if (e.key === 'ArrowRight') {
        this.moveRight();
      }
    },

    handleResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    },

    checkCollision() {
      const playerPos = this.playerCar.position;
      
      for (let enemyCar of this.enemyCars) {
        const distance = playerPos.distanceTo(enemyCar.position);
        if (distance < 2) {
          this.gameOver = true;
          return true;
        }
      }
      return false;
    },

    animate() {
      if (this.gameOver) return;
      
      this.animationId = requestAnimationFrame(this.animate);

      // Déplacer les voitures ennemies
      for (let i = this.enemyCars.length - 1; i >= 0; i--) {
        const car = this.enemyCars[i];
        car.position.z += this.speed;
        
        if (car.position.z > 10) {
          this.scene.remove(car);
          this.enemyCars.splice(i, 1);
          this.score += 10;
          this.speed = Math.min(0.2, 0.1 + this.score * 0.0001);
        }
      }

      this.checkCollision();
      this.renderer.render(this.scene, this.camera);
    },

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.spawnInterval) {
        clearInterval(this.spawnInterval);
      }
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('resize', this.handleResize);
      
      if (this.renderer && this.$refs.gameCanvas) {
        this.$refs.gameCanvas.innerHTML = '';
        this.renderer.dispose();
      }
    }
  },

  beforeUnmount() {
    this.cleanup();
  }
};
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.menu-box {
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 10px;
  color: white;
}

.title {
  font-size: 48px;
  margin-bottom: 20px;
}

.instructions {
  font-size: 20px;
  margin-bottom: 30px;
}

.btn-start {
  font-size: 24px;
  padding: 15px 40px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-start:hover {
  background: #45a049;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.score-display {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 32px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 30px;
  border-radius: 10px;
}

.controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  pointer-events: auto;
}

.btn-control {
  width: 80px;
  height: 80px;
  font-size: 32px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-control:hover {
  background: rgba(255, 255, 255, 1);
}

.btn-control:active {
  transform: scale(0.95);
}

.game-over-title {
  font-size: 48px;
  margin-bottom: 20px;
}

.final-score {
  font-size: 32px;
  margin-bottom: 30px;
}
</style>
