import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

function LoadingSpinner({ position }) {
  const meshRef = useRef();
  
  useEffect(() => {
    if (meshRef.current) {
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.05;
          requestAnimationFrame(animate);
        }
      };
      const id = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} />
    </mesh>
  );
}

function ModelContent({ modelPath, children, position, scale = [1, 1, 1], onError }) {
  const [error, setError] = useState(null);
  
  let gltf;
  try {
    gltf = useGLTF(modelPath);
  } catch (err) {
    console.error(`Failed to load model at ${modelPath}:`, err);
    setError(err);
    if (onError) onError(err);
  }

  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [gltf]);

  if (error || !gltf?.scene) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" wireframe />
      </mesh>
    );
  }

  return children({ scene: gltf.scene, scale, position });
}

export function ModelLoader({ 
  modelPath, 
  children, 
  fallback = null,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  onError = null
}) {
  const defaultFallback = fallback || <LoadingSpinner position={position} />;

  return (
    <Suspense fallback={defaultFallback}>
      <ModelContent 
        modelPath={modelPath} 
        position={position}
        scale={scale}
        onError={onError}
      >
        {children}
      </ModelContent>
    </Suspense>
  );
}

export function preloadModel(modelPath) {
  return useGLTF.preload(modelPath);
}

export const MODEL_PATHS = {
  SPIDER: '/spider.glb',
  LABUBU: '/creepy_labubu.glb',
};

export function preloadAllModels() {
  Object.values(MODEL_PATHS).forEach(path => {
    try {
      preloadModel(path);
    } catch (err) {
      console.warn(`Failed to preload model at ${path}:`, err);
    }
  });
}
