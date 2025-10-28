# 🎃 Spidyland: The Web of Fortune (Somnia Edition)

A Halloween-themed 3D web game where players control a spider in a haunted forest, catching glowing fireflies to earn $SPDR tokens on the Somnia blockchain.

## 🎮 Gameplay

### Objective
Catch as many fireflies as possible within 60 seconds by shooting webs at them. Avoid ghost bats that will reduce your score!

### Controls
- **Movement**: WASD or Arrow Keys
- **Shoot Web**: Click/Tap anywhere on the canvas
- **Mobile**: Touch and drag to move, tap to shoot

### Game Mechanics
- Each caught firefly = +1 $SPDR token
- Ghost bat collision = -2 points
- 60-second timer
- Fireflies respawn after being caught
- Real-time score tracking

## 🌟 Features

### 3D Graphics
- Detailed spider player model with animated legs
- Glowing fireflies with particle trails
- Flying ghost bats with animated wings
- Spooky forest environment with:
  - Dead trees
  - Tombstones
  - Glowing jack-o'-lanterns
  - Atmospheric fog and lighting
- Post-processing effects (bloom, vignette)

### Blockchain Integration
- **Network**: Somnia Blockchain
- **RPC URL**: https://rpc.somnia.network
- **Chain ID**: 207995 (0x32C7B in hex)
- **Token**: $SPDR (mock ERC-20)
- **Contract Address**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

### Game Features
- Wallet connection with MetaMask or Web3 wallet
- Token minting after game completion
- Local leaderboard (stored in localStorage)
- Game over screen with claim functionality
- Play again option

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Web3 wallet (for blockchain features)

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

### Development
The game will run on `http://localhost:5173` by default.

## 📁 Project Structure

```
src/
├── HalloweenGameScene.jsx    # Main game scene
├── SpiderModel.jsx            # 3D spider player model
├── Firefly.jsx                # Collectible firefly component
├── GhostBat.jsx              # Enemy bat component
├── WebShot.jsx               # Web projectile
├── SpookyForest.jsx          # Environment (trees, tombstones, pumpkins)
├── GameOverScreen.jsx        # End game UI with token claiming
├── Leaderboard.jsx           # Top scores display
├── TokenContract.js          # Blockchain integration (ethers.js)
├── SoundManager.js           # Audio system
└── styles.css                # Halloween-themed styles
```

## 🎨 Technical Details

### Tech Stack
- **Framework**: React 18
- **3D Engine**: Three.js with React Three Fiber
- **3D Helpers**: React Three Drei
- **Post-processing**: React Three Postprocessing
- **Audio**: Tone.js
- **Blockchain**: ethers.js v6
- **Build Tool**: Vite

### Key Systems
1. **Physics-based Movement**: Force-based player movement with friction
2. **Dynamic Camera**: Smooth camera following with lerp
3. **Collision Detection**: Web-to-firefly and player-to-bat collision
4. **Particle Effects**: Glowing trails and point lights
5. **Game State Management**: React hooks for timer, score, game state
6. **Blockchain Integration**: Mock contract with signature generation

## 🔗 Blockchain Details

### Somnia Network Configuration
The game automatically adds the Somnia network to your wallet with these parameters:
- **Chain Name**: Somnia Network
- **Native Currency**: SOM (18 decimals)
- **Block Explorer**: https://explorer.somnia.network

### Smart Contract (Mock)
The current implementation uses a mock smart contract interface. For production:
1. Deploy an actual ERC-20 contract on Somnia
2. Update `SPDR_CONTRACT_ADDRESS` in `src/TokenContract.js`
3. Implement backend signature verification
4. Add proper token minting authorization

### Token Claiming
1. Play the game and catch fireflies
2. When time runs out, click "Claim $SPDR Tokens"
3. Connect your wallet (MetaMask will prompt for network addition)
4. Approve the mock transaction
5. Tokens are "claimed" and score is saved to leaderboard

## 🎃 Halloween Theme

The game features a complete Halloween atmosphere:
- **Colors**: Orange (#ff6600), Purple (#9933ff), Dark browns
- **Lighting**: Dim ambient with orange/purple point lights
- **Font**: 'Creepster' for spooky text
- **Effects**: Fog, bloom, vignette
- **Environment**: Dead trees, tombstones, glowing pumpkins
- **Enemies**: Translucent ghost bats with red eyes

## 📊 Leaderboard

Scores are stored locally in browser's localStorage:
- Top 10 scores displayed
- Shows wallet address (abbreviated)
- Timestamp of achievement
- Mock transaction hash

## 🎵 Audio

The game uses the existing SoundManager with Tone.js for:
- Background ambient sounds
- Footstep sounds (when moving)
- Collection sounds (catching fireflies)
- Environmental audio

## 🐛 Known Limitations

1. **Mock Contract**: Current blockchain integration is simulated
2. **Local Storage**: Leaderboard is browser-specific
3. **No Backend**: Score validation is client-side only
4. **Limited Mobile Testing**: Touch controls may need refinement

## 🚀 Future Enhancements

- [ ] Deploy actual smart contract on Somnia
- [ ] Backend API for score verification
- [ ] Global leaderboard with database
- [ ] More game modes (endless, time attack)
- [ ] Power-ups and special fireflies
- [ ] Multiplayer functionality
- [ ] NFT rewards for high scores
- [ ] Mobile app version
- [ ] VR support

## 📝 License

ISC

## 🙏 Credits

Built with React Three Fiber, Three.js, and ethers.js for the Somnia blockchain ecosystem.

---

**Happy Halloween! 🎃 Good luck catching those fireflies! 🔥**
