# 🎃 Spidyland: The Web of Fortune

<div align="center">

![Halloween](https://img.shields.io/badge/Theme-Halloween-orange?style=for-the-badge)
![Somnia](https://img.shields.io/badge/Blockchain-Somnia-purple?style=for-the-badge)
![Web3](https://img.shields.io/badge/Web3-Enabled-green?style=for-the-badge)

**A spooky Halloween 3D game where you control a spider catching fireflies to earn $SPDR tokens!**

[Play Now](#getting-started) • [Documentation](./SPIDYLAND_README.md) • [Deploy](./DEPLOYMENT.md)

</div>

---

## 🎮 About

Spidyland is a fast-paced 3D Halloween game built with React Three Fiber and integrated with the Somnia blockchain. Players control a spider in a haunted forest, shooting webs to catch glowing fireflies while avoiding ghost bats. Each firefly caught earns you $SPDR tokens that can be claimed on the Somnia network!

## ✨ Features

### 🕷️ Gameplay
- **3D Spider Character** - Beautifully rendered with animated legs and realistic movement
- **Web Shooting Mechanic** - Click/tap to shoot webs at fireflies
- **Glowing Fireflies** - 15+ collectible fireflies with particle effects
- **Ghost Bats** - Flying enemies that reduce your score on collision
- **60-Second Rounds** - Fast-paced, addictive gameplay
- **Real-time Scoring** - Track your fireflies caught live

### 🌲 Spooky Environment
- **Haunted Forest** - Dead trees, tombstones, and atmospheric fog
- **Jack-o'-Lanterns** - Glowing pumpkins lighting the darkness
- **Dynamic Lighting** - Orange and purple Halloween-themed lights
- **Post-Processing Effects** - Bloom, vignette, and atmospheric rendering
- **Starry Night Sky** - Complete with particle effects

### 💰 Blockchain Integration
- **Somnia Network** - Built on fast, scalable Somnia blockchain
- **$SPDR Token** - Earn tokens for every firefly caught
- **Wallet Connection** - MetaMask and Web3 wallet support
- **Token Claiming** - Mint your earned tokens after each game
- **Leaderboard** - Track top scores locally

### 🎨 Technical Excellence
- **React 18** - Modern React with hooks
- **Three.js** - Advanced 3D graphics
- **React Three Fiber** - Declarative 3D in React
- **Physics-Based Movement** - Smooth, realistic controls
- **Mobile Responsive** - Touch controls for mobile devices
- **Optimized Performance** - 60 FPS gameplay

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MetaMask or Web3 wallet (for blockchain features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/fozagtx/spidyland.git
cd spidyland

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### 🕷️ Optional: Custom Spider GLB Model

The game now supports loading custom 3D spider models in GLB format! 

**To use a custom spider model:**

1. Download the spider GLB model from [Meshy.ai](https://www.meshy.ai/3d-models/spider-for-halloween-with-orange-stripes-and-tooth-that-are-very-scary-PBR-v2-019901c0-01f1-78be-a5f7-976d32e12437)
2. Save it as `spider.glb` in the `public` folder
3. The game will automatically load and use your custom model

**If no GLB file is present**, the game will use a beautiful procedurally-generated spider with:
- Orange stripes and glowing effects
- Scary teeth/fangs
- Realistic animated legs
- Dynamic lighting

See [DOWNLOAD_MODEL.md](./DOWNLOAD_MODEL.md) for detailed instructions.

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

1. **Start the Game** - Click "Start Hunt" on the main menu
2. **Move Your Spider** - Use WASD or Arrow Keys to navigate
3. **Shoot Webs** - Click anywhere to shoot webs at fireflies
4. **Catch Fireflies** - Hit fireflies with your webs to collect them (+1 $SPDR each)
5. **Avoid Ghost Bats** - Don't let them touch you (-2 points)
6. **Beat the Clock** - Catch as many as possible in 60 seconds
7. **Claim Rewards** - Connect wallet and claim your $SPDR tokens!

### Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move Forward | W or ↑ | Swipe Up |
| Move Backward | S or ↓ | Swipe Down |
| Move Left | A or ← | Swipe Left |
| Move Right | D or → | Swipe Right |
| Shoot Web | Click | Tap |

## 🔗 Blockchain Details

### Somnia Network
- **RPC URL**: https://rpc.somnia.network
- **Chain ID**: 207995 (0x32C7B)
- **Native Token**: SOM
- **Explorer**: https://explorer.somnia.network

### $SPDR Token
- **Contract**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
- **Type**: ERC-20
- **Decimals**: 18
- **Symbol**: SPDR

> **Note**: Current implementation uses a mock contract for demonstration. Deploy an actual contract for production use.

## 📁 Project Structure

```
spidyland/
├── src/
│   ├── GameScene.jsx             # Main game scene (chase mode)
│   ├── HalloweenGameScene.jsx   # Halloween themed game
│   ├── SpiderModel.jsx           # Procedural spider 3D model
│   ├── RealisticSpider.jsx      # Enhanced spider with orange stripes
│   ├── GLBSpider.jsx            # GLB model loader for custom spiders
│   ├── ChasingSpider.jsx        # AI-controlled enemy spider
│   ├── Playground.jsx           # Platform playground environment
│   ├── PlayerController.jsx     # Player movement and physics
│   ├── Player.jsx               # Player visual representation
│   ├── Firefly.jsx              # Collectible fireflies
│   ├── GhostBat.jsx             # Enemy ghost bats
│   ├── WebShot.jsx              # Web projectile
│   ├── SpookyForest.jsx         # Environment components
│   ├── GameOverScreen.jsx       # End game UI
│   ├── Leaderboard.jsx          # High scores
│   ├── TokenContract.js         # Blockchain integration
│   ├── SoundManager.js          # Audio system
│   ├── TextureGenerator.js      # Procedural texture generation
│   └── styles.css               # Halloween styles
├── public/
│   └── spider.glb               # Optional: Custom spider model
├── SPIDYLAND_README.md          # Detailed documentation
├── DOWNLOAD_MODEL.md            # GLB model download guide
├── DEPLOYMENT.md                # Deployment guide
└── package.json                 # Dependencies
```

## 🎨 Tech Stack

- **Frontend Framework**: React 18
- **3D Engine**: Three.js
- **3D React**: React Three Fiber
- **3D Helpers**: React Three Drei
- **Post-Processing**: React Three Postprocessing
- **Audio**: Tone.js
- **Blockchain**: ethers.js v6
- **Build Tool**: Vite
- **Styling**: CSS3 with custom Halloween theme

## 🏆 Leaderboard

The game includes a local leaderboard that tracks:
- Top 10 scores
- Wallet addresses (abbreviated)
- Timestamps
- Transaction hashes

Scores are stored in browser localStorage and persist across sessions.

## 🎃 Halloween Theme

The game features a complete Halloween atmosphere:
- **Colors**: Orange (#ff6600), Purple (#9933ff), Dark tones
- **Font**: 'Creepster' - spooky display font
- **Lighting**: Dim ambient with dramatic colored lights
- **Effects**: Fog, bloom, particle trails, glowing effects
- **Audio**: Spooky ambient sounds and effects
- **Environment**: Dead trees, tombstones, jack-o'-lanterns

## 📚 Documentation

- **[Detailed Game Documentation](./SPIDYLAND_README.md)** - Complete game guide
- **[Deployment Guide](./DEPLOYMENT.md)** - How to deploy to production
- **[Technical Details](./TECHNICAL.md)** - Architecture and implementation
- **[Features Overview](./FEATURES.md)** - All game features explained

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Development Tips

1. **Performance**: Monitor FPS with `stats.js`
2. **Debugging**: Use React DevTools and Three.js Inspector
3. **Hot Reload**: Changes auto-reload during development
4. **Console Logs**: Check for game events and blockchain calls

## 🚀 Deployment

Deploy to various platforms:

- **Vercel**: One-click deploy from GitHub
- **Netlify**: Drag & drop or Git integration
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable cloud hosting
- **Firebase Hosting**: Google's hosting solution

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔐 Security

### Current State (Development)
- ⚠️ Mock smart contract
- ⚠️ Client-side score validation
- ⚠️ Local leaderboard only

### Production Requirements
- ✅ Deploy actual ERC-20 contract
- ✅ Backend API for score verification
- ✅ Cryptographic signature validation
- ✅ Rate limiting and anti-cheat
- ✅ Secure wallet connections (HTTPS)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- Mobile performance may vary on older devices
- Wallet connection requires HTTPS in production
- Leaderboard is local-only (no global rankings yet)
- Sound effects limited (placeholder audio)

## 📋 Roadmap

### Version 1.1
- [ ] Deploy actual smart contract on Somnia
- [ ] Backend API for score validation
- [ ] Global leaderboard with database
- [ ] Enhanced sound effects and music

### Version 2.0
- [ ] Multiple game modes (endless, time attack)
- [ ] Power-ups and special fireflies
- [ ] Achievement system with NFTs
- [ ] Multiplayer functionality
- [ ] VR support

### Future
- [ ] Mobile app version
- [ ] Tournament system
- [ ] Seasonal events
- [ ] Community features

## 📄 License

ISC License - see LICENSE file for details

## 👥 Credits

**Created by**: Spidyland Team  
**Blockchain**: Somnia Network  
**Built with**: React, Three.js, ethers.js

### Special Thanks
- Three.js community
- React Three Fiber team
- Somnia blockchain developers
- Open source contributors

## 📞 Support

Need help?
- **Issues**: [GitHub Issues](https://github.com/fozagtx/spidyland/issues)
- **Documentation**: See docs folder
- **Community**: Join our Discord (coming soon)

## 🌟 Show Your Support

If you enjoy Spidyland, please:
- ⭐ Star this repository
- 🐦 Share on social media
- 🎮 Play and compete on the leaderboard
- 🤝 Contribute to the project

---

<div align="center">

**🎃 Happy Halloween! 🕷️**

Made with ❤️ for the Somnia ecosystem

[Website](#) • [Twitter](#) • [Discord](#)

</div>
