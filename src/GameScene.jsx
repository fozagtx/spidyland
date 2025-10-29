import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { Treasure } from './Treasure';
import { GLBSpider } from './GLBSpider';
import { Playground } from './Playground';
import { soundManager } from './SoundManager';

function EnhancedFloor() {
  const floorRef = useRef();
  
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 80 + 20;
      const opacity = Math.random() * 0.3;
      
      ctx.fillStyle = `rgba(80, 120, 150, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 50; i++) {
      ctx.strokeStyle = `rgba(100, 150, 200, ${Math.random() * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 2048, Math.random() * 2048);
      ctx.lineTo(Math.random() * 2048, Math.random() * 2048);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  }, []);
  
  return (
    <mesh ref={floorRef} receiveShadow rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial
        map={floorTexture}
        color="#1a2332"
        roughness={0.9}
        metalness={0.2}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

function Obstacles() {
  const obstacles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 40,
          Math.random() * 2 + 0.5,
          (Math.random() - 0.5) * 40
        ],
        scale: [
          Math.random() * 2 + 1,
          Math.random() * 3 + 2,
          Math.random() * 2 + 1
        ],
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.5, 0.3)
      });
    }
    return items;
  }, []);

  return (
    <group>
      {obstacles.map((obs, i) => (
        <mesh
          key={i}
          position={obs.position}
          scale={obs.scale}
          castShadow
          receiveShadow
        >
          <boxGeometry />
          <meshStandardMaterial
            color={obs.color}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3498db" />
    </mesh>
  );
}

export default function GameScene() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [treasurePosition, setTreasurePosition] = useState([15, 0, 15]);
  const [treasureCollected, setTreasureCollected] = useState(false);
  const [score, setScore] = useState(0);

  const spiders = useMemo(() => [
    { id: 1, position: [-10, 0, -10], speed: 0.025 },
    { id: 2, position: [10, 0, -10], speed: 0.022 },
    { id: 3, position: [-10, 0, 10], speed: 0.028 },
    { id: 4, position: [10, 0, 10], speed: 0.024 },
    { id: 5, position: [0, 0, -15], speed: 0.026 },
  ], []);

  const handleTreasureCollect = () => {
    setTreasureCollected(true);
    setScore(prev => prev + 100);
    soundManager.playTreasureCollect();
    setTimeout(() => {
      setTreasureCollected(false);
      setTreasurePosition([
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      ]);
    }, 3000);
  };

  const handleStartGame = async () => {
    await soundManager.init();
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', textShadow: '0 0 20px #ff00ff' }}>
          🕷️ Spider Chase 🕷️
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '30px', textAlign: 'center', maxWidth: '600px' }}>
          Run from the spiders and collect the treasure!<br/>
          Use WASD or Arrow Keys to move<br/>
          Touch screen supported for mobile
        </p>
        <button
          onClick={handleStartGame}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a15']} />
        <fog attach="fog" args={['#0a0a15', 30, 60]} />

        <PerspectiveCamera
          makeDefault
          position={[0, 15, 20]}
          fov={70}
          near={0.1}
          far={200}
        />

        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#b7d8ff', '#0a1428', 0.7]} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <pointLight position={[0, 10, 0]} intensity={0.7} distance={55} color="#4a90e2" />
        <pointLight position={[-20, 5, -20]} intensity={0.55} distance={42} color="#e94b3c" />
        <pointLight position={[20, 5, 20]} intensity={0.55} distance={42} color="#50c878" />
        <pointLight position={[0, 8, 16]} intensity={0.75} distance={60} color="#d9f0ff" />

        <Suspense fallback={<LoadingFallback />}>
          <PlayerController 
            onPositionChange={setPlayerPosition}
            treasurePosition={treasurePosition}
            treasureCollected={treasureCollected}
            onTreasureCollect={handleTreasureCollect}
          />
          <Treasure position={treasurePosition} collected={treasureCollected} />
          
          {spiders.map((spider) => (
            <GLBSpider
              key={spider.id}
              position={spider.position}
              playerPosition={playerPosition}
              speed={spider.speed}
            />
          ))}
          
          <Playground />
        </Suspense>

        <EnhancedFloor />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.25} />

        <EffectComposer multisampling={8}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
            opacity={1}
            blendFunction={BlendFunction.ADD}
          />
          <Vignette
            offset={0.35}
            darkness={0.45}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '18px',
          textShadow: '0 0 10px #00ffff, 0 2px 8px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: '1.8',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '20px 25px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 255, 255, 0.3)',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '10px', color: '#00ffff' }}>
          🎮 VR Controls
        </div>
        <div>⌨️ WASD / Arrow Keys - Move</div>
        <div>📱 Touch & Drag - Mobile</div>
        <div>🎥 Dynamic Camera - Auto Follow</div>
        <div>🎯 Score: <span style={{ color: '#ffd700' }}>{score}</span></div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ff6b6b',
          fontFamily: 'monospace',
          fontSize: '16px',
          textShadow: '0 0 10px #ff0000',
          pointerEvents: 'none',
          userSelect: 'none',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '15px 30px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 0, 0, 0.3)',
          animation: 'pulse 2s infinite'
        }}
      >
        🕷️ Spiders are chasing you! Collect the golden treasure! 🏆
      </div>
    </div>
  );
}
