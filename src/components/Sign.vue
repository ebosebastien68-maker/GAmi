<template>
  <div class="game-container">
    <!-- Écran de démarrage -->
    <div v-if="!gameStarted && !gameOver" class="overlay start-screen">
      <div class="card">
        <h1 class="title">🏎️ Course Infinie</h1>
        <p class="instructions">
          Utilisez les flèches ← → ou les boutons pour changer de voie
        </p>
        <p class="instructions">Évitez les obstacles !</p>
        <button @click="startGame" class="btn btn-primary">
          Commencer
        </button>
      </div>
    </div>

    <!-- Écran de game over -->
    <div v-if="gameOver" class="overlay game-over-screen">
      <div class="card">
        <h1 class="title">Game Over</h1>
        <p class="score-text">Score: {{ score }}</p>
        <p class="best-score">Meilleur: {{ bestScore }}</p>
        <div class="button-group">
          <button @click="restartGame" class="btn btn-primary">
            Rejouer
          </button>
          <button @click="goHome" class="btn btn-secondary">
            Accueil
          </button>
        </div>
      </div>
    </div>

    <!-- Interface de jeu -->
    <div v-if="gameStarted && !gameOver" class="hud">
      <div class="score-display">Score: {{ score }}</div>
      <button @click="pauseGame" class="btn-small">
        {{ paused ? '▶️' : '⏸️' }}
      </button>
    </div>

    <!-- Canvas Three.js -->
    <div ref="gameCanvas" class="canvas-container"></div>

    <!-- Contrôles mobiles -->
    <div v-if="gameStarted && !gameOver" class="controls">
      <button @click="moveLeft" class="control-btn">
        ←
      </button>
      <button @click="moveRight" class="control-btn">
        →
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sign',
  data() {
    return {
      gameStarted: false,
      gameOver: false,
      paused: false,
      score: 0,
      bestScore: 0,
      scene: null,
      camera: null,
      renderer: null,
      playerCar: null,
      obstacles: [],
      currentLane: 1,
      lanes: [-3, 0, 3],
      gameSpeed: 0.1,
      animationId: null
    }
  },
  mounted() {
    this.loadThreeJS()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    loadThreeJS() {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      script.onload = () => {
        this.initThree()
      }
      document.head.appendChild(script)
    },
    
    initThree() {
      const THREE = window.THREE
      
      // Scène
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xf5e6d3)
      this.scene.fog = new THREE.Fog(0xf5e6d3, 10, 50)
      
      // Caméra
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.camera.position.set(0, 8, 8)
      this.camera.lookAt(0, 0, -10)
      
      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.shadowMap.enabled = true
      this.$refs.gameCanvas.appendChild(this.renderer.domElement)
      
      // Lumières
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
      dirLight.position.set(5, 10, 5)
      dirLight.castShadow = true
      this.scene.add(dirLight)
      
      // Route
      this.createRoad()
      
      // Voiture du joueur
      this.createPlayerCar()
      
      // Gestion du redimensionnement
      window.addEventListener('resize', this.onWindowResize)
      
      // Rendu initial
      this.renderer.render(this.scene, this.camera)
    },
    
    createRoad() {
      const THREE = window.THREE
      
      // Route principale
      const roadGeometry = new THREE.PlaneGeometry(10, 100)
      const roadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a4a4a,
        roughness: 0.8
      })
      const road = new THREE.Mesh(roadGeometry, roadMaterial)
      road.rotation.x = -Math.PI / 2
      road.position.y = 0
      road.receiveShadow = true
      this.scene.add(road)
      
      // Lignes de séparation
      for (let i = 0; i < 20; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.1, 2)
        const lineMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff 
        })
        const line1 = new THREE.Mesh(lineGeometry, lineMaterial)
        line1.position.set(-1.5, 0.05, -5 - i * 5)
        this.scene.add(line1)
        
        const line2 = new THREE.Mesh(lineGeometry, lineMaterial)
        line2.position.set(1.5, 0.05, -5 - i * 5)
        this.scene.add(line2)
      }
      
      // Bords de route (sable)
      const sideGeometry = new THREE.PlaneGeometry(5, 100)
      const sideMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4a574 
      })
      
      const leftSide = new THREE.Mesh(sideGeometry, sideMaterial)
      leftSide.rotation.x = -Math.PI / 2
      leftSide.position.set(-7.5, 0, 0)
      this.scene.add(leftSide)
      
      const rightSide = new THREE.Mesh(sideGeometry, sideMaterial)
      rightSide.rotation.x = -Math.PI / 2
      rightSide.position.set(7.5, 0, 0)
      this.scene.add(rightSide)
    },
    
    createPlayerCar() {
      const THREE = window.THREE
      const carGroup = new THREE.Group()
      
      // Corps de la voiture
      const bodyGeometry = new THREE.BoxGeometry(1.5, 0.6, 2.5)
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe74c3c 
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.5
      body.castShadow = true
      carGroup.add(body)
      
      // Cabine
      const cabinGeometry = new THREE.BoxGeometry(1.3, 0.5, 1.2)
      const cabinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x34495e 
      })
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
      cabin.position.y = 0.9
      cabin.position.z = -0.3
      cabin.castShadow = true
      carGroup.add(cabin)
      
      // Roues
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16)
      const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2c3e50 
      })
      
      const positions = [
        [-0.8, 0.3, 0.8],
        [0.8, 0.3, 0.8],
        [-0.8, 0.3, -0.8],
        [0.8, 0.3, -0.8]
      ]
      
      positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(...pos)
        wheel.castShadow = true
        carGroup.add(wheel)
      })
      
      carGroup.position.set(this.lanes[this.currentLane], 0, 3)
      this.playerCar = carGroup
      this.scene.add(carGroup)
    },
    
    createObstacle() {
      const THREE = window.THREE
      const carGroup = new THREE.Group()
      
      // Couleurs aléatoires pour les obstacles
      const colors = [0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      const bodyGeometry = new THREE.BoxGeometry(1.5, 0.6, 2.5)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.5
      body.castShadow = true
      carGroup.add(body)
      
      const cabinGeometry = new THREE.BoxGeometry(1.3, 0.5, 1.2)
      const cabinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x34495e 
      })
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
      cabin.position.y = 0.9
      cabin.position.z = 0.3
      cabin.castShadow = true
      carGroup.add(cabin)
      
      // Choisir une voie disponible
      let availableLanes = [0, 1, 2]
      
      // Retirer la voie du joueur
      const playerLaneIndex = availableLanes.indexOf(this.currentLane)
      if (playerLaneIndex > -1) {
        availableLanes.splice(playerLaneIndex, 1)
      }
      
      const laneIndex = availableLanes[Math.floor(Math.random() * availableLanes.length)]
      carGroup.position.set(this.lanes[laneIndex], 0, -30)
      
      this.scene.add(carGroup)
      this.obstacles.push(carGroup)
    },
    
    startGame() {
      this.gameStarted = true
      this.gameOver = false
      this.score = 0
      this.gameSpeed = 0.1
      
      // Écouter les touches du clavier
      document.addEventListener('keydown', this.handleKeyPress)
      
      // Démarrer la boucle de jeu
      this.gameLoop()
      
      // Créer des obstacles
      this.obstacleInterval = setInterval(() => {
        if (!this.paused && !this.gameOver) {
          this.createObstacle()
        }
      }, 1500)
    },
    
    gameLoop() {
      if (this.gameOver) return
      
      if (!this.paused) {
        // Déplacer les obstacles
        this.obstacles.forEach((obstacle, index) => {
          obstacle.position.z += this.gameSpeed
          
          // Vérifier les collisions
          const distance = Math.abs(obstacle.position.z - this.playerCar.position.z)
          const lateralDistance = Math.abs(
            obstacle.position.x - this.playerCar.position.x
          )
          
          if (distance < 2 && lateralDistance < 1.5) {
            this.endGame()
          }
          
          // Retirer les obstacles hors de vue et augmenter le score
          if (obstacle.position.z > 10) {
            this.scene.remove(obstacle)
            this.obstacles.splice(index, 1)
            this.score += 10
            
            // Augmenter la difficulté
            if (this.score % 100 === 0) {
              this.gameSpeed += 0.02
            }
          }
        })
        
        // Mouvement fluide de la voiture
        const targetX = this.lanes[this.currentLane]
        this.playerCar.position.x += (targetX - this.playerCar.position.x) * 0.15
      }
      
      this.renderer.render(this.scene, this.camera)
      this.animationId = requestAnimationFrame(this.gameLoop)
    },
    
    handleKeyPress(e) {
      if (e.key === 'ArrowLeft') {
        this.moveLeft()
      } else if (e.key === 'ArrowRight') {
        this.moveRight()
      } else if (e.key === ' ') {
        this.pauseGame()
      }
    },
    
    moveLeft() {
      if (this.currentLane > 0 && !this.paused) {
        this.currentLane--
      }
    },
    
    moveRight() {
      if (this.currentLane < 2 && !this.paused) {
        this.currentLane++
      }
    },
    
    pauseGame() {
      this.paused = !this.paused
    },
    
    endGame() {
      this.gameOver = true
      if (this.score > this.bestScore) {
        this.bestScore = this.score
      }
      clearInterval(this.obstacleInterval)
      document.removeEventListener('keydown', this.handleKeyPress)
      cancelAnimationFrame(this.animationId)
    },
    
    restartGame() {
      // Nettoyer les obstacles
      this.obstacles.forEach(obstacle => {
        this.scene.remove(obstacle)
      })
      this.obstacles = []
      
      // Réinitialiser la position du joueur
      this.currentLane = 1
      this.playerCar.position.set(this.lanes[1], 0, 3)
      
      // Redémarrer
      this.startGame()
    },
    
    goHome() {
      this.$emit('navigate', 'Home')
    },
    
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    
    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
      if (this.obstacleInterval) {
        clearInterval(this.obstacleInterval)
      }
      document.removeEventListener('keydown', this.handleKeyPress)
      window.removeEventListener('resize', this.onWindowResize)
      
      if (this.renderer && this.$refs.gameCanvas) {
        this.$refs.gameCanvas.removeChild(this.renderer.domElement)
      }
    }
  }
}
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to bottom, #f5e6d3, #d4a574);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 165, 116, 0.95);
  z-index: 10;
}

.card {
  background: linear-gradient(135deg, #f5e6d3, #e8d4b8);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  border: 3px solid #d4a574;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #5a4a3a;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.instructions {
  font-size: 1.1rem;
  color: #6b5b4b;
  margin: 0.5rem 0;
}

.score-text {
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
}

.best-score {
  font-size: 1.3rem;
  color: #6b5b4b;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #8b7355, #6b5b4b);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 91, 75, 0.4);
}

.hud {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 5;
}

.score-display {
  background: rgba(245, 230, 211, 0.95);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #5a4a3a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 2px solid #d4a574;
}

.btn-small {
  background: rgba(245, 230, 211, 0.95);
  border: 2px solid #d4a574;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-small:hover {
  transform: scale(1.1);
}

.controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  z-index: 5;
}

.control-btn {
  width: 80px;
  height: 80px;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #f5e6d3, #e8d4b8);
  border: 3px solid #d4a574;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: #5a4a3a;
  font-weight: bold;
}

.control-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .control-btn {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
}
</style>
