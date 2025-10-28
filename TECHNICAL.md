# Technical Implementation Details

## Physically Based Rendering (PBR)

### Material System

#### MeshPhysicalMaterial Properties
The spider uses Three.js's `MeshPhysicalMaterial`, which extends `MeshStandardMaterial` with additional physical properties:

```javascript
{
  // Base PBR properties
  map: albedoTexture,              // Base color/albedo
  normalMap: normalTexture,        // Surface detail (tangent space)
  normalScale: [1.5, 1.5],        // Normal map intensity
  roughnessMap: roughnessTexture,  // Microsurface roughness
  roughness: 0.4,                  // Base roughness value
  metalness: 0.2,                  // Metallic property
  aoMap: aoTexture,                // Ambient occlusion
  aoMapIntensity: 1.5,            // AO strength
  
  // Advanced physical properties
  clearcoat: 0.3,                  // Clear coat layer (exoskeleton)
  clearcoatRoughness: 0.4,        // Clear coat roughness
  transmission: 0.05,              // Light transmission (SSS)
  thickness: 0.5,                  // Material thickness
  ior: 1.45,                       // Index of refraction
  sheen: 0.5,                      // Fabric-like reflection
  sheenRoughness: 0.8,            // Sheen roughness
  sheenColor: [0.8, 0.1, 0.1],   // Sheen tint (red)
  
  // Environment
  envMapIntensity: 1.2,           // Environment reflection strength
  displacementMap: dispTexture,   // Geometric displacement
  displacementScale: 0.05,        // Displacement amount
}
```

### Subsurface Scattering (SSS)

Achieved through a combination of:
1. **Transmission**: Light passing through material
2. **Thickness**: Controls light penetration depth
3. **IOR**: Refractive index for realistic light bending
4. **Sheen**: Back-scattering for fabric-like appearance

### Texture Generation

#### Procedural Albedo Map
```javascript
createAlbedoMap(2048) {
  // 1. Radial gradient (black to deep red)
  // 2. 800 random spots (color variation)
  // 3. 300 hair-like strokes (detail)
  // Result: Organic, realistic base color
}
```

#### Procedural Normal Map
```javascript
createNormalMap(2048) {
  // 1. Base normal color (#8080ff = flat surface)
  // 2. 1000 bumps (surface irregularities)
  // 3. 500 hair grooves (fine detail)
  // Result: Tangent-space normals for lighting
}
```

#### Procedural Roughness Map
```javascript
createRoughnessMap(2048) {
  // 1. Medium gray base (#404040)
  // 2. 1500 variation spots
  // Result: Non-uniform surface reflection
}
```

#### Procedural AO Map
```javascript
createAOMap(2048) {
  // 1. Light gray base
  // 2. 200 dark spots (crevice darkening)
  // Result: Ambient occlusion for depth
}
```

#### Procedural Displacement Map
```javascript
createDisplacementMap(2048) {
  // 1. Mid-gray base
  // 2. 800 height variations
  // Result: Actual geometry displacement
}
```

## Spider Anatomy

### Body Structure
```
Spider
├── Body (Head + Thorax)
│   ├── Geometry: Sphere(0.5, 64, 64)
│   ├── Hairs: 800 individual cylinders
│   └── Material: Full PBR with SSS
├── Abdomen
│   ├── Geometry: Ellipsoid(0.7, scaled)
│   ├── Hairs: 600 individual cylinders
│   └── Material: Full PBR with SSS
├── Legs (8x, each with 4 segments)
│   ├── Segment 1: Cylinder(0.12, 0.8)
│   ├── Segment 2: Cylinder(0.10, 1.0)
│   ├── Segment 3: Cylinder(0.08, 1.2)
│   └── Segment 4: Cylinder(0.06, 0.6)
├── Eyes (2x)
│   ├── Outer: Sphere(0.09) - Dark reflective
│   ├── Inner: Sphere(0.06) - Translucent red
│   └── Material: High metalness + emission
└── Fangs (2x)
    └── Geometry: Tapered cylinder(0.03-0.01, 0.25)
```

