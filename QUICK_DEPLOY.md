# 🚀 Quick Deploy Guide

## 5-Minute Deployment to Vercel

### Step 1: Create Vercel Postgres Database (2 min)
1. Go to https://vercel.com/dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Name it `safeguard-db` → **Create**
4. Copy all environment variables (click **Show secret**)

### Step 2: Setup Local Environment (1 min)
```bash
# Create .env file
cp .env.example .env

# Paste your Vercel Postgres credentials into .env
# (The ones you copied in Step 1)
```

### Step 3: Create Database Tables (1 min)
```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push
```

### Step 4: Deploy (1 min)
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

**Done!** Your app is live! 🎉

---

## Alternative: Deploy via Vercel Dashboard

### Step 1: Create Database (same as above)

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Database integration complete"
git push origin main
```

### Step 3: Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables from Step 1
4. Click **Deploy**

**Done!** Your app is live! 🎉

---

## What's Included

✅ User authentication with secure passwords  
✅ Emergency contacts management  
✅ SOS button with location tracking  
✅ Voice trigger with custom keywords  
✅ Video recording capability  
✅ Incident history tracking  
✅ PDF report generation  
✅ PWA support for mobile installation  
✅ Professional white/green UI  
✅ Multi-device support  

---

## Testing Your Deployment

Visit your deployed URL and test:
1. Register a new account
2. Add emergency contacts
3. Test SOS button
4. Configure voice trigger
5. Generate a report

---

## Need Help?

- **Full Guide:** See `DEPLOYMENT_GUIDE.md`
- **Database Setup:** See `DATABASE_SETUP.md`
- **Features:** See `DATABASE_FEATURES.md`
- **Status:** See `INTEGRATION_COMPLETE.md`

---

## Environment Variables Needed

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

Get these from: Vercel Dashboard → Storage → Your Database → Settings

---

## Commands Reference

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema to database
npm run db:generate      # Generate types
npm run db:studio        # Open Drizzle Studio

# Build & Deploy
npm run build            # Build for production
vercel --prod            # Deploy to production
```

---

**That's it!** Your SafeGuard app is ready to protect users worldwide! 🛡️
