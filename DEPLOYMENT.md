# SafeGuard Deployment Guide

This guide provides detailed instructions for deploying SafeGuard to various hosting platforms.

## Table of Contents
- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Cloudflare Pages](#cloudflare-pages)
- [Railway](#railway)
- [Custom Server](#custom-server)

---

## Vercel (Recommended)

Vercel offers the best experience for deploying this TanStack Start application.

### Method 1: Vercel Dashboard (Easiest)

1. **Prepare Your Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Ensure all changes are committed

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your repository
   - Vercel will auto-detect the framework settings
   - Click "Deploy"

3. **Configuration** (Auto-detected)
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
   - Install Command: `npm install`

4. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Development deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Environment Variables** (if needed)
   ```bash
   vercel env add VARIABLE_NAME
   ```

### Vercel Configuration

The `vercel.json` file is already configured with:
- Proper routing for SPA
- Security headers
- Cache control for service worker

---

## Netlify

### Method 1: Netlify Dashboard

1. **Prepare Repository**
   - Push code to GitHub, GitLab, or Bitbucket

2. **Deploy via Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .output/public
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Method 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   # Build first
   npm run build
   
   # Deploy
   netlify deploy --prod --dir=.output/public
   ```

### Netlify Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

## Cloudflare Pages

### Method 1: Cloudflare Dashboard

1. **Prepare Repository**
   - Push code to GitHub or GitLab

2. **Deploy via Cloudflare**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Connect your Git provider
   - Select repository

3. **Build Settings**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: .output/public
   ```

4. **Environment Variables** (if needed)
   - Add any required environment variables
   - Click "Save and Deploy"

### Method 2: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   # Build first
   npm run build
   
   # Deploy
   wrangler pages deploy .output/public
   ```

---

## Railway

### Railway Dashboard

1. **Prepare Repository**
   - Push code to GitHub

2. **Deploy via Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configuration**
   - Railway auto-detects Node.js
   - Build command: `npm run build`
   - Start command: `npm run preview`

4. **Environment Variables**
   - Add any required variables in Railway dashboard

---

## Custom Server

### Using Node.js

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Serve Static Files**
   ```bash
   # Using serve
   npx serve .output/public
   
   # Or using http-server
   npx http-server .output/public
   ```

3. **Production Server (Nginx)**

   Create `/etc/nginx/sites-available/safeguard`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/safeguard/.output/public;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Security headers
       add_header X-Frame-Options "DENY";
       add_header X-Content-Type-Options "nosniff";
       add_header X-XSS-Protection "1; mode=block";

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/safeguard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Post-Deployment Checklist

- [ ] Test all features (SOS, location, contacts)
- [ ] Verify HTTPS is enabled
- [ ] Test PWA installation
- [ ] Check mobile responsiveness
- [ ] Verify geolocation permissions
- [ ] Test voice activation
- [ ] Confirm WhatsApp integration works
- [ ] Check emergency contact alerts
- [ ] Test offline functionality
- [ ] Verify custom domain (if applicable)

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**: 
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues

**Issue**: 404 on page refresh
**Solution**: Ensure SPA routing is configured (see platform-specific configs above)

### Geolocation Not Working

**Issue**: Location features don't work
**Solution**: 
- Ensure site is served over HTTPS
- Check browser permissions
- Verify geolocation API is enabled

### PWA Not Installing

**Issue**: Can't install as PWA
**Solution**:
- Verify manifest.json is accessible
- Ensure HTTPS is enabled
- Check service worker registration
- Validate manifest with Chrome DevTools

---

## Performance Optimization

### Enable Compression

Most platforms enable this by default, but verify:
- Gzip/Brotli compression enabled
- Static assets cached properly
- CDN configured (if available)

### Monitor Performance

Use these tools:
- Google Lighthouse
- WebPageTest
- Chrome DevTools Performance tab

### Recommended Settings

- Enable HTTP/2
- Configure CDN
- Set proper cache headers
- Minimize redirects
- Optimize images

---

## Security Considerations

### HTTPS

Always use HTTPS in production:
- Required for geolocation
- Required for PWA features
- Required for service workers

### Headers

Ensure these security headers are set:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### Environment Variables

Never commit sensitive data:
- Use platform environment variables
- Keep `.env` files in `.gitignore`
- Rotate keys regularly

---

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review build logs
3. Test locally first: `npm run build && npm run preview`
4. Open an issue on GitHub

---

**Recommended Platform**: Vercel
- Zero configuration
- Automatic HTTPS
- Global CDN
- Excellent performance
- Free tier available