### Animation System

#### Joint Animation
```javascript
// Wave-based leg movement
for each leg:
  phase = (legIndex / 8) * 2π
  wave = time * 1.5
  
  segment1.rotation.z = sin(wave + phase) * 0.15
  segment2.rotation.z = sin(wave + phase + 0.5) * 0.2
  segment3.rotation.z = sin(wave + phase + 1.0) * 0.25
  segment4.rotation.z = sin(wave + phase + 1.5) * 0.15
```

#### Body Animation
```javascript
// Breathing and subtle movement
group.rotation.y = sin(time * 0.3) * 0.2
group.position.y = baseY + sin(time * 0.5) * 0.05
body.rotation.x = sin(time * 0.8) * 0.02
body.rotation.z = cos(time * 0.6) * 0.02
abdomen.rotation.x = sin(time * 1.2) * 0.03
abdomen.position.z = -1.0 + sin(time * 0.7) * 0.05
```

## Lighting System

### HDRI Simulation

No actual HDRI image used - simulated through multiple light sources:

```javascript
// Ambient base
<ambientLight intensity={0.15} color="#1a0f2e" />

// Main directional (sun-like)
<directionalLight 
  position={[5, 10, 5]}
  intensity={0.4}
  color="#ff8844"
  castShadow
  shadowMapSize={4096}
/>

// Fill directional
<directionalLight
  position={[-5, 8, -5]}
  intensity={0.25}
  color="#4422ff"
  castShadow
  shadowMapSize={2048}
/>

// Hemisphere (ground bounce)
<hemisphereLight
  skyColor="#0a0515"
  groundColor="#1a0505"
  intensity={0.3}
/>

// Volumetric point lights (3x)
<pointLight
  position={[4, 4, 3]}
  color="#ff4400"
  intensity={1.5 + sin(time) * 0.3}  // Flickering
  distance={15}
  decay={2}
  castShadow
/>
```

### Shadow Mapping

#### Ray-Traced Quality Shadows
- **Algorithm**: PCF (Percentage Closer Filtering) Soft Shadow Map
- **Quality**: Soft penumbra simulation
- **Resolution**: 4096x4096 for main light
- **Radius**: 4-pixel blur for soft edges
- **Bias**: -0.0001 to prevent acne
- **Range**: Near=0.1, Far=50

```javascript
shadow-mapSize-width={4096}
shadow-mapSize-height={4096}
shadow-camera-near={0.1}
shadow-camera-far={50}
shadow-bias={-0.0001}
shadow-radius={4}
```

## Environment Effects

### Volumetric Mist

#### Implementation
```glsl
// Vertex Shader
pos.y += sin(time * 0.3 + position.y * 0.1) * 0.5;
pos.z += cos(time * 0.2 + position.x * 0.1) * 0.5;
gl_PointSize = scale * (300.0 / -mvPosition.z);

// Fragment Shader
float dist = length(gl_PointCoord - 0.5);
if (dist > 0.5) discard;
float alpha = (1.0 - dist * 2.0) * 0.3 * scale;
gl_FragColor = vec4(mistColor, alpha);
```

- **Particles**: 500 point sprites
- **Movement**: Sine/cosine wave animation
- **Blending**: Normal blending for fog effect
- **Size**: Distance-based scaling

### Spider Web

#### Geometry
```javascript
// Radial web structure
numSpokes = 24  // Radial lines
numRings = 12   // Circular threads
maxRadius = 8

// Generate vertices
for each ring:
  for each spoke:
    angle = (spoke / numSpokes) * 2π
    radius = (ring / numRings) * maxRadius
    position = [cos(angle) * radius, sin(angle) * radius, z]
    
// Connect with line segments
```

