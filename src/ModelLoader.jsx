import React, { useState, useEffect, useRef } from 'react';
import { loadGLTF, cloneGLTFScene, applyMeshDefaults } from './utils/glbLoader';

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

function ModelContent({ modelPath, children, position, scale = [1, 1, 1], onError, fallback }) {
  const [scene, setScene] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let isMounted = true;

    setScene(null);
    setError(null);
    setLoading(true);

    loadGLTF(modelPath)
      .then((gltf) => {
        if (!isMounted) {
          return;
        }

        try {
          const preparedScene = cloneGLTFScene(gltf);
          applyMeshDefaults(preparedScene);
          setScene(preparedScene);
          setError(null);
        } catch (cloneError) {
          console.error(`Failed to prepare model at ${modelPath}:`, cloneError);
          if (onErrorRef.current) {
            onErrorRef.current(cloneError);
          }
          setScene(null);
          setError(cloneError);
        }
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        console.error(`Failed to load model at ${modelPath}:`, err);
        if (onErrorRef.current) {
          onErrorRef.current(err);
        }
        setScene(null);
        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modelPath]);

  if (loading) {
    return fallback || null;
  }

  if (error || !scene) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" wireframe />
      </mesh>
    );
  }

  return children({ scene, scale, position });
}

export function ModelLoader({ 
  modelPath, 
  children, 
  fallback,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  onError = null
}) {
  const fallbackContent = fallback !== undefined ? fallback : <LoadingSpinner position={position} />;

  return (
    <ModelContent 
      modelPath={modelPath} 
      position={position}
      scale={scale}
      onError={onError}
      fallback={fallbackContent}
    >
      {children}
    </ModelContent>
  );
}

export function preloadModel(modelPath) {
  return loadGLTF(modelPath)
    .then(() => undefined)
    .catch((error) => {
      console.warn(`Failed to preload model at ${modelPath}:`, error);
      throw error;
    });
}

export const MODEL_PATHS = {
  SPIDER: '/spider.glb',
  LABUBU: '/creepy_labubu.glb',
};

export function preloadAllModels() {
  return Promise.allSettled(
    Object.values(MODEL_PATHS).map((path) => preloadModel(path))
  );
}
