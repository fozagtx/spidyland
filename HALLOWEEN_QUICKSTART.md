# 🎃 Spidyland Halloween Edition - Quick Start Guide

Get up and running with Spidyland in under 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the game
npm run dev

# 3. Open http://localhost:5173
```

That's it! The game is now running locally.

## 🎮 First Play

### Starting the Game
1. You'll see the Halloween-themed main menu
2. Read the instructions on screen
3. Click **"Start Hunt"** to begin

### Playing Your First Round
1. **Move**: Use WASD or Arrow Keys
2. **Shoot**: Click anywhere on the screen to shoot webs
3. **Goal**: Catch the glowing fireflies (orange/yellow lights)
4. **Avoid**: Ghost bats with purple glow
5. **Time**: You have 60 seconds!

### After Game Over
1. See your score (number of fireflies caught)
2. Click **"Claim $SPDR Tokens"** to connect wallet
3. Click **"Play Again"** to retry
4. Check **Leaderboard** (top right) for high scores

## 🎯 Tips for New Players

### Movement
- **Smooth controls**: Movement uses physics, so you have momentum
- **Plan ahead**: You'll slide a bit when you stop
- **Stay centered**: Don't get too close to the edges

### Catching Fireflies
- **Lead your shots**: Fireflies move in patterns
- **Shoot often**: Webs are unlimited!
- **Close range**: Easier to hit nearby fireflies
- **Watch their movement**: They follow sine wave patterns

### Avoiding Bats
- **Stay alert**: Bats fly in circular patterns
- **Listen**: They have glowing purple lights
- **Penalty**: -2 points per hit (2 second cooldown)
- **4 bats total**: Learn their patterns

### Scoring Tips
- **Focus on close fireflies first**
- **Anticipate movement patterns**
- **Don't waste time chasing difficult ones**
- **Keep moving to avoid bats**
- **Use the full 60 seconds**

## 🏆 Leaderboard

### Viewing Scores
- Click **"Leaderboard"** button (top right)
- See top 10 scores
- Shows wallet addresses and dates
- Close with X button

### Getting on the Leaderboard
1. Play a game and earn points
2. Click "Claim $SPDR Tokens"
3. Connect your wallet
4. Score automatically saved!

## 💰 Blockchain Features

### Connecting Wallet

#### First Time Setup
1. Install MetaMask browser extension
2. Create/import wallet
3. Play a game
4. Click "Claim $SPDR Tokens"
5. MetaMask will prompt to add Somnia network
6. Approve the network addition
7. Confirm the mock transaction

#### Network Details (Auto-Added)
- **Network**: Somnia Network
- **Chain ID**: 207995
- **RPC**: https://rpc.somnia.network
- **Symbol**: SOM

### Claiming Tokens
1. **Play**: Catch fireflies
2. **Game Over**: Wait for timer to expire
3. **Connect**: Click "Claim" button
4. **Approve**: MetaMask popup appears
5. **Add Network**: If first time
6. **Confirm**: Mock transaction executes
7. **Success**: You'll see confirmation

> **Note**: Current version uses mock contract for demo purposes.

## 🎨 Customization

### Graphics Quality
The game automatically optimizes for your device, but you can adjust:

**For Better Performance:**
- Close other browser tabs
- Use Chrome or Firefox
- Disable other programs
- Lower resolution in game (future feature)

**For Better Visuals:**
- Use a discrete GPU if available
- Full screen the browser
- Ensure good lighting support
- Use a high refresh rate monitor

## 📱 Mobile Play

### Controls
- **Drag**: Move spider in direction of drag
- **Tap**: Shoot web
- **Pinch**: Not supported (fixed camera)

### Tips
- Portrait or landscape both work
- Tap rapidly to shoot multiple webs
- Drag smoothly for better control
- Ensure good touch response

### Performance
- Close background apps
- Use newest device possible
- Charge device (some throttle on battery)
- Use WiFi, not mobile data (for wallet)

## 🔧 Troubleshooting

### Game Won't Start
**Problem**: Black screen or loading forever  
**Solution**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser
- Check console (F12) for errors
- Ensure JavaScript enabled

### Poor Performance
**Problem**: Laggy gameplay, low FPS  
**Solution**:
- Close other tabs/programs
- Lower browser zoom to 100%
- Try Chrome (best performance)
- Update graphics drivers
- Check if hardware acceleration enabled

### Wallet Won't Connect
**Problem**: MetaMask doesn't appear or fails  
**Solution**:
- Install/update MetaMask
- Unlock your wallet
- Try different browser
- Check MetaMask is not blocked
- Ensure on correct tab

### Controls Don't Work
**Problem**: Keys/mouse don't respond  
**Solution**:
- Click on the game canvas
- Check no popup is covering game
- Try refreshing page
- Ensure keyboard working
- Disable browser extensions

### Fireflies Not Appearing
**Problem**: No collectibles spawn  
**Solution**:
- Wait for game to fully load
- Refresh the page
- Check browser console
- Ensure game actually started

### Sound Issues
**Problem**: No audio or crackling  
**Solution**:
- Check browser not muted
- Check system volume
- Try different browser
- Audio may initialize on interaction

## 🎯 Advanced Tips

### Speedrun Strategies
1. **Start center**: Don't move initially, shoot nearby fireflies
2. **Circular pattern**: Move in circle catching as you go
3. **Bat patterns**: Learn their paths to avoid
4. **Rapid fire**: Spam click when fireflies cluster
5. **Time management**: Aim for 15+ in 60 seconds

### High Score Goals
- **Beginner**: 5-10 fireflies
- **Intermediate**: 10-20 fireflies
- **Advanced**: 20-30 fireflies
- **Expert**: 30+ fireflies

### Pattern Recognition
- **Fireflies**: Follow sine waves in 3D space
- **Bats**: Fly in horizontal circles
- **Timing**: Fireflies pulse every ~3 seconds
- **Respawn**: 2 seconds after caught

## 📊 Game Stats

### Session Tracking
- **Score**: Real-time counter (top left)
- **Timer**: 60-second countdown (top left)
- **Leaderboard**: Top 10 all-time (top right)

### Understanding Score
- **+1**: Each firefly caught
- **-2**: Each bat collision
- **Minimum**: 0 (can't go negative)
- **Maximum**: Theoretically unlimited!

## 🚀 Next Steps

After mastering the basics:

1. **Compete**: Try to beat the leaderboard
2. **Stream**: Share your gameplay
3. **Challenge**: Challenge friends
4. **Contribute**: Submit PRs on GitHub
5. **Deploy**: Host your own instance

## 📚 Additional Resources

- **Full Documentation**: See SPIDYLAND_README.md
- **Deployment**: See DEPLOYMENT.md
- **Technical Details**: See TECHNICAL.md
- **Code Structure**: See README.md

## 🎃 Have Fun!

Remember, it's a game! Don't stress about high scores initially. Learn the mechanics, enjoy the spooky atmosphere, and have fun catching those fireflies!

### Quick Checklist Before Playing
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened to localhost:5173
- [ ] Controls understood (WASD + Click)
- [ ] Sound enabled (optional)
- [ ] Ready to catch fireflies! 🔥

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.

**Happy Hunting! 🕷️🎃**
