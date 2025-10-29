import { useEffect, useState } from 'react';
import { loadGLTF } from './utils/glbLoader';

export const MODEL_PATHS = {
  SPIDER: '/spider.glb',
  LABUBU: '/creepy_labubu.glb',
};

export function useModelPreloader() {
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    const entries = Object.entries(MODEL_PATHS);

    Promise.allSettled(entries.map(([, path]) => loadGLTF(path)))
      .then((results) => {
        if (!isMounted) {
          return;
        }

        const loadErrors = {};

        results.forEach((result, index) => {
          const [key, path] = entries[index];

          if (result.status === 'fulfilled') {
            console.log(`✅ Preloaded model: ${path}`);
          } else {
            console.error(`❌ Failed to preload model ${path}:`, result.reason);
            loadErrors[key] = result.reason;
          }
        });

        setErrors(loadErrors);
        setLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { loaded, errors, hasErrors: Object.keys(errors).length > 0 };
}

export function preloadModel(modelPath) {
  return loadGLTF(modelPath)
    .then(() => undefined)
    .catch((error) => {
      console.error(`Failed to preload model: ${modelPath}`, error);
      throw error;
    });
}

export function preloadAllModels() {
  return Promise.allSettled(
    Object.values(MODEL_PATHS).map((path) => preloadModel(path))
  );
}
