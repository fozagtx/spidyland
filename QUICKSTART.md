# Quick Start Guide

Get the hyper-realistic 3D spider running in minutes!

## Installation

```bash
# Clone the repository
git clone https://github.com/fozagtx/spidyland.git
cd spidyland

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## What You'll See

A hyper-realistic 3D spider with:
- ✨ Physically accurate materials
- 🕷️ Natural joint animations
- 🌫️ Atmospheric volumetric mist
- 🕸️ Animated spider web background
- 🎃 Halloween-themed lighting
- 📸 Cinematic post-processing

## Controls

| Action | Control |
|--------|---------|
| Rotate Camera | Left Mouse Drag |
| Zoom | Mouse Wheel |
| Reset View | Double Click |

## Customization Quick Tips

### Change Spider Colors

Edit `src/TextureGenerator.js`:
```javascript
// Line 14-17 - Albedo gradient
gradient.addColorStop(0, '#YOUR_COLOR_1');
gradient.addColorStop(0.7, '#YOUR_COLOR_2');
```

### Adjust Animation Speed

Edit `src/SpiderModel.jsx`:
```javascript
// Line 180
timeRef.current += 0.016; // Change 0.016 to 0.008 (slower) or 0.032 (faster)
```

### Modify Lighting

Edit `src/Scene.jsx`:
```javascript
// Lines 114-117 - Change colors and positions
<VolumetricLight position={[4, 4, 3]} color="#ff4400" />
```

### Change Post-Processing

Edit `src/Scene.jsx`:
```javascript
// Lines 118-141 - Adjust effect parameters
<Bloom intensity={0.8} />  // Try 0.5 for subtle, 1.5 for intense
```

## Performance Modes

### High Quality (Desktop)
Default settings - no changes needed

### Balanced (Laptop)
In `src/Scene.jsx`:
```javascript
dpr={[1, 1.5]}  // Line 73
shadow-mapSize-width={2048}  // Line 88
```

### Performance (Mobile)
In `src/Scene.jsx`:
```javascript
dpr={[0.75, 1]}  // Line 73
shadow-mapSize-width={1024}  // Line 88
multisampling={4}  // Line 117
```

In `src/Environment.jsx`:
```javascript
for (let i = 0; i < 250; i++)  // Line 106 (reduce mist particles)
for (let i = 0; i < 100; i++)  // Line 210 (reduce ambient particles)
```

## File Structure

```
spidyland/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Root component
│   ├── Scene.jsx             # 3D scene setup ⚡
│   ├── SpiderModel.jsx       # Spider 3D model ⚡
│   ├── Environment.jsx       # Lighting & effects ⚡
│   ├── TextureGenerator.js   # Procedural textures ⚡
│   └── styles.css            # Global styles
├── package.json              # Dependencies
├── vite.config.js           # Build config
├── README.md                 # Project overview
├── PERFORMANCE.md            # Optimization guide
├── TECHNICAL.md              # Technical details
└── QUICKSTART.md            # This file

⚡ = Core 3D files
```

## Common Tasks

### Add More Eyes
In `src/SpiderModel.jsx`, duplicate the eye group and adjust positions.

### Change Number of Legs
In `src/SpiderModel.jsx`:
```javascript
// Line 170
const allLegs = [];
for (let i = 0; i < 4; i++) {  // Change 4 to desired number of leg pairs
```

### Adjust Camera Distance
In `src/Scene.jsx`:
```javascript
// Lines 105-108
<OrbitControls
  minDistance={4}   // Minimum zoom
  maxDistance={15}  // Maximum zoom
/>
```

### Enable/Disable Effects
In `src/Scene.jsx`:
```javascript
// Comment out effects you don't want:
{/* <Bloom ... /> */}
{/* <DepthOfField ... /> */}
```

### Change Background Color
In `src/Scene.jsx`:
```javascript
// Line 77
<color attach="background" args={['#000000']} />
// Try: '#0a0520' (dark purple), '#0f0505' (dark red)
```

## Troubleshooting

### Black Screen
- Check browser console for errors
- Ensure WebGL is supported: visit `get.webgl.org`
- Try disabling post-processing effects

### Low FPS
- Reduce shadow map size
- Lower particle counts
- Disable depth of field effect
- Reduce DPR (device pixel ratio)

### Spider Not Visible
- Check camera position and orbit controls
- Verify spider is at origin [0, 0, 0]
- Disable fog temporarily to debug

### Textures Look Wrong
- Clear browser cache
- Verify canvas API is working
- Check texture generation in DevTools

## Development

### Hot Module Replacement
Vite automatically reloads changes. Edit any file and see updates instantly.

### Debug Mode
Add to `Scene.jsx` for debugging helpers:
```javascript
import { Stats, OrbitControls, Grid } from '@react-three/drei';

<Stats />
<Grid />
<axesHelper args={[5]} />
```

### Performance Monitoring
```javascript
// Add to Scene.jsx
import { Stats } from '@react-three/drei';
<Stats showPanel={0} /> // 0=FPS, 1=MS, 2=MB
```

## Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Deploy (copy dist/ folder to your host)
```

## Resources

- **Three.js Docs**: [threejs.org/docs](https://threejs.org/docs)
- **React Three Fiber**: [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- **PBR Guide**: [marmoset.co/posts/pbr-texture-conversion](https://marmoset.co/posts/pbr-texture-conversion)

## Support

- 📝 Open an issue on GitHub
- 💬 Check existing issues for solutions
- 📧 Contact repository maintainer

## Next Steps

1. ✅ Run the app locally
2. 🎨 Customize colors and lighting
3. ⚙️ Adjust performance settings
4. 📚 Read TECHNICAL.md for deep dive
5. 🚀 Deploy to production

Happy coding! 🕷️✨
