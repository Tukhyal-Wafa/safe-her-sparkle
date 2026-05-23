# SafeGuard Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 18+ installed
- Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Prepare Your Repository

1. **Commit all changes:**
```bash
git add .
git commit -m "Database integration complete"
git push origin main
```

### Step 2: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create new project)
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., `safeguard-db`)
7. Select region closest to your users
8. Click **Create**

### Step 3: Get Database Connection Strings

1. In your Vercel Postgres dashboard, click on your database
2. Go to **Settings** → **Connection String**
3. Click **Show secret** to reveal connection strings
4. You'll see several environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### Step 4: Configure Environment Variables

#### Option A: Via Vercel Dashboard
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable from Step 3
4. Make sure to select all environments (Production, Preview, Development)

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add POSTGRES_URL
vercel env add POSTGRES_PRISMA_URL
vercel env add POSTGRES_URL_NON_POOLING
vercel env add POSTGRES_USER
vercel env add POSTGRES_HOST
vercel env add POSTGRES_PASSWORD
vercel env add POSTGRES_DATABASE
```

### Step 5: Create Database Tables

#### Option A: Local Setup (Recommended)
```bash
# Create .env file locally
cp .env.example .env

# Add your Vercel Postgres connection strings to .env
# Edit .env and paste the values from Vercel

# Install dependencies
npm install

# Push schema to database
npm run db:push

# Verify tables were created
npm run db:studio
```

#### Option B: Via Vercel Build
The database tables will be created automatically during the first deployment if you add this to your `package.json`:

```json
{
  "scripts": {
    "build": "npm run db:push && vite build"
  }
}
```

### Step 6: Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Project**
3. Select your Git repository
4. Vercel will auto-detect the framework (Vite)
5. Click **Deploy**
6. Wait for deployment to complete (2-3 minutes)

#### Option B: Via Vercel CLI
```bash
# Deploy to production
vercel --prod

# Or just deploy
vercel
```

### Step 7: Verify Deployment

1. Visit your deployed URL (e.g., `https://safeguard.vercel.app`)
2. Test user registration
3. Test user login
4. Test adding contacts
5. Test SOS button
6. Test voice trigger
7. Test report generation

## 🔧 Local Development Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd safe-her-sparkle-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Vercel Postgres credentials
# You can get these from Vercel Dashboard → Storage → Your Database → Settings
```

### 4. Setup Database
```bash
# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio to view database
npm run db:studio
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app.

## 📦 Alternative Deployment Options

### Deploy to Netlify

1. **Create `netlify.toml`** (already exists):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Setup Vercel Postgres** (same as above)

3. **Deploy:**
   - Connect your Git repository to Netlify
   - Add environment variables in Netlify dashboard
   - Deploy

### Deploy to Cloudflare Pages

1. **Setup Vercel Postgres** (same as above)

2. **Deploy:**
```bash
# Install Wrangler CLI
npm i -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist
```

3. **Add environment variables** in Cloudflare Pages dashboard

## 🔐 Security Checklist

- ✅ All passwords are hashed with bcrypt
- ✅ Database credentials are in environment variables (not in code)
- ✅ SQL injection protection via Drizzle ORM
- ✅ HTTPS enforced by Vercel
- ✅ User authentication required for all operations
- ✅ User data isolated by userId

## 🧪 Testing Checklist

### Before Deployment:
- [ ] Run `npm run build` locally without errors
- [ ] Test all features in development mode
- [ ] Check browser console for errors
- [ ] Test on mobile device (responsive design)
- [ ] Test PWA installation

### After Deployment:
- [ ] Test user registration
- [ ] Test user login
- [ ] Test logout
- [ ] Test adding contacts
- [ ] Test removing contacts
- [ ] Test SOS button
- [ ] Test voice trigger settings
- [ ] Test incident history
- [ ] Test PDF report generation
- [ ] Test PWA installation from deployed URL
- [ ] Test on multiple devices
- [ ] Test location permissions
- [ ] Test microphone permissions
- [ ] Test camera permissions (for video recording)

## 📊 Monitoring & Analytics

### Vercel Analytics (Recommended)
1. Go to your project in Vercel Dashboard
2. Navigate to **Analytics** tab
3. Enable **Web Analytics**
4. Add this to your `app/root.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function Root() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

### Error Tracking
Consider adding error tracking:
- [Sentry](https://sentry.io/) - Free tier available
- [LogRocket](https://logrocket.com/) - Session replay
- [Rollbar](https://rollbar.com/) - Error monitoring

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

## 📱 PWA Installation

Your app is already configured as a PWA. Users can install it:

### On Mobile (Android/iOS):
1. Visit your deployed URL
2. Tap browser menu (⋮ or share icon)
3. Tap "Add to Home Screen" or "Install App"
4. App icon will appear on home screen

### On Desktop (Chrome/Edge):
1. Visit your deployed URL
2. Look for install icon in address bar
3. Click "Install SafeGuard"
4. App will open in standalone window

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .tanstack
npm install
npm run build
```

### Database Connection Fails
- Verify environment variables are set correctly
- Check Vercel Postgres dashboard for database status
- Ensure database is in same region as deployment
- Try regenerating connection strings

### "Module not found" Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Regenerate Drizzle types
npm run db:generate
```

## 📞 Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
3. Review error logs in Vercel Dashboard → Deployments → [Your Deployment] → Logs
4. Check browser console for client-side errors

## 🎉 Success!

Your SafeGuard app is now deployed and ready to protect users worldwide!

**Your deployed app includes:**
- ✅ User authentication with secure password hashing
- ✅ Emergency contacts management
- ✅ SOS button with location tracking
- ✅ Voice trigger with custom keywords
- ✅ Video recording capability
- ✅ Incident history tracking
- ✅ PDF report generation
- ✅ PWA support for mobile installation
- ✅ Professional white/green UI
- ✅ Persistent database storage
- ✅ Multi-device support

**Share your app:**
- Share the URL with users
- Add to app stores (optional, requires additional setup)
- Promote on social media
- Get feedback and iterate!
