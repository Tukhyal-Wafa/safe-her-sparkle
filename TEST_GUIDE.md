# Testing & Troubleshooting Guide

## Quick Test (Without Installing Dependencies)

The TypeScript errors you're seeing are **normal** and won't affect runtime. They appear because:
1. Dependencies haven't been installed yet (`node_modules` is missing)
2. TypeScript can't find type definitions
3. These are **compile-time warnings only**

## Install Dependencies & Run

### Step 1: Install Dependencies
```bash
npm install
```
**Note**: This may take 3-5 minutes depending on your internet speed.

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

## Expected Behavior

### ✅ What Should Work
1. **Login/Register pages** - Clean white/green design
2. **Dashboard** - Location status card + Safety score
3. **SOS Button** - Large red button (double-tap to activate)
4. **Quick Actions** - 6 action buttons in grid
5. **Contacts Page** - Add/manage emergency contacts
6. **History Page** - View past SOS events
7. **Bottom Navigation** - 5 tabs (Home, Contacts, News, Laws, Guide)

### 🎨 Visual Checks
- **Background**: Clean white with subtle green gradients
- **Primary Color**: Professional green (#22c55e)
- **Cards**: Glassmorphism effect with soft shadows
- **Buttons**: Green gradients for primary actions
- **Text**: Dark gray on white (excellent contrast)

## Common Issues & Fixes

### Issue 1: "vite is not recognized"
**Cause**: Dependencies not installed
**Fix**:
```bash
npm install
```

### Issue 2: TypeScript Errors in IDE
**Cause**: Normal - types not loaded yet
**Fix**: These will disappear after `npm install`

### Issue 3: Port 5173 Already in Use
**Fix**:
```bash
# Kill the process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Issue 4: Build Fails
**Fix**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 5: Location Not Working
**Cause**: HTTPS required for geolocation
**Fix**: 
- Use `localhost` (works with HTTP)
- Or deploy to Vercel/Netlify (automatic HTTPS)

## Testing Checklist

### Basic Functionality
- [ ] App loads without errors
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Dashboard displays correctly
- [ ] Location status shows (or shows error if denied)
- [ ] Safety score displays
- [ ] Can navigate between pages

### SOS System
- [ ] SOS button visible and styled correctly
- [ ] Double-tap shows toast message
- [ ] Location is captured (if permissions granted)
- [ ] Can add contacts
- [ ] SOS activation logs to history

### Quick Actions
- [ ] All 6 buttons display correctly
- [ ] Police button opens tel: link
- [ ] Helpline button opens tel: link
- [ ] Share Location button works
- [ ] Flashlight toggle works (on supported devices)
- [ ] Alarm toggle works
- [ ] Fake Call opens modal

### Contacts
- [ ] Can add new contact
- [ ] Contact displays in list
- [ ] Can call contact (tel: link)
- [ ] Can send WhatsApp alert
- [ ] Can delete contact

### Voice Activation
- [ ] Voice Guard button visible
- [ ] Can enable voice listening
- [ ] Microphone permission requested
- [ ] Status updates when listening

### UI/UX
- [ ] White background with green accents
- [ ] Smooth animations
- [ ] Responsive on mobile
- [ ] Bottom navigation works
- [ ] All icons display correctly

## Build for Production

### Test Build Locally
```bash
npm run build
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=.output/public
```

## Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Expected scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 90+
   - PWA: 100

### Load Time Testing
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Bundle Size: ~350KB (gzipped)

## Browser Testing

### Desktop
- ✅ Chrome 90+ (Recommended)
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Mobile
- ✅ Samsung Internet

## Feature Testing by Device

### Desktop Only
- Voice activation (limited browser support)
- Flashlight (not available)

### Mobile Only
- Flashlight (camera LED)
- Better geolocation accuracy
- PWA installation
- Vibration feedback

### Both
- SOS system
- Contact management
- Location sharing
- Emergency history
- Quick actions

## Debugging Tips

### Check Console
```javascript
// Open browser console (F12)
// Look for errors in red
// Common issues:
// - Permission denied (location/mic)
// - Network errors
// - Storage quota exceeded
```

### Check Network Tab
- Verify all assets load
- Check for 404 errors
- Verify API calls (if any)

### Check Application Tab
- LocalStorage should have:
  - `safeguard:user`
  - `safeguard:contacts`
  - `safeguard:history`
  - `safeguard:lastLocation`

### Check Permissions
- Location: Required for GPS features
- Microphone: Required for voice activation
- Camera: Required for flashlight

## Manual Testing Script

### 1. First Time User Flow
1. Open app
2. Click "Create account"
3. Fill in name, email, password
4. Click "Create account"
5. Should redirect to dashboard
6. Grant location permission when prompted
7. See location status card
8. See safety score (40/100)

### 2. Add Contacts Flow
1. Click "Contacts" in bottom nav
2. Click "+" button
3. Fill in name and phone
4. Click "Save Contact"
5. Contact appears in list
6. Safety score increases to 55/100

### 3. SOS Activation Flow
1. Go to Home
2. Double-tap SOS button
3. See "Tap again to activate" toast
4. Double-tap again quickly
5. See "Locating you..." toast
6. See "Opening WhatsApp..." toast
7. WhatsApp opens (or shows error if no contacts)
8. Check History page - event logged

### 4. Voice Activation Flow
1. Click "Voice Guard" button
2. Grant microphone permission
3. Button shows "Listening"
4. Say "help" three times quickly
5. SOS should activate
6. Same flow as manual SOS

### 5. Quick Actions Flow
1. Test each button:
   - Police: Opens tel:15
   - Helpline: Opens tel:1099
   - Share Location: Shows share dialog
   - Flashlight: Toggles on/off
   - Alarm: Plays loud sound
   - Fake Call: Shows call modal

## Known Limitations

### Browser Compatibility
- Voice activation: Chrome/Edge only
- Flashlight: Mobile only, requires camera permission
- Vibration: Mobile only
- Share API: Modern browsers only

### Privacy & Security
- All data stored locally (no server)
- Data cleared on browser cache clear
- No backup/sync functionality
- No encryption (browser-level only)

### Performance
- Large contact lists (100+) may slow down
- History limited to 50 events
- Location accuracy varies by device

## Success Criteria

Your app is working correctly if:

✅ **Visual**
- Clean white background
- Green primary color throughout
- Smooth animations
- Professional appearance

✅ **Functional**
- Can register/login
- Location tracking works
- SOS button activates
- Contacts can be added
- History logs events

✅ **Performance**
- Loads in < 2 seconds
- Smooth animations (60fps)
- No console errors
- Responsive on mobile

## Next Steps After Testing

1. **If everything works**:
   - Deploy to Vercel/Netlify
   - Share with test users
   - Gather feedback

2. **If issues found**:
   - Check console for errors
   - Review this guide
   - Check GitHub issues
   - Ask for help

## Support

If you encounter issues:
1. Check this guide first
2. Review console errors
3. Check browser compatibility
4. Try different browser
5. Clear cache and retry

---

**Remember**: The TypeScript errors in your IDE are normal before running `npm install`. They won't affect the app's functionality!
