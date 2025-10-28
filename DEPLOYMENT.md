# 🚀 Deployment Guide for Spidyland

This guide covers deploying Spidyland: The Web of Fortune to various platforms.

## 📦 Build the Project

First, build the production-ready version:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Via GitHub:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Vite config
5. Deploy!

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

**Via CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Via GitHub:**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Connect repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

**Setup:**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"
```

**vite.config.js** update:
```javascript
export default {
  base: '/spidyland/', // Your repo name
  // ... rest of config
}
```

**Deploy:**
```bash
npm run deploy
```

### 4. AWS S3 + CloudFront

**Steps:**
1. Build the project: `npm run build`
2. Create S3 bucket with static website hosting
3. Upload `dist/` contents to bucket
4. Create CloudFront distribution
5. Point to S3 bucket
6. Configure custom domain (optional)

**AWS CLI:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 5. Firebase Hosting

**Setup:**
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
```

**Configuration:**
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: Optional

**Deploy:**
```bash
npm run build
firebase deploy
```

### 6. Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**
```bash
# Build image
docker build -t spidyland .

# Run container
docker run -p 8080:80 spidyland
```

### 7. DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean dashboard
3. Create new App
4. Connect GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Deploy!

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
VITE_SOMNIA_RPC_URL=https://rpc.somnia.network
VITE_SPDR_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
VITE_CHAIN_ID=207995
```

Update `src/TokenContract.js` to use:
```javascript
const SOMNIA_RPC_URL = import.meta.env.VITE_SOMNIA_RPC_URL || 'https://rpc.somnia.network';
const SPDR_CONTRACT_ADDRESS = import.meta.env.VITE_SPDR_CONTRACT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
```

## 🔒 Security Considerations

### Before Production Deployment:

1. **Smart Contract**: Deploy actual contract on Somnia
2. **Backend API**: Implement score verification server
3. **Rate Limiting**: Prevent claim spam
4. **Signature Verification**: Backend validation of scores
5. **HTTPS**: Always use HTTPS in production
6. **CSP Headers**: Configure Content Security Policy

### Recommended Backend Setup:

```javascript
// Example Express.js backend
app.post('/api/verify-score', async (req, res) => {
  const { score, signature, address } = req.body;
  
  // Verify signature
  const isValid = verifyScoreSignature(score, signature, address);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // Call smart contract
  const tx = await contract.mintTokens(address, score);
  await tx.wait();
  
  res.json({ success: true, txHash: tx.hash });
});
```

## 📊 Performance Optimization

### Already Implemented:
- ✅ Code splitting via Vite
- ✅ Asset optimization
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression

### Additional Optimizations:

1. **CDN**: Use CDN for static assets
2. **Image Optimization**: Compress textures
3. **Lazy Loading**: Load components on demand
4. **Service Worker**: Add PWA capabilities

### PWA Setup (Optional):

```bash
npm install vite-plugin-pwa -D
```

**vite.config.js:**
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Spidyland: The Web of Fortune',
        short_name: 'Spidyland',
        theme_color: '#ff6600',
        icons: [/* your icons */]
      }
    })
  ]
}
```

## 🌍 Custom Domain

### DNS Configuration:
1. Point domain to hosting provider
2. Configure SSL certificate
3. Update Somnia contract whitelist (if applicable)

### Example (Cloudflare):
- Type: CNAME
- Name: @ or www
- Target: your-deployment.vercel.app
- Proxy status: Proxied (for CDN)

## 📈 Monitoring

### Recommended Tools:
- **Analytics**: Google Analytics, Plausible
- **Error Tracking**: Sentry
- **Performance**: Lighthouse CI
- **Uptime**: UptimeRobot

### Add Analytics:

```javascript
// src/analytics.js
export const trackEvent = (category, action, label) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};
```

## 🧪 Testing Before Deploy

```bash
# Build
npm run build

# Preview locally
npm run preview

# Test on local network
npm run preview -- --host
```

**Checklist:**
- [ ] Game loads and runs smoothly
- [ ] Controls work (keyboard + touch)
- [ ] Web shooting functions correctly
- [ ] Collision detection works
- [ ] Timer counts down properly
- [ ] Game over screen appears
- [ ] Wallet connection works
- [ ] Leaderboard saves and displays
- [ ] Mobile responsiveness tested
- [ ] No console errors

## 🎯 Post-Deployment

1. **Test on multiple devices**: Desktop, mobile, tablet
2. **Test different browsers**: Chrome, Firefox, Safari, Edge
3. **Monitor performance**: Check loading times
4. **Check blockchain**: Verify wallet connection on live site
5. **Social sharing**: Test OpenGraph/Twitter cards
6. **SEO**: Submit sitemap to search engines

## 📱 Mobile Optimization

The game is already mobile-responsive, but ensure:
- Touch controls work smoothly
- Canvas scales properly
- Performance is acceptable (30+ FPS)
- UI elements are touch-friendly

## 🚨 Troubleshooting

### Common Issues:

**White screen:**
- Check console for errors
- Verify base path in vite.config.js
- Check CORS settings

**Wallet won't connect:**
- Ensure HTTPS (MetaMask requires secure context)
- Check network configuration
- Verify contract address

**Poor performance:**
- Lower particle count
- Reduce shadow quality
- Disable post-processing effects on mobile

## 🔄 Continuous Deployment

### GitHub Actions Example:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📞 Support

For deployment issues:
1. Check build logs
2. Review browser console
3. Test locally first
4. Check hosting provider docs

**Happy Deploying! 🚀🎃**
