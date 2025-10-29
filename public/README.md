# Public Assets

This directory contains 3D model files and other static assets served by Vite.

## 3D Models (GLB)

- `spider.glb` - Spider enemy model (2.9 MB)
- `creepy_labubu.glb` - Labubu player character model (18.3 MB)

These models are loaded via relative paths in the application:
- `/spider.glb` - Referenced in GLBSpider.jsx and SpiderEnemy.jsx
- `/creepy_labubu.glb` - Referenced in LabubuPlayer.jsx

### How It Works

1. **Development**: Vite serves files from `/public` at the root path
2. **Production**: Files are copied to the build output and served from the domain root
3. **Deployment**: On Vercel, these files are accessible at `https://your-app.vercel.app/spider.glb`

### Adding New Models

Place `.glb` or `.gltf` files directly in this directory. Reference them with leading slash:
```javascript
useGLTF('/your-model.glb')
```

The game will automatically use fallback meshes if models fail to load.

See [DOWNLOAD_MODEL.md](../DOWNLOAD_MODEL.md) for instructions on obtaining models.
