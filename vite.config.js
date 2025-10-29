import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-react': ['@react-three/fiber', '@react-three/drei'],
          'three-effects': ['@react-three/postprocessing', 'postprocessing'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 0,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});
