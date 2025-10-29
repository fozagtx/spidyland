# Quick Reference - GLB Asset Loading

## ✅ Checklist Before Deployment

- [ ] GLB files are in `/public` directory
- [ ] GLB files are NOT excluded in `.gitignore`
- [ ] `npm run build` completes successfully
- [ ] GLB files appear in `/dist` directory after build
- [ ] All model loading components have error handling
- [ ] `vercel.json` exists with proper headers

## 📁 File Locations

```
Source (Development):
public/spider.glb
public/creepy_labubu.glb

Build Output (Production):
dist/spider.glb
dist/creepy_labubu.glb
```

## 🔧 Quick Commands

```bash
# Check public assets
ls -lh public/*.glb

# Build project
npm run build

# Verify build output
ls -lh dist/*.glb

# Test in dev mode
npm run dev
# Then visit http://localhost:5173/spider.glb

# Deploy to Vercel
vercel deploy
```

## 🌐 URL Patterns

| Environment | URL Pattern |
|------------|-------------|
| Development | `http://localhost:5173/spider.glb` |
| Production | `https://your-app.vercel.app/spider.glb` |

## 📝 Code Pattern

```javascript
import { useGLTF } from '@react-three/drei';

function ModelComponent() {
  let modelScene = null;
  try {
    const gltf = useGLTF('/model.glb');
    modelScene = gltf.scene;
  } catch (error) {
    console.error('Failed to load model:', error);
  }

  if (!modelScene) {
    return <FallbackMesh />;
  }

  return <primitive object={modelScene.clone()} />;
}
```

## 🐛 Common Issues

### 404 Error
**Problem**: Model returns 404  
**Fix**: Check file is in `public/` and not excluded in `.gitignore`

### Wrong MIME Type
**Problem**: Browser won't load GLB  
**Fix**: Verify `vercel.json` has correct headers

### Works in Dev, Not Production
**Problem**: Loads locally but fails on Vercel  
**Fix**: Run `npm run build` and check `dist/*.glb` exists

## 🔍 Verification

```bash
# After deployment, test with curl:
curl -I https://your-app.vercel.app/spider.glb

# Should return:
# HTTP/1.1 200 OK
# Content-Type: model/gltf-binary
```

## 📦 Asset Sizes

- `spider.glb` - 2.9 MB
- `creepy_labubu.glb` - 18.3 MB

Total: ~21.2 MB of 3D models
