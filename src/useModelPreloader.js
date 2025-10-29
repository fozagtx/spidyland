import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

export const MODEL_PATHS = {
  SPIDER: '/spider.glb',
  LABUBU: '/creepy_labubu.glb',
};

export function useModelPreloader() {
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const preloadModels = async () => {
      const loadErrors = {};
      
      for (const [key, path] of Object.entries(MODEL_PATHS)) {
        try {
          await new Promise((resolve, reject) => {
            useGLTF.preload(
              path,
              () => {
                console.log(`✅ Preloaded model: ${path}`);
                resolve();
              },
              (error) => {
                console.error(`❌ Failed to preload model ${path}:`, error);
                loadErrors[key] = error;
                reject(error);
              }
            );
          });
        } catch (error) {
          console.warn(`Continuing despite preload error for ${path}`);
          loadErrors[key] = error;
        }
      }

      setErrors(loadErrors);
      setLoaded(true);
    };

    preloadModels();
  }, []);

  return { loaded, errors, hasErrors: Object.keys(errors).length > 0 };
}

export function preloadModel(modelPath) {
  return new Promise((resolve, reject) => {
    try {
      useGLTF.preload(modelPath);
      resolve();
    } catch (error) {
      console.error(`Failed to preload model: ${modelPath}`, error);
      reject(error);
    }
  });
}

export function preloadAllModels() {
  return Promise.allSettled(
    Object.values(MODEL_PATHS).map(path => preloadModel(path))
  );
}
