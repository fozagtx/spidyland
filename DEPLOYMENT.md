# Deployment Guide

## GLB Asset Loading on Vercel

This project uses `.glb` (GL Transmission Format Binary) files for 3D models. These assets must be properly configured to load in both development and production environments.

## Asset Configuration

### Files Structure
```
public/
├── spider.glb (2.9 MB)
├── creepy_labubu.glb (18.3 MB)
└── README.md
```

### How Assets Are Loaded

1. **Development**: 
   - Vite serves files from `/public` at the root URL
   - Models accessible at `http://localhost:5173/spider.glb`

2. **Production Build**:
   - `npm run build` copies files from `/public` to `/dist`
   - Models included in deployment bundle

3. **Vercel Deployment**:
   - All files in `/dist` are deployed
   - Models accessible at `https://your-app.vercel.app/spider.glb`

## Vite Configuration

The `vite.config.js` includes:

```javascript
export default defineConfig({
  publicDir: 'public',  // Explicitly set public directory
  build: {
    assetsInlineLimit: 0,  // Don't inline any assets (important for large GLB files)
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],  // Recognize GLB files as assets
})
```

## Vercel Configuration

The `vercel.json` includes:

```json
{
  "headers": [
    {
      "source": "/(.*)\\.(glb|gltf)",
      "headers": [
        {
          "key": "Content-Type",
          "value": "model/gltf-binary"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

This ensures:
- Correct MIME type for GLB files
- Proper caching headers
- Optimal performance

## Code Implementation

### Loading Models with Error Handling

All GLB loaders now include proper error handling:

```javascript
import { useGLTF } from '@react-three/drei';

let modelScene = null;
try {
  const gltf = useGLTF('/spider.glb');
  modelScene = gltf.scene;
} catch (error) {
  console.error('Failed to load model:', error);
}

// Show fallback if model fails to load
if (!modelScene) {
  return <FallbackMesh />;
}
```

### Components Updated

- `GLBSpider.jsx` - Spider enemy with fallback to RealisticSpider
- `LabubuPlayer.jsx` - Player character with fallback sphere mesh
- `SpiderEnemy.jsx` - Enemy AI with fallback wireframe sphere
- `GLBPlatform.jsx` - Platform loader with null fallback

## Deployment Steps

1. **Ensure assets are in place**:
   ```bash
   ls -lh public/*.glb
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Verify assets in dist**:
   ```bash
   ls -lh dist/*.glb
   ```
   
   You should see:
   - `spider.glb` (~2.9 MB)
   - `creepy_labubu.glb` (~18.3 MB)

4. **Deploy to Vercel**:
   ```bash
   vercel deploy
   ```
   or push to GitHub and let Vercel auto-deploy

5. **Test deployed assets**:
   ```bash
   curl -I https://your-app.vercel.app/spider.glb
   curl -I https://your-app.vercel.app/creepy_labubu.glb
   ```

## Troubleshooting

### 404 Errors for GLB Files

**Problem**: Models return 404 in production

**Solution**:
1. Check `.gitignore` - ensure `public/*.glb` is NOT excluded
2. Verify files exist in `public/` directory
3. Run build and check `dist/` directory contains GLB files
4. Check Vercel build logs for file copy operations

### Wrong MIME Type

**Problem**: Browser won't load GLB files due to MIME type

**Solution**: Ensure `vercel.json` includes proper headers (already configured)

### Models Load in Dev But Not Production

**Problem**: Works locally but fails on Vercel

**Solution**:
1. Check paths use leading slash: `/spider.glb` not `spider.glb`
2. Verify files are in the build output
3. Check browser network tab for actual error
4. Review Vercel deployment logs

### Large File Size Issues

**Problem**: Deployment is slow or fails due to file size

**Solution**:
1. Consider compressing GLB files with tools like `gltf-pipeline`
2. Use CDN for very large models
3. Implement lazy loading for models not immediately needed

## Performance Optimization

### Model Preloading

Models can be preloaded during app initialization:

```javascript
import { useGLTF } from '@react-three/drei';

// Preload models
useGLTF.preload('/spider.glb');
useGLTF.preload('/creepy_labubu.glb');
```

### Caching Strategy

The `vercel.json` configuration sets cache headers for 1 year:
- Models are cached by browsers after first load
- Subsequent visits load instantly
- Use cache-busting (rename files) for model updates

## Testing Assets

Use the `AssetTest` component to verify asset accessibility:

```javascript
import { AssetTest } from './src/AssetTest';

// Add to your app temporarily
<AssetTest />
```

This will display the status of all GLB assets in the top-right corner.

## Additional Resources

- [Vite Static Assets](https://vitejs.dev/guide/assets.html)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [glTF Format](https://www.khronos.org/gltf/)
