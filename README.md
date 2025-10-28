# 🕷️ Hyper-Realistic 3D Spider - PBR Rendering

An immersive, hyper-realistic 3D spider visualization built with Three.js and React, featuring physically based rendering (PBR), advanced lighting, and cinematic post-processing effects.

## ✨ Features

### Rendering & Materials
- **Physically Based Rendering (PBR)** using Three.js MeshPhysicalMaterial
- **Procedurally Generated Textures** (2048x2048 resolution):
  - Albedo maps with black and deep red color variations
  - Normal maps for surface detail
  - Roughness maps for material properties
  - Ambient occlusion maps for realistic shadows
  - Displacement maps for geometric detail
- **Advanced Material Properties**:
  - Subsurface scattering for translucency
  - Clearcoat for exoskeleton shine
  - Sheen for fine hair reflection
  - Transmission for semi-transparent effects

### Spider Model
- **Detailed Anatomy**:
  - Articulated body with head and abdomen
  - 8 legs with 4 segments each (32 joints total)
  - 800+ reflective hairs on body
  - 600+ hairs on abdomen
  - Realistic eye reflections
- **Natural Animation**:
  - Subtle breathing motion
  - Smooth joint articulation
  - Wave-based leg movement
  - Gentle body rotation

### Lighting & Environment
- **HDRI-Based Lighting Simulation**:
  - Multiple directional lights with soft shadows
  - Volumetric point lights with flickering
  - Hemisphere lighting for ambient fill
  - 4K shadow maps for ray-traced quality
- **Atmospheric Effects**:
  - Volumetric mist with 500 particles
  - Animated spider web background
  - Dynamic fog with distance-based falloff
  - Halloween-themed color grading

### Post-Processing
- **Cinematic Effects**:
  - Bloom for light glow
  - Depth of field for focus
  - Vignette for dramatic framing
  - Chromatic aberration for realism
  - ACES Filmic tone mapping

### Performance
- Optimized for real-time rendering at 60 FPS
- Adaptive pixel ratio (1x-2x)
- Efficient shadow mapping (PCF soft shadows)
- Texture reuse and GPU-side rendering
- Multisampling antialiasing (8x)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

- **Drag**: Rotate camera around spider
- **Scroll**: Zoom in/out
- **Auto-rotation**: Gentle camera movement for cinematic viewing

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components and utilities
- **React Three Postprocessing** - Post-processing effects
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── main.jsx              # Application entry point
├── App.jsx               # Main app component
├── Scene.jsx             # 3D scene setup with camera and composition
├── SpiderModel.jsx       # Spider 3D model with PBR materials
├── Environment.jsx       # Lighting, mist, and web background
├── TextureGenerator.js   # Procedural texture generation
└── styles.css           # Global styles
```

## 🎨 Customization

### Adjust Spider Colors
Edit the color stops in `TextureGenerator.js`:
```javascript
gradient.addColorStop(0, '#1a0505'); // Dark red
gradient.addColorStop(0.7, '#450f0f'); // Deep red
```

### Modify Lighting
Adjust intensity and colors in `Environment.jsx`:
```javascript
<VolumetricLight position={[4, 4, 3]} color="#ff4400" />
```

### Change Animation Speed
Edit the time multiplier in `SpiderModel.jsx`:
```javascript
timeRef.current += 0.016; // Slower: 0.008, Faster: 0.032
```

### Adjust Post-Processing
Modify effect parameters in `Scene.jsx`:
```javascript
<Bloom intensity={0.8} luminanceThreshold={0.2} />
```

## 🎃 Halloween Theme

The spider features a Halloween-inspired aesthetic with:
- Deep black and blood-red coloring
- Eerie volumetric lighting (orange and purple)
- Misty, atmospheric environment
- Dimly lit, haunting ambiance
- Cinematic vignette and glow effects

## 🔧 Performance Optimization

The application is optimized for real-time performance through:
- **Instancing**: Reusing geometries and materials
- **LOD**: Appropriate polygon counts for real-time rendering
- **Texture Management**: Canvas-based procedural generation
- **Shadow Optimization**: Selective shadow casting
- **Effect Composition**: Efficient post-processing pipeline
- **Memory Management**: Proper cleanup on unmount

## 📝 License

ISC

## 🙏 Acknowledgments

Built with modern web technologies to showcase the capabilities of WebGL and physically based rendering in real-time applications.

---

**Happy Halloween! 🎃👻🕷️**
