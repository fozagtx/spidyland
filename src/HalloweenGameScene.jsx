import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { SpiderModel } from './SpiderModel';
import { Firefly } from './Firefly';
import { GhostBat } from './GhostBat';
import { WebShot } from './WebShot';
import { SpookyForest } from './SpookyForest';
import { GameOverScreen } from './GameOverScreen';
import { Leaderboard } from './Leaderboard';
import { soundManager } from './SoundManager';

function SpiderPlayerController({ onPositionChange, onShoot }) {
  const [position, setPosition] = useState([0, 0, 0]);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef({});
  const touchStart = useRef(null);
  const touchMove = useRef(null);
  const cameraOffset = useRef(new THREE.Vector3(0, 12, 15));
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      if (!touchStart.current) return;
      const touch = e.touches[0];
      touchMove.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      touchStart.current = null;
      touchMove.current = null;
    };

    const handleClick = (e) => {
      if (e.target.tagName === 'CANVAS') {
        onShoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
    };
  }, [onShoot]);

  useFrame((state, delta) => {
    const keys = keysPressed.current;
    const moveForce = 12;
    const maxSpeed = 7;
    const friction = 0.88;
    
    const acceleration = new THREE.Vector3(0, 0, 0);

    if (keys['w'] || keys['arrowup']) {
      acceleration.z -= moveForce;
    }
    if (keys['s'] || keys['arrowdown']) {
      acceleration.z += moveForce;
    }
    if (keys['a'] || keys['arrowleft']) {
      acceleration.x -= moveForce;
    }
    if (keys['d'] || keys['arrowright']) {
      acceleration.x += moveForce;
    }

    if (touchStart.current && touchMove.current) {
      const deltaX = touchMove.current.x - touchStart.current.x;
      const deltaY = touchMove.current.y - touchStart.current.y;
      acceleration.x += deltaX * 0.4;
      acceleration.z += deltaY * 0.4;
    }

    velocityRef.current.x += acceleration.x * delta;
    velocityRef.current.z += acceleration.z * delta;

    const currentSpeed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x +
      velocityRef.current.z * velocityRef.current.z
    );

    if (currentSpeed > maxSpeed) {
      velocityRef.current.x = (velocityRef.current.x / currentSpeed) * maxSpeed;
      velocityRef.current.z = (velocityRef.current.z / currentSpeed) * maxSpeed;
    }

    velocityRef.current.multiplyScalar(friction);

    let newX = position[0] + velocityRef.current.x * delta;
    let newZ = position[2] + velocityRef.current.z * delta;

    newX = Math.max(-40, Math.min(40, newX));
    newZ = Math.max(-40, Math.min(40, newZ));

    const newPosition = [newX, 0, newZ];
    setPosition(newPosition);
    
    if (onPositionChange) {
      onPositionChange(newPosition);
    }

    const targetCameraPos = new THREE.Vector3(
      newX + cameraOffset.current.x,
      cameraOffset.current.y,
      newZ + cameraOffset.current.z
    );
    
    camera.position.lerp(targetCameraPos, 0.08);
    
    const lookAtTarget = new THREE.Vector3(newX, 1, newZ);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(lookAtTarget, 0.08);
    camera.lookAt(currentLookAt);
  });

  return <SpiderModel position={position} />;
}

function GameTimer({ timeLeft, onTimeUp }) {
  const timerRef = useRef(timeLeft);

  useFrame((state, delta) => {
    timerRef.current -= delta;
    if (timerRef.current <= 0 && timeLeft > 0) {
      onTimeUp();
    }
  });

  useEffect(() => {
    timerRef.current = timeLeft;
  }, [timeLeft]);

  return null;
}

