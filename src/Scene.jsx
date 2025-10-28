import React, { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Effects } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { SpiderModel } from './SpiderModel';
import { WebBackground, MistyAtmosphere, HDRILighting, AmbientParticles } from './Environment';
import Spider from './Spider';
import CrackedScreen from './CrackedScreen';

function CameraRig() {
  const cameraRef = useRef();
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current += 0.016;
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(timeRef.current * 0.2) * 0.5;
      cameraRef.current.position.y = 2 + Math.cos(timeRef.current * 0.3) * 0.3;
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, 8]}
      fov={60}
      near={0.1}
      far={500}
    />
  );
}

function Floor() {
  const floorRef = useRef();
  
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, '#e8f4f8');
    gradient.addColorStop(0.5, '#d5e8f0');
    gradient.addColorStop(1, '#c0dde8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 40 + 10;
      const opacity = Math.random() * 0.1;
      
      ctx.fillStyle = `rgba(200, 220, 230, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);
  
  return (
    <mesh ref={floorRef} receiveShadow rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
      <planeGeometry args={[500, 500, 100, 100]} />
      <meshStandardMaterial
        map={floorTexture}
        color="#d0e8f0"
        roughness={0.8}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

function BackgroundPlane() {
  return (
    <mesh position={[0, 2, -50]}>
      <planeGeometry args={[300, 200]} />
      <meshStandardMaterial
        color="#b8d8e8"
        roughness={0.9}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  );
}

export default function Scene() {
  const [spiders, setSpiders] = useState(() => {
    const numSpiders = 5;
    return Array.from({ length: numSpiders }, (_, i) => ({
      id: i,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      initialRotation: Math.random() * 360,
      size: 30 + Math.random() * 20,
      speed: 1 + Math.random() * 2,
    }));
  });

  const [cracks, setCracks] = useState([]);
  const [nextId, setNextId] = useState(5);

  const handleSpiderClick = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    setSpiders((prev) => {
      const clickedSpider = prev.find((s) => s.id === id);
      if (!clickedSpider) return prev;

      const newSpiders = [];
      for (let i = 0; i < 3; i++) {
        newSpiders.push({
          id: nextId + i,
          initialX: x + (Math.random() - 0.5) * 200,
          initialY: y + (Math.random() - 0.5) * 200,
          initialRotation: Math.random() * 360,
          size: 25 + Math.random() * 15,
          speed: 1 + Math.random() * 2,
        });
      }
      
      setNextId(nextId + 3);
      return [...prev, ...newSpiders];
    });
  };

  const handleSpiderDoubleClick = (id, event) => {
    const x = event.clientX;
    const y = event.clientY;
    
    setCracks((prev) => [...prev, { x, y, id: Date.now() }]);
  };

  const handleCrackAnimationComplete = (crackId) => {
    setCracks((prev) => prev.filter(c => c.id !== crackId));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #e8f5f9 0%, #d0e8f5 50%, #b8dde8 100%)' }}>
      <CrackedScreen cracks={cracks} onAnimationComplete={handleCrackAnimationComplete} />
      
      {spiders.map((spider) => (
        <Spider
          key={spider.id}
          initialX={spider.initialX}
          initialY={spider.initialY}
          initialRotation={spider.initialRotation}
          size={spider.size}
          speed={spider.speed}
          onClick={(e) => handleSpiderClick(spider.id, e)}
          onDoubleClick={(e) => handleSpiderDoubleClick(spider.id, e)}
        />
      ))}

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
        <color attach="background" args={['#d8ecf5']} />
        <fog attach="fog" args={['#b8d8e8', 50, 300]} />

        <CameraRig />

        <HDRILighting />

        <Suspense fallback={<LoadingFallback />}>
          <SpiderModel position={[0, 0, 0]} />
        </Suspense>

        <WebBackground />
        <MistyAtmosphere />
        <AmbientParticles />
        <Floor />
        <BackgroundPlane />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={4}
          maxDistance={200}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />

        <EffectComposer multisampling={8}>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            opacity={1}
            blendFunction={BlendFunction.ADD}
          />
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.05}
            bokehScale={3}
            height={480}
          />
          <Vignette
            offset={0.3}
            darkness={0.7}
            blendFunction={BlendFunction.NORMAL}
          />
          <ChromaticAberration
            offset={[0.002, 0.002]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#2c5f7f',
          fontFamily: 'monospace',
          fontSize: '14px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: '1.6',
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '15px 20px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div>Drag</div>
        <div>Scroll</div>
        <div>Click</div>
        <div>Double-Click</div>
      </div>
    </div>
  );
}
