# How to Download the Spider Model

The spider GLB model needs to be downloaded manually from Meshy.ai due to authentication requirements.

## Steps to Download:

1. Visit the model page:
   https://www.meshy.ai/3d-models/spider-for-halloween-with-orange-stripes-and-tooth-that-are-very-scary-PBR-v2-019901c0-01f1-78be-a5f7-976d32e12437

2. Click the download button on the page to download the GLB file

3. Save the downloaded file as `spider.glb` in the `public` folder of this project

4. The file should be located at: `/public/spider.glb`

## Alternative:

If you have access to the direct download URL or API key, you can use:
```bash
# Place your downloaded spider.glb file in the public folder
cp /path/to/your/spider.glb ./public/spider.glb
```

## Fallback:

If the GLB file is not available, the game will use a simple placeholder spider model (orange sphere with glow effect) until the GLB is added.

## File Structure:

The GLB file should contain:
- A realistic spider model with animations
- Optional platform/playground elements
- PBR materials with textures