export default function HalloweenGameScene() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [fireflies, setFireflies] = useState([]);
  const [webShots, setWebShots] = useState([]);
  const timerIntervalRef = useRef(null);

  const bats = useMemo(() => [
    { id: 1, position: [-20, 3, -20] },
    { id: 2, position: [20, 4, -20] },
    { id: 3, position: [-20, 3, 20] },
    { id: 4, position: [20, 4, 20] },
  ], []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const newFireflies = [];
      for (let i = 0; i < 15; i++) {
        newFireflies.push({
          id: i,
          position: [
            (Math.random() - 0.5) * 70,
            Math.random() * 3 + 1,
            (Math.random() - 0.5) * 70
          ],
          collected: false
        });
      }
      setFireflies(newFireflies);

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const handleStartGame = async () => {
    await soundManager.init();
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setTimeLeft(60);
    setFireflies([]);
    setWebShots([]);
  };

  const handleShoot = () => {
    const direction = new THREE.Vector3(0, 0, -1);
    const newWebShot = {
      id: Date.now(),
      startPosition: [playerPosition[0], 1, playerPosition[2]],
      direction: { x: direction.x, y: direction.y, z: direction.z }
    };
    setWebShots(prev => [...prev, newWebShot]);
    soundManager.playFootstep();
  };

  const handleWebHitFirefly = (webShotId, fireflyIndex) => {
    setFireflies(prev => {
      const newFireflies = [...prev];
      if (!newFireflies[fireflyIndex].collected) {
        newFireflies[fireflyIndex].collected = true;
        setScore(s => s + 1);
        soundManager.playTreasureCollect();
        
        setTimeout(() => {
          setFireflies(current => {
            const updated = [...current];
            updated[fireflyIndex] = {
              id: fireflyIndex,
              position: [
                (Math.random() - 0.5) * 70,
                Math.random() * 3 + 1,
                (Math.random() - 0.5) * 70
              ],
              collected: false
            };
            return updated;
          });
        }, 2000);
      }
      return newFireflies;
    });

    setWebShots(prev => prev.filter(ws => ws.id !== webShotId));
  };

  const handleBatCollision = () => {
    setScore(prev => Math.max(0, prev - 2));
  };

  if (!gameStarted) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0a00 0%, #330a00 50%, #1a0500 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: "'Creepster', cursive, sans-serif"
      }}>
        <h1 style={{
          fontSize: '64px',
          marginBottom: '20px',
          textShadow: '0 0 30px #ff6600, 0 0 60px #ff3300',
          color: '#ff6600',
          fontFamily: "'Creepster', cursive"
        }}>
          🎃 Spidyland 🎃
        </h1>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '30px',
          color: '#ffaa00',
          textShadow: '0 0 20px #ff9900'
        }}>
          The Web of Fortune
        </h2>
        <div style={{
          fontSize: '18px',
          marginBottom: '30px',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: '1.8',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
          borderRadius: '15px',
          border: '2px solid #ff6600'
        }}>
          <p>🕷️ Control a spider in a haunted forest</p>
          <p>🔥 Click to shoot webs and catch glowing fireflies</p>
          <p>👻 Avoid ghost bats - they steal your score!</p>
          <p>⏱️ 60 seconds to catch as many as you can</p>
          <p>💰 Earn $SPDR tokens on Somnia blockchain</p>
          <br/>
          <p><strong>Controls:</strong></p>
          <p>🎮 WASD or Arrow Keys to move</p>
          <p>🖱️ Click to shoot web</p>
          <p>📱 Touch supported on mobile</p>
        </div>
        <button
          onClick={handleStartGame}
          style={{
            padding: '20px 50px',
            fontSize: '28px',
            background: 'linear-gradient(45deg, #ff6600, #ff9933)',
            border: 'none',
            borderRadius: '15px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 40px rgba(255, 102, 0, 0.7)',
            transition: 'transform 0.2s',
            fontFamily: "'Creepster', cursive"
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🎮 Start Hunt
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
          toneMappingExposure: 0.6,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0508']} />
        <fog attach="fog" args={['#0a0508', 20, 50]} />

        <PerspectiveCamera
          makeDefault
          position={[0, 12, 15]}
          fov={70}
          near={0.1}
          far={200}
        />

        <ambientLight intensity={0.2} color="#4411aa" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.4}
          color="#ff6600"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <pointLight position={[0, 8, 0]} intensity={0.8} distance={40} color="#ff6600" />
        <pointLight position={[-20, 5, -20]} intensity={0.6} distance={30} color="#9933ff" />
        <pointLight position={[20, 5, 20]} intensity={0.6} distance={30} color="#ff3300" />

        <Suspense fallback={null}>
          <SpiderPlayerController 
            onPositionChange={setPlayerPosition}
            onShoot={handleShoot}
          />

          {fireflies.map((firefly) => (
            <Firefly
              key={firefly.id}
              id={firefly.id}
              position={firefly.position}
              collected={firefly.collected}
            />
          ))}

          {bats.map((bat) => (
            <GhostBat
              key={bat.id}
              startPosition={bat.position}
              playerPosition={playerPosition}
              onCollision={handleBatCollision}
            />
          ))}

          {webShots.map((webShot) => (
            <WebShot
              key={webShot.id}
              startPosition={webShot.startPosition}
              direction={webShot.direction}
              fireflies={fireflies}
              onHitFirefly={(fireflyIndex) => handleWebHitFirefly(webShot.id, fireflyIndex)}
              onComplete={() => setWebShots(prev => prev.filter(ws => ws.id !== webShot.id))}
            />
          ))}

          <SpookyForest />
        </Suspense>

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

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

        {!gameOver && <GameTimer timeLeft={timeLeft} onTimeUp={() => setGameOver(true)} />}
      </Canvas>

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#ffffff',
        fontFamily: "'Creepster', cursive",
        fontSize: '20px',
        textShadow: '0 0 15px #ff6600, 0 2px 8px rgba(0, 0, 0, 0.8)',
        pointerEvents: 'none',
        userSelect: 'none',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px 25px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(255, 102, 0, 0.5)',
      }}>
        <div style={{ fontSize: '28px', marginBottom: '10px', color: '#ff6600' }}>
          🔥 Score: <span style={{ color: '#ffaa00' }}>{score}</span>
        </div>
        <div style={{ fontSize: '24px', color: timeLeft <= 10 ? '#ff3300' : '#ffcc66' }}>
          ⏱️ Time: {timeLeft}s
        </div>
      </div>

      <Leaderboard />

      {gameOver && (
        <GameOverScreen
          score={score}
          onPlayAgain={handlePlayAgain}
          onClose={() => setGameOver(false)}
        />
      )}
    </div>
  );
}
