import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { LabubuPlayerController } from './LabubuPlayerController';
import { SpiderEnemy } from './SpiderEnemy';
import { GlowingOrb } from './GlowingOrb';
import { Totem } from './Totem';
import { WebTrap } from './WebTrap';
import { CaveArena, ExitPortal } from './CaveArena';
import { soundManager } from './SoundManager';

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function LabubuGameScene() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState('playing');
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [orbs, setOrbs] = useState([]);
  const [totems, setTotems] = useState([]);
  const [webTraps, setWebTraps] = useState([]);
  const [spiderTrapped, setSpiderTrapped] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [lightRadius, setLightRadius] = useState(5);
  const [dashCooldown, setDashCooldown] = useState(0);

  const spiderPatrolPoints = useMemo(() => [
    [10, 0, 10],
    [10, 0, -10],
    [-10, 0, -10],
    [-10, 0, 10],
  ], []);

  useEffect(() => {
    if (!gameStarted) return;

    const initialOrbs = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 10 + Math.random() * 10;
      initialOrbs.push({
        position: [Math.cos(angle) * radius, 1, Math.sin(angle) * radius],
        collected: false
      });
    }
    setOrbs(initialOrbs);

    const initialTotems = [
      { position: [15, 0, 0], activated: false },
      { position: [-15, 0, 0], activated: false },
      { position: [0, 0, 15], activated: false },
    ];
    setTotems(initialTotems);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameState]);

  const handleOrbCollect = (index) => {
    const newOrbs = [...orbs];
    if (!newOrbs[index].collected) {
      newOrbs[index].collected = true;
      setOrbs(newOrbs);
      setScore((prev) => prev + 10);
      setSpeedMultiplier((prev) => Math.min(prev + 0.1, 2));
      setLightRadius((prev) => Math.min(prev + 0.5, 15));
      soundManager.playTreasureCollect();
    }
  };

  const handleTotemActivate = (index) => {
    const newTotems = [...totems];
    if (!newTotems[index].activated) {
      newTotems[index].activated = true;
      setTotems(newTotems);
      soundManager.playTreasureCollect();

      setSpiderTrapped(true);
      setTimeout(() => setSpiderTrapped(false), 5000);

      const allActivated = newTotems.every(t => t.activated);
      if (allActivated) {
        setPortalActive(true);
      }
    }
  };

  const handleSpiderAttack = () => {
    if (gameState === 'playing') {
      setScore((prev) => Math.max(0, prev - 10));
      soundManager.playChase();
    }
  };

  const handleSpiderLayWeb = (position) => {
    setWebTraps((prev) => [...prev, { position, collected: false }]);
  };

  const handleStartGame = async () => {
    await soundManager.init();
    setGameStarted(true);
    setGameState('playing');
  };

  const handleRestart = () => {
    setGameState('playing');
    setScore(0);
    setTimer(180);
    setOrbs([]);
    setTotems([]);
    setWebTraps([]);
    setSpiderTrapped(false);
    setPortalActive(false);
    setSpeedMultiplier(1);
    setLightRadius(5);
    setPlayerPosition([0, 0, 0]);
    
    const initialOrbs = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 10 + Math.random() * 10;
      initialOrbs.push({
        position: [Math.cos(angle) * radius, 1, Math.sin(angle) * radius],
        collected: false
      });
    }
    setOrbs(initialOrbs);

    const initialTotems = [
      { position: [15, 0, 0], activated: false },
      { position: [-15, 0, 0], activated: false },
      { position: [0, 0, 15], activated: false },
    ];
    setTotems(initialTotems);
  };

  useEffect(() => {
    if (portalActive && gameState === 'playing') {
      const dx = playerPosition[0] - 0;
      const dz = playerPosition[2] - 0;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < 3) {
        setGameState('won');
        setScore((prev) => prev + 200);
      }
    }
  }, [playerPosition, portalActive, gameState]);

  if (!gameStarted) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a15 0%, #1a0f0f 50%, #2a1a1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '56px', marginBottom: '20px', textShadow: '0 0 20px #ffff00' }}>
          🕷️ Labubu vs. Spider: Web Clash 🕸️
        </h1>
        <div style={{ fontSize: '20px', marginBottom: '30px', textAlign: 'center', maxWidth: '700px', lineHeight: '1.8' }}>
          <p>Escape the enchanted web cave before time runs out!</p>
          <p>🎯 Collect glowing orbs to increase your speed and vision</p>
          <p>⚡ Press SPACE to dash (3s cooldown)</p>
          <p>🗿 Activate totems (press E) to trap the spider</p>
          <p>🚪 Activate all 3 totems to open the exit portal</p>
          <p>🕸️ Avoid spider webs - they slow you down!</p>
        </div>
        <button
          onClick={handleStartGame}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #ff6600, #ffff00)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(255, 255, 0, 0.5)',
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

  if (gameState === 'won') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a4d0a 0%, #1a7a1a 50%, #2aa02a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '64px', marginBottom: '20px', textShadow: '0 0 30px #00ff00' }}>
          🎉 YOU WON! 🎉
        </h1>
        <p style={{ fontSize: '32px', marginBottom: '20px' }}>
          Final Score: {score}
        </p>
        <p style={{ fontSize: '24px', marginBottom: '30px' }}>
          Time Remaining: {timer}s
        </p>
        <button
          onClick={handleRestart}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #00ff00, #00ffff)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #4d0a0a 0%, #7a1a1a 50%, #a02a2a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '64px', marginBottom: '20px', textShadow: '0 0 30px #ff0000' }}>
          💀 GAME OVER 💀
        </h1>
        <p style={{ fontSize: '32px', marginBottom: '20px' }}>
          Final Score: {score}
        </p>
        <p style={{ fontSize: '24px', marginBottom: '30px' }}>
          Time ran out!
        </p>
        <button
          onClick={handleRestart}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #ff0000, #ff6600)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Try Again
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
          toneMappingExposure: 0.5,
          outputColorSpace: THREE.SRGBColorSpace,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#0a0505', 15, 40]} />

        <PerspectiveCamera
          makeDefault
          position={[0, 15, 20]}
          fov={70}
          near={0.1}
          far={200}
        />

        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <pointLight position={[0, 10, 0]} intensity={0.3} distance={30} color="#ff8800" />

        <Suspense fallback={<LoadingFallback />}>
          <LabubuPlayerController 
            onPositionChange={setPlayerPosition}
            onOrbCollect={handleOrbCollect}
            onTotemActivate={handleTotemActivate}
            orbs={orbs}
            totems={totems}
            webTraps={webTraps}
            speedMultiplier={speedMultiplier}
            lightRadius={lightRadius}
          />

          <SpiderEnemy
            position={[10, 0, 10]}
            playerPosition={playerPosition}
            onAttack={handleSpiderAttack}
            isTrapped={spiderTrapped}
            onLayWeb={handleSpiderLayWeb}
            patrolPoints={spiderPatrolPoints}
          />

          {orbs.map((orb, index) => (
            <GlowingOrb
              key={index}
              position={orb.position}
              collected={orb.collected}
            />
          ))}

          {totems.map((totem, index) => (
            <Totem
              key={index}
              position={totem.position}
              activated={totem.activated}
            />
          ))}

          {webTraps.map((trap, index) => (
            <WebTrap
              key={index}
              position={trap.position}
              collected={trap.collected}
            />
          ))}

          <CaveArena />
          <ExitPortal position={[0, 1, 0]} active={portalActive} />
        </Suspense>

        <Stars radius={50} depth={30} count={3000} factor={3} saturation={0} fade speed={0.5} />

        <EffectComposer multisampling={8}>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            opacity={1}
            blendFunction={BlendFunction.ADD}
          />
          <Vignette
            offset={0.3}
            darkness={0.9}
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
          textShadow: '0 0 10px #ffff00, 0 2px 8px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: '1.8',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px 25px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 0, 0.3)',
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '10px', color: '#ffff00' }}>
          🎮 Labubu's Quest
        </div>
        <div>🎯 Score: <span style={{ color: '#ffd700' }}>{score}</span></div>
        <div>⏱️ Time: <span style={{ color: timer < 30 ? '#ff0000' : '#00ff00' }}>{timer}s</span></div>
        <div>⚡ Speed: <span style={{ color: '#00ffff' }}>{speedMultiplier.toFixed(1)}x</span></div>
        <div>💡 Light: <span style={{ color: '#66ccff' }}>{lightRadius.toFixed(1)}m</span></div>
        <div>🗿 Totems: <span style={{ color: '#00ff00' }}>{totems.filter(t => t.activated).length}/3</span></div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '16px',
          textShadow: '0 0 10px #ff6600',
          pointerEvents: 'none',
          userSelect: 'none',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px 30px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 102, 0, 0.3)',
          textAlign: 'center'
        }}
      >
        <div>WASD/Arrows: Move | SPACE: Dash | E: Activate Totem</div>
        {portalActive ? (
          <div style={{ color: '#00ffff', fontSize: '18px', marginTop: '5px' }}>
            🚪 EXIT PORTAL ACTIVE! Reach the center to escape! 🚪
          </div>
        ) : (
          <div style={{ color: '#ff6600', fontSize: '16px', marginTop: '5px' }}>
            🕷️ Collect orbs and activate all totems to open the exit! 🕸️
          </div>
        )}
      </div>
    </div>
  );
}
