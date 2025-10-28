# 🎮 Spider Chase - Game Features

## Overview
An immersive 3D action game where you play as a character running through a dark playground, collecting treasure while being chased by realistic, hyper-detailed spiders with PBR rendering.

## 🕹️ Gameplay Features

### Player Character
- **Colorful 3D Model**: Blue capsule body with golden head
- **Smooth Movement**: WASD or Arrow keys for keyboard control
- **Touch Support**: Full touch screen support for mobile devices
- **Dynamic Animation**: Bobbing motion while moving with footstep sounds
- **Glowing Effect**: Blue point light follows the player

### Treasure System
- **Golden Chest**: Rotating, floating treasure with glowing effect
- **Dynamic Spawning**: Respawns at random locations after collection
- **Score Tracking**: +100 points per treasure collected
- **Visual Feedback**: Multi-colored gems and golden glow
- **Sound Effects**: Pleasant melodic chime on collection

### Chasing Spiders (5 Active)
- **Enhanced Realism**: 
  - 1200+ individual hairs on body
  - 900+ hairs on abdomen
  - Glowing red eyes with pulsing animation
  - Detailed fangs and chelicerae
  - 8 articulated legs with 4 segments each
  - Dark, menacing color scheme (black with red accents)
  
- **Intelligent AI**: 
  - Tracks and chases player position
  - Variable speeds (0.022 - 0.028 units/frame)
  - Smooth rotation to face player
  - Proximity detection for danger warnings
  
- **Realistic Animation**:
  - Natural leg walking cycles
  - Body breathing motion
  - Abdomen pulsing
  - Enhanced leg movement speed while chasing

### Enhanced Playground
- **Dark Atmosphere**: Night-time setting with volumetric fog
- **Dynamic Lighting**:
  - Directional shadows from moonlight
  - Colored point lights (blue, red, green)
  - Player and treasure glow effects
  - Spider eye illumination
  
- **Environment**:
  - Large procedurally textured floor (100x100 units)
  - 15 random obstacles (boxes) for cover
  - Starfield background (5000 stars)
  - Sky gradient with realistic atmosphere
  - Distance-based fog for depth

### Sound System (Tone.js)
- **Player Sounds**:
  - Footstep sounds (membrane synth)
  - Variable pitch for natural variation
  - Triggered every 0.3 seconds while moving
  
- **Spider Sounds**:
  - Scuttling sounds when moving
  - Chase alert when close to player
  - Danger warning sounds
  - High-pitched creepy tones
  
- **Ambient Audio**:
  - Eerie background drone
  - Low-frequency rumble with reverb
  - Continuous atmospheric loop
  
- **Treasure Sounds**:
  - Melodic ascending chime (C5-E5-G5-C6)
  - Polyphonic synthesis
  - Celebration feel on collection

## 🎮 Controls

### Keyboard
- **W / Up Arrow**: Move forward
- **S / Down Arrow**: Move backward
- **A / Left Arrow**: Move left
- **D / Right Arrow**: Move right

### Mouse
- **Drag**: Rotate camera view
- **Scroll**: Zoom in/out

### Touch (Mobile)
- **Drag**: Move player in that direction
- **Pinch**: Zoom camera

## 🎨 Visual Enhancements

### Post-Processing Effects
- **Bloom**: Glow on lights and emissive materials
- **Vignette**: Dark edges for dramatic framing
- **Antialiasing**: 8x multisampling for smooth edges
- **Tone Mapping**: ACES Filmic for cinematic look

### Spider Improvements
- **PBR Materials**:
  - Normal mapping for surface detail
  - Roughness variation
  - Metallic sheen on exoskeleton
  - Clearcoat for glossy finish
  - Subsurface scattering for translucency
  - Ambient occlusion for depth
  
- **Enhanced Details**:
  - Realistic hair geometry
  - Glowing red eyes with emission
  - Detailed fangs with metallic material
  - Segmented legs with proper joints
  - Textured body with displacement mapping

### Performance Optimizations
- Instanced geometries for hairs
- Memoized textures and materials
- Efficient shadow mapping
- Adaptive pixel ratio (1x-2x)
- Distance-based fog culling

## 🏆 Game Objectives
1. **Survive**: Avoid being caught by the chasing spiders
2. **Collect**: Gather as many treasures as possible
3. **Explore**: Navigate the playground and use obstacles for cover
4. **Score High**: Compete for the highest treasure collection score

## 🎯 Technical Highlights
- Real-time 3D rendering at 60 FPS
- Physically based rendering (PBR) for photorealistic materials
- Dynamic shadows with PCF soft shadow mapping
- Procedural texture generation
- Web Audio API synthesis with Tone.js
- Responsive controls for desktop and mobile
- React Three Fiber for declarative 3D
- Post-processing pipeline with WebGL shaders

## 🚀 Getting Started
1. Click "Start Game" button
2. Sound system initializes (required for Web Audio API)
3. Use WASD or arrow keys to move
4. Collect golden treasures
5. Avoid the chasing spiders!

Enjoy the thrill of the chase! 🕷️👤🏆
