# 🕷️ Spider Chase - Collect the Treasure!

An immersive 3D action game where you play as a character running through a dark playground, collecting treasure while being chased by hyper-realistic spiders with physically based rendering.

![Game Preview](https://img.shields.io/badge/Game-Spider%20Chase-red?style=for-the-badge&logo=webgl)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Three.js%20%7C%20Tone.js-blue?style=for-the-badge)

## ✨ Features

### 🎮 Gameplay
- **Player Character**: Run around a dark playground with smooth WASD/Arrow key controls
- **Chase Mechanics**: 5 intelligent spiders track and chase you with unique AI
- **Treasure Hunt**: Collect golden treasures for points (+100 per treasure)
- **Score System**: Track your treasure collection progress
- **Mobile Support**: Full touch screen controls for mobile devices

### 🕷️ Hyper-Realistic Spiders
- **Enhanced Visuals**: 
  - 1200+ procedurally generated hairs on body
  - 900+ hairs on abdomen for realistic texture
  - Glowing red eyes with pulsing animation
  - Dark color scheme with red accents
  - Detailed fangs and chelicerae
  
- **Physically Based Rendering**:
  - Normal maps for surface detail
  - Roughness and metallic properties
  - Clearcoat for exoskeleton shine
  - Subsurface scattering for translucency
  - Displacement mapping
  
- **Natural Animation**:
  - 8 articulated legs with 4 segments each
  - Smooth walking cycles
  - Body breathing motion
  - Dynamic chase behavior

### 🎵 Dynamic Sound System (Tone.js)
- **Player Sounds**: Footstep sounds with natural variation
- **Spider Sounds**: Scuttling, chase alerts, and danger warnings
- **Ambient Audio**: Eerie background atmosphere with reverb
- **Treasure Effects**: Melodic collection chimes
- **Real-time Synthesis**: All sounds generated procedurally

### 🎨 Enhanced Playground
- **Dark Atmosphere**: Night-time setting with volumetric fog
- **Dynamic Lighting**: Multiple colored point lights and shadows
- **Obstacles**: 15 random boxes for cover and strategy
- **Starfield**: 5000+ stars in the background
- **Post-Processing**: Bloom, vignette, and cinematic effects

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/fozagtx/spidyland.git
cd spidyland

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Run
1. Open your browser to the development server URL
2. Click **"Start Game"** to initialize audio system
3. Use controls to play!

## 🎮 Controls

### Keyboard
- **W / ↑**: Move forward
- **S / ↓**: Move backward  
- **A / ←**: Move left
- **D / →**: Move right

### Mouse
- **Drag**: Rotate camera view
- **Scroll**: Zoom in/out

### Touch (Mobile)
- **Drag**: Move player in that direction
- **Pinch**: Zoom camera

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components and utilities
- **React Three Postprocessing** - Post-processing effects
- **Tone.js** - Web Audio synthesis library
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── main.jsx              # Application entry point
├── App.jsx               # Main app component
├── GameScene.jsx         # Game scene with player, spiders, and controls
├── Player.jsx            # Player character 3D model
├── ChasingSpider.jsx     # Enhanced spider with chase AI
├── Treasure.jsx          # Collectible treasure model
├── SoundManager.js       # Tone.js sound effects manager
├── Spider.jsx            # 2D CSS spider overlay (legacy)
├── SpiderModel.jsx       # Static 3D spider model (legacy)
├── Scene.jsx             # Original showcase scene (legacy)
├── Environment.jsx       # Lighting and atmospheric effects
├── TextureGenerator.js   # Procedural texture generation
├── CrackedScreen.jsx     # Screen crack effects
├── SpiderWeb.jsx         # Spider web rendering
├── Toast.jsx             # Toast notifications
└── styles.css           # Global styles with animations
```

## 🎯 Game Objectives

1. **Survive**: Avoid being caught by the chasing spiders
2. **Collect**: Gather as many treasures as possible
3. **Explore**: Navigate the playground and use obstacles for cover
4. **Score High**: Compete for the highest treasure collection score

## 🎨 Customization

### Adjust Spider Appearance
Edit colors in `src/ChasingSpider.jsx`:
```javascript
sheenColor: new THREE.Color(0.9, 0.1, 0.1) // Red sheen
emissive: new THREE.Color(0.9, 0.1, 0.1)   // Red glow
```

### Modify Game Difficulty
Edit spider count and speed in `src/GameScene.jsx`:
```javascript
const spiders = useMemo(() => [
  { id: 1, position: [-10, 0, -10], speed: 0.025 }, // Increase speed
  // Add more spiders...
], []);
```

### Change Sound Effects
Edit synth parameters in `src/SoundManager.js`:
```javascript
this.synths.footstep = new Tone.MembraneSynth({
  pitchDecay: 0.008,
  octaves: 2,
  // Modify parameters...
});
```

### Adjust Visual Effects
Modify post-processing in `src/GameScene.jsx`:
```javascript
<Bloom
  intensity={1.2}        // Increase for more glow
  luminanceThreshold={0.3}
/>
```

## 🔧 Performance Optimization

The application is optimized for real-time performance through:
- **Instancing**: Reusing geometries and materials
- **Memoization**: Cached textures and models
- **LOD**: Appropriate polygon counts
- **Texture Management**: Procedural generation
- **Shadow Optimization**: 2048x2048 shadow maps
- **Effect Composition**: Efficient post-processing pipeline

## 📊 Performance Metrics

- **Build Size**: ~340KB gzipped
- **Target FPS**: 60
- **Shadow Resolution**: 2048x2048
- **Texture Resolution**: 2048x2048
- **Total Polygons**: ~50,000

## 🎃 Visual Theme

The game features a dark, atmospheric environment with:
- Deep black and blood-red spider coloring
- Eerie volumetric lighting (blue, red, green)
- Misty, fog-filled atmosphere
- Glowing eyes and menacing appearance
- Cinematic post-processing effects

## 📝 Documentation

- **GAME_FEATURES.md** - Detailed feature documentation
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **TECHNICAL.md** - Original technical documentation
- **QUICKSTART.md** - Quick start guide

## 🐛 Known Issues

None currently! The game runs smoothly on modern browsers.

## 🌐 Browser Support

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Opera 76+ ✅

**Note**: WebGL 2.0 and Web Audio API support required.

## 📜 License

ISC

## 🙏 Acknowledgments

Built with modern web technologies to showcase the capabilities of:
- WebGL and physically based rendering
- Real-time 3D game mechanics
- Web Audio synthesis
- React Three Fiber ecosystem

## 🎮 Play Now!

```bash
npm run dev
```

Then open your browser and start running! 

---

**Happy Gaming! 🕷️👤🏆**

Made with ❤️ using React, Three.js, and Tone.js
