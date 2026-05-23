# SafeGuard Quick Start Guide

Get SafeGuard up and running in 5 minutes!

## 🚀 Deploy Now (Fastest)

### Option 1: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```
**Done!** Your app is live at `your-app.vercel.app`

### Option 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.output/public
```
**Done!** Your app is live at `your-app.netlify.app`

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup (3 steps)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:5173
   ```

**That's it!** You're ready to develop.

---

## 📱 Test the App

### First Time Setup
1. **Register**: Create an account with name and email
2. **Add Contacts**: Add at least 2 trusted contacts
3. **Grant Permissions**: Allow location and microphone access
4. **Test SOS**: Double-tap the SOS button (don't worry, it won't send alerts without contacts)

### Test Features
- ✅ **SOS Button**: Double-tap to activate
- ✅ **Voice Guard**: Enable and say "help" three times
- ✅ **Location**: Check if location is detected
- ✅ **Quick Actions**: Try flashlight, alarm, fake call
- ✅ **Contacts**: Add, call, and message contacts

---

## 🌐 Deploy to Production

### Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

**Auto-detected settings:**
- Build Command: `npm run build`
- Output Directory: `.output/public`

### Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site"
4. Import your repository
5. Click "Deploy site"

**Settings:**
- Build Command: `npm run build`
- Publish Directory: `.output/public`

### Cloudflare Pages
1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Pages → "Create a project"
4. Connect repository
5. Deploy

**Settings:**
- Build Command: `npm run build`
- Build Output: `.output/public`

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run format       # Format code

# Deployment
vercel               # Deploy to Vercel
netlify deploy       # Deploy to Netlify
```

---

## 📦 Project Structure

```
safeguard/
├── src/
│   ├── components/      # React components
│   ├── routes/          # Page routes
│   ├── lib/            # Utilities and helpers
│   └── styles.css      # Global styles
├── public/             # Static assets
├── .output/            # Build output (generated)
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
└── package.json        # Dependencies
```

---

## 🎨 Customization

### Change Colors
Edit `src/styles.css`:
```css
:root {
  --green-primary: oklch(0.45 0.15 150);  /* Main green */
  --background: oklch(0.99 0.002 140);    /* White background */
}
```

### Change Emergency Numbers
Edit `src/components/QuickActions.tsx`:
```typescript
const actions = [
  { id: "police", label: "Police", icon: Phone, href: "tel:911" },
  { id: "helpline", label: "Helpline", icon: HeartPulse, href: "tel:1099" },
];
```

### Change App Name
1. Update `public/manifest.json`
2. Update `src/routes/__root.tsx` (meta tags)
3. Update `package.json` (name field)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Location Not Working
- Ensure HTTPS is enabled (required for geolocation)
- Check browser permissions
- Try on a different device/browser

### Voice Activation Not Working
- Check microphone permissions
- Try Chrome/Edge (best support)
- Ensure HTTPS is enabled

### PWA Not Installing
- Verify HTTPS is enabled
- Check manifest.json is accessible
- Clear browser cache and try again

---

## 📚 Documentation

- **README.md** - Overview and features
- **DEPLOYMENT.md** - Detailed deployment guide
- **FEATURES.md** - Complete feature documentation
- **CHANGELOG.md** - Version history

---

## 🆘 Emergency Numbers

### Pakistan (Default)
- Police: 15
- Women's Helpline: 1099
- Ambulance: 115
- Fire: 16

### Customize for Your Country
Edit `src/components/QuickActions.tsx` to change emergency numbers.

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Add at least 2 test contacts
- [ ] Test SOS activation
- [ ] Test location services
- [ ] Test voice activation
- [ ] Test on mobile device
- [ ] Verify HTTPS will be enabled
- [ ] Update emergency numbers for your region
- [ ] Customize branding (optional)
- [ ] Test PWA installation

---

## 🎯 Next Steps

After deployment:

1. **Share the app** with your target users
2. **Gather feedback** on features and usability
3. **Monitor performance** using Lighthouse
4. **Add custom domain** (optional)
5. **Enable analytics** (optional)
6. **Set up monitoring** (optional)

---

## 💡 Pro Tips

1. **Use Vercel** for easiest deployment
2. **Enable HTTPS** immediately (required for features)
3. **Test on real devices** before launch
4. **Add to home screen** for best experience
5. **Keep contacts updated** regularly
6. **Test emergency features** periodically
7. **Backup data** before major updates

---

## 🤝 Get Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Read detailed guides
- **Community**: Join discussions (if available)

---

## 📊 Success Metrics

After deployment, monitor:
- User registrations
- SOS activations
- Contact additions
- Feature usage
- Performance scores
- Error rates

---

## 🎉 You're Ready!

SafeGuard is now deployed and ready to help keep people safe.

**Remember**: This is a safety-critical application. Always test thoroughly and ensure all features work correctly in your deployment environment.

---

**Need help?** Check the full documentation or open an issue on GitHub.

**Ready to deploy?** Run `vercel --prod` or `netlify deploy --prod`

**Happy deploying! 🚀**
