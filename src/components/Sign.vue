import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Sign() {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameStateRef = useRef({
    playerCar: null,
    enemyCars: [],
    currentLane: 1,
    speed: 0.1,
    score: 0,
    isGameOver: false
  });

  useEffect(() => {
    if (!mountRef.current || !gameStarted) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, -5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Road
    const roadGeometry = new THREE.PlaneGeometry(9, 100);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.z = -25;
    road.receiveShadow = true;
    scene.add(road);

    // Road lines
    for (let i = 0; i < 20; i++) {
      const lineGeometry = new THREE.BoxGeometry(0.2, 0.1, 2);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      
      const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
      line1.position.set(-1.5, 0.05, -5 * i);
      scene.add(line1);
      
      const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
      line2.position.set(1.5, 0.05, -5 * i);
      scene.add(line2);
    }

    // Player car
    const createCar = (color) => {
      const carGroup = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(1.2, 0.6, 2);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.3;
      body.castShadow = true;
      carGroup.add(body);
      
      const cabinGeometry = new THREE.BoxGeometry(1, 0.5, 1);
      const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.set(0, 0.8, -0.2);
      cabin.castShadow = true;
      carGroup.add(cabin);
      
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
    };

    const playerCar = createCar(0xFF0000);
    playerCar.position.set(0, 0, 5);
    scene.add(playerCar);
    gameStateRef.current.playerCar = playerCar;

    // Enemy cars
    const spawnEnemyCar = () => {
      if (gameStateRef.current.isGameOver) return;
      
      const lanes = [-3, 0, 3];
      const availableLanes = lanes.filter(lane => {
        const hasCarInLane = gameStateRef.current.enemyCars.some(
          car => Math.abs(car.position.x - lane) < 1 && car.position.z > -10
        );
        return !hasCarInLane;
      });
      
      if (availableLanes.length === 0) return;
      
      const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      const colors = [0x0000FF, 0x00FF00, 0xFFFF00, 0xFF00FF, 0x00FFFF];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const enemyCar = createCar(color);
      enemyCar.position.set(lane, 0, -30);
      enemyCar.rotation.y = Math.PI;
      scene.add(enemyCar);
      gameStateRef.current.enemyCars.push(enemyCar);
    };

    // Spawn initial cars
    const spawnInterval = setInterval(() => {
      if (!gameStateRef.current.isGameOver) {
        spawnEnemyCar();
      }
    }, 2000);

    // Keyboard controls
    const handleKeyDown = (e) => {
      if (gameStateRef.current.isGameOver) return;
      
      const lanes = [-3, 0, 3];
      const currentLane = gameStateRef.current.currentLane;
      
      if (e.key === 'ArrowLeft' && currentLane > 0) {
        gameStateRef.current.currentLane--;
        gameStateRef.current.playerCar.position.x = lanes[gameStateRef.current.currentLane];
      } else if (e.key === 'ArrowRight' && currentLane < 2) {
        gameStateRef.current.currentLane++;
        gameStateRef.current.playerCar.position.x = lanes[gameStateRef.current.currentLane];
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Collision detection
    const checkCollision = () => {
      const playerPos = gameStateRef.current.playerCar.position;
      
      for (let enemyCar of gameStateRef.current.enemyCars) {
        const distance = playerPos.distanceTo(enemyCar.position);
        if (distance < 2) {
          gameStateRef.current.isGameOver = true;
          setGameOver(true);
          return true;
        }
      }
      return false;
    };

    // Animation loop
    const animate = () => {
      if (gameStateRef.current.isGameOver) return;
      
      requestAnimationFrame(animate);

      // Move enemy cars
      gameStateRef.current.enemyCars.forEach((car, index) => {
        car.position.z += gameStateRef.current.speed;
        
        if (car.position.z > 10) {
          scene.remove(car);
          gameStateRef.current.enemyCars.splice(index, 1);
          gameStateRef.current.score += 10;
          setScore(gameStateRef.current.score);
          gameStateRef.current.speed = Math.min(0.2, 0.1 + gameStateRef.current.score * 0.0001);
        }
      });

      checkCollision();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameStarted]);

  const handleMoveLeft = () => {
    if (gameStateRef.current.isGameOver || !gameStarted) return;
    const lanes = [-3, 0, 3];
    if (gameStateRef.current.currentLane > 0) {
      gameStateRef.current.currentLane--;
      gameStateRef.current.playerCar.position.x = lanes[gameStateRef.current.currentLane];
    }
  };

  const handleMoveRight = () => {
    if (gameStateRef.current.isGameOver || !gameStarted) return;
    const lanes = [-3, 0, 3];
    if (gameStateRef.current.currentLane < 2) {
      gameStateRef.current.currentLane++;
      gameStateRef.current.playerCar.position.x = lanes[gameStateRef.current.currentLane];
    }
  };

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    gameStateRef.current = {
      playerCar: null,
      enemyCars: [],
      currentLane: 1,
      speed: 0.1,
      score: 0,
      isGameOver: false
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {!gameStarted && !gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '10px'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Jeu de Voiture 3D</h1>
          <p style={{ fontSize: '20px', marginBottom: '30px' }}>
            Utilisez les flèches ← → ou les boutons pour éviter les voitures
          </p>
          <button
            onClick={startGame}
            style={{
              fontSize: '24px',
              padding: '15px 40px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Démarrer
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'rgba(0,0,0,0.5)',
            padding: '10px 30px',
            borderRadius: '10px'
          }}>
            Score: {score}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px'
          }}>
            <button
              onClick={handleMoveLeft}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '32px',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ←
            </button>
            <button
              onClick={handleMoveRight}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '32px',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              →
            </button>
          </div>
        </>
      )}

      {gameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '40px',
          borderRadius: '10px'
        }}>
          <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>Game Over!</h2>
          <p style={{ fontSize: '32px', marginBottom: '30px' }}>Score Final: {score}</p>
          <button
            onClick={resetGame}
            style={{
              fontSize: '24px',
              padding: '15px 40px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}
