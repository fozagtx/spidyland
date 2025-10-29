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
        fontFamily: 'Arial, sans-serif',
        overflow: 'auto',
        padding: '20px'
      }}>
        <h1 style={{ 
          fontSize: '56px', 
          marginBottom: '30px', 
          textShadow: '0 0 30px #ff00ff, 0 0 60px #ff00ff',
          animation: 'pulse 2s infinite'
        }}>
          🕷️ Spider Chase VR 🕷️
        </h1>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '3px solid rgba(255, 0, 255, 0.5)',
          borderRadius: '20px',
          padding: '30px 40px',
          maxWidth: '700px',
          marginBottom: '30px',
          boxShadow: '0 0 40px rgba(255, 0, 255, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            marginBottom: '20px', 
            color: '#00ffff',
            textAlign: 'center',
            textShadow: '0 0 10px #00ffff'
          }}>
            📖 GAME MANUAL
          </h2>
          
          <div style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '25px' }}>
            <div style={{ 
              fontSize: '22px', 
              color: '#ffaa00', 
              marginBottom: '12px',
              fontWeight: 'bold'
            }}>
              🎮 CONTROLS
            </div>
            <div style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>⌨️ W A S D Keys</span>
                <span style={{ color: '#cccccc' }}> - Move your character</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>⬆️ Arrow Keys</span>
                <span style={{ color: '#cccccc' }}> - Alternative movement</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>📱 Touch & Drag</span>
                <span style={{ color: '#cccccc' }}> - Mobile controls</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>🎥 Camera</span>
                <span style={{ color: '#cccccc' }}> - Auto-follows (VR style)</span>
              </div>
            </div>

            <div style={{ 
              fontSize: '22px', 
              color: '#ff6bff', 
              marginBottom: '12px',
              fontWeight: 'bold'
            }}>
              🎯 OBJECTIVES
            </div>
            <div style={{ paddingLeft: '20px', marginBottom: '20px', color: '#cccccc' }}>
              <div style={{ marginBottom: '8px' }}>
                ✨ <strong style={{ color: '#ffd700' }}>Collect golden treasures</strong> for points (+100 each)
              </div>
              <div style={{ marginBottom: '8px' }}>
                🕷️ <strong style={{ color: '#ff6666' }}>Avoid the spiders</strong> chasing you
              </div>
              <div style={{ marginBottom: '8px' }}>
                🏃 <strong style={{ color: '#66ff66' }}>Survive</strong> as long as possible
              </div>
              <div style={{ marginBottom: '8px' }}>
                🎮 <strong style={{ color: '#00ffff' }}>Master</strong> the physics-based controls
              </div>
            </div>

            <div style={{ 
              fontSize: '22px', 
              color: '#ff8844', 
              marginBottom: '12px',
              fontWeight: 'bold'
            }}>
              ⚠️ TIPS
            </div>
            <div style={{ paddingLeft: '20px', color: '#cccccc' }}>
              <div style={{ marginBottom: '8px' }}>
                💨 Use momentum - movement has realistic physics
              </div>
              <div style={{ marginBottom: '8px' }}>
                👀 Camera follows automatically - focus on movement
              </div>
              <div style={{ marginBottom: '8px' }}>
                🎯 Plan your path to avoid spider clusters
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          style={{
            padding: '25px 50px',
            fontSize: '28px',
            background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
            border: 'none',
            borderRadius: '15px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 0 60px rgba(255, 0, 255, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 40px rgba(255, 0, 255, 0.6)';
          }}
        >
          🎮 Start Game
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
          toneMappingExposure: 0.8,
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

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} distance={50} color="#4a90e2" />
        <pointLight position={[-20, 5, -20]} intensity={0.4} distance={40} color="#e94b3c" />
        <pointLight position={[20, 5, 20]} intensity={0.4} distance={40} color="#50c878" />

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
            offset={0.4}
            darkness={0.8}
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
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: '1.6',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.9))',
          padding: '25px 30px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '3px solid rgba(0, 255, 255, 0.4)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)',
          maxWidth: '320px',
        }}
      >
        <div style={{ 
          fontSize: '26px', 
          marginBottom: '15px', 
          color: '#00ffff',
          fontWeight: 'bold',
          textShadow: '0 0 15px #00ffff, 0 2px 10px rgba(0, 0, 0, 0.8)',
          borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
          paddingBottom: '10px',
        }}>
          📖 GAME MANUAL
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#ffaa00', 
            marginBottom: '8px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ffaa00'
          }}>
            🎮 CONTROLS
          </div>
          <div style={{ paddingLeft: '15px', fontSize: '15px', lineHeight: '1.9' }}>
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>⌨️ W A S D</span>
              <span style={{ color: '#aaaaaa' }}> - Move Player</span>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>⬆️ Arrow Keys</span>
              <span style={{ color: '#aaaaaa' }}> - Move Player</span>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>📱 Touch & Drag</span>
              <span style={{ color: '#aaaaaa' }}> - Mobile Control</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#ff6bff', 
            marginBottom: '8px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ff6bff'
          }}>
            🎯 OBJECTIVE
          </div>
          <div style={{ paddingLeft: '15px', fontSize: '14px', lineHeight: '1.7', color: '#cccccc' }}>
            <div>• Collect golden treasures</div>
            <div>• Avoid the spiders</div>
            <div>• Survive as long as possible</div>
          </div>
        </div>

        <div style={{ 
          borderTop: '2px solid rgba(0, 255, 255, 0.3)',
          paddingTop: '15px',
          marginTop: '15px'
        }}>
          <div style={{ 
            fontSize: '20px', 
            color: '#ffd700',
            fontWeight: 'bold',
            textShadow: '0 0 15px #ffd700'
          }}>
            💰 Score: <span style={{ fontSize: '24px' }}>{score}</span>
          </div>
        </div>
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