#### Animation
```glsl
// Vertex Shader - Wave effect
float dist = length(pos.xy - center);
float wave = sin(time * 2.0 + dist * 0.5) * 0.05;
pos.z += wave;

// Fragment Shader - Shimmer
float shimmer = 0.7 + 0.3 * sin(time * 2.0);
float alpha = opacity * (1.0 - distance / maxRadius) * 0.7;
gl_FragColor = vec4(webColor * shimmer, alpha);
```

### Ambient Particles

- **Count**: 200 colored particles
- **Colors**: 30% orange/red, 70% purple/blue
- **Animation**: Sine wave movement
- **Blending**: Additive for glow effect
- **Glow**: Procedural based on distance from center

## Post-Processing Pipeline

### Effect Chain

```javascript
<EffectComposer multisampling={8}>
  // 1. Bloom - Light glow
  <Bloom
    intensity={0.8}
    luminanceThreshold={0.2}  // Only bright areas
    luminanceSmoothing={0.9}
    height={300}
    blendFunction={BLEND.ADD}
  />
  
  // 2. Depth of Field - Focus blur
  <DepthOfField
    focusDistance={0.02}      // Focus on spider
    focalLength={0.05}
    bokehScale={3}
    height={480}
  />
  
  // 3. Vignette - Dark edges
  <Vignette
    offset={0.3}
    darkness={0.7}
    blendFunction={BLEND.NORMAL}
  />
  
  // 4. Chromatic Aberration - Color fringing
  <ChromaticAberration
    offset={[0.002, 0.002]}
    blendFunction={BLEND.NORMAL}
  />
</EffectComposer>
```

### Tone Mapping

```javascript
toneMapping: THREE.ACESFilmicToneMapping
toneMappingExposure: 1.2
```

**ACES Filmic**: Cinematic look with natural color response
- Preserves color hue
- Smooth highlights rolloff
- Increased contrast in midtones
- Industry standard for film

## Camera System

### Dynamic Camera Rig
```javascript
// Subtle automatic movement
camera.position.x = sin(time * 0.2) * 0.5
camera.position.y = 2 + cos(time * 0.3) * 0.3

// Orbital controls
enablePan: false
enableZoom: true
minDistance: 4
maxDistance: 15
minPolarAngle: π/4
maxPolarAngle: π/2
target: [0, 0, 0]
```

### FOV & Projection
```javascript
fov: 45°              // Natural perspective
near: 0.1            // Close clipping
far: 100             // Far clipping
aspect: auto         // Responsive
```

## Optimization Strategies

### Geometry Reuse
- Single material instance for all legs
- Shared hair material
- Instanced geometry where possible

### Texture Management
- Canvas-based generation (no file loading)
- Proper wrapping modes
- Mipmapping enabled
- Filtered sampling

### Render Optimization
- Frustum culling (automatic)
- Backface culling (automatic)
- Selective shadow casting
- Efficient shader programs

### Memory Management
```javascript
useEffect(() => {
  return () => {
    // Cleanup on unmount
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

## Browser Rendering Pipeline

```
JavaScript (React/Three.js)
    ↓
Scene Graph Construction
    ↓
Matrix Calculations
    ↓
Frustum Culling
    ↓
Shadow Map Rendering
    ↓
Main Scene Rendering
    ↓
Post-Processing Effects
    ↓
Tone Mapping
    ↓
Color Space Conversion
    ↓
Display (60 FPS target)
```

## WebGL State Management

- **Minimal state changes**: Batched renders
- **Texture units**: Efficient binding
- **Shader programs**: Cached and reused
- **Buffer management**: Static where possible
- **Blend modes**: Optimized switching

## Future Technical Improvements

1. **Real HDRI**: Load .hdr environment maps
2. **Screen-Space Reflections**: Enhanced realism
3. **Global Illumination**: Light bouncing
4. **Advanced SSS**: Subsurface ray marching
5. **Fur System**: Geometry-based hair
6. **Physics**: Realistic leg IK
7. **LOD System**: Distance-based detail
8. **Texture Streaming**: Progressive loading
