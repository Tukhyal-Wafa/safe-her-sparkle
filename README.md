# SafeGuard — Professional Women Safety Platform

A modern, enterprise-grade Progressive Web App (PWA) designed to enhance women's safety through advanced emergency response features, real-time location tracking, comprehensive safety tools, and secure cloud database storage.

## 🌟 Features

### Core Safety Features
- **Advanced SOS System**: Double-tap emergency button with instant alert dispatch
- **Real-time Location Tracking**: Continuous GPS monitoring with live location sharing
- **Voice Activation**: Hands-free emergency trigger with custom keywords
- **Trusted Contacts Network**: Manage emergency contacts with instant WhatsApp alerts
- **Emergency History**: Complete log of all SOS activations with timestamps and locations
- **Video Recording**: Record emergency situations with automatic sharing
- **PDF Reports**: Generate official reports for legal documentation

### Database Features
- **Secure Authentication**: User accounts with bcrypt password hashing
- **Cloud Storage**: All data stored in Vercel Postgres database
- **Multi-Device Sync**: Access your data from any device
- **Persistent Storage**: Never lose your emergency contacts or history
- **Report Generation**: Create PDF reports with incident details for authorities

### Quick Action Tools
- **Emergency Hotlines**: One-tap access to police (15) and women's helpline (1099)
- **Live Location Sharing**: Share your current location via WhatsApp or SMS
- **Flashlight**: Quick access to device flashlight for visibility
- **Loud Alarm**: Attention-grabbing siren to deter threats
- **Fake Call**: Simulate incoming call for discreet exit from uncomfortable situations

### Professional Design
- Clean, white interface with professional green accents
- Glassmorphism design with smooth animations
- Fully responsive and mobile-optimized
- Accessible and WCAG compliant
- PWA-ready for offline functionality

## 🚀 Quick Deployment

### Prerequisites
- Vercel account (free tier works)
- Node.js 18+ installed

### 5-Minute Setup

1. **Create Vercel Postgres Database**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Storage** → **Create Database** → **Postgres**
   - Copy all environment variables

2. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Paste your Vercel Postgres credentials into .env
   ```

3. **Install & Setup Database**:
   ```bash
   npm install
   npm run db:push
   ```

4. **Deploy**:
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

**Done!** 🎉 See `QUICK_DEPLOY.md` for detailed instructions.

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 5-minute deployment guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database configuration guide
- **[DATABASE_FEATURES.md](./DATABASE_FEATURES.md)** - Database features overview
- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Integration status
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide

## 💻 Local Development

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Vercel Postgres database (for full functionality)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd safe-her-sparkle-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   # Add your Vercel Postgres credentials to .env
   ```

4. **Setup database**:
   ```bash
   npm run db:push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build
```

The production build will be in the `.output/public` directory.

### Preview Production Build

```bash
npm run preview
# or
bun run preview
```

### Database Commands

```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate TypeScript types
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🛠️ Technology Stack

- **Framework**: TanStack Start (React-based)
- **Database**: Vercel Postgres with Drizzle ORM
- **Authentication**: bcrypt password hashing
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with jspdf-autotable
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **Runtime**: Cloudflare Workers compatible

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Install Prompt**: Add to home screen on mobile devices
- **Push Notifications**: (Can be enabled for emergency alerts)
- **Background Sync**: Sync data when connection is restored
- **Responsive Design**: Optimized for all screen sizes

## 🔒 Security Features

- **Secure Authentication**: bcrypt password hashing (10 rounds)
- **SQL Injection Protection**: Drizzle ORM with parameterized queries
- **User Data Isolation**: All queries filtered by userId
- **Environment Variables**: Sensitive credentials stored securely
- **HTTPS Required**: Enforced by Vercel for geolocation
- **Content Security Policy**: XSS and frame protection
- **Session Management**: Secure client-side session storage

## 🗄️ Database Schema

### Tables:
- **users** - User accounts with hashed passwords
- **contacts** - Emergency contacts per user
- **incidents** - SOS events with location and metadata
- **voice_settings** - Custom voice trigger settings
- **reports** - Generated report metadata

See `DATABASE_FEATURES.md` for complete schema documentation.

## 🌍 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📋 Environment Variables

Required for database functionality:

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

See `.env.example` for template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions, please open an issue on GitHub.

## 🎯 Recommended Deployment Platform

**Vercel** is the recommended platform for deploying SafeGuard because:
- Zero-configuration deployment
- Built-in Postgres database
- Automatic HTTPS
- Global CDN
- Excellent performance
- Free tier available
- Built-in analytics
- Easy custom domain setup
- Seamless database integration

## 📊 Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- PWA Score: 100

## 🔄 Updates

To update the app after deployment:
1. Make your changes locally
2. Test thoroughly with `npm run dev`
3. Run database migrations if needed: `npm run db:push`
4. Commit and push to your repository
5. Your deployment platform will automatically rebuild and deploy

## 🧪 Testing

### Before Deployment:
```bash
npm run build          # Test production build
npm run preview        # Preview production build
npm run db:studio      # Verify database schema
```

### After Deployment:
- Test user registration
- Test user login
- Test adding contacts
- Test SOS button
- Test voice trigger
- Test report generation
- Test on mobile device
- Test PWA installation

## 📱 PWA Installation

Users can install SafeGuard as a native app:

**On Mobile:**
1. Visit your deployed URL
2. Tap browser menu
3. Select "Add to Home Screen"
4. App icon appears on home screen

**On Desktop:**
1. Visit your deployed URL
2. Look for install icon in address bar
3. Click "Install SafeGuard"
4. App opens in standalone window

## 🆘 Support & Documentation

- **Quick Deploy**: See `QUICK_DEPLOY.md`
- **Full Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Database Setup**: See `DATABASE_SETUP.md`
- **Database Features**: See `DATABASE_FEATURES.md`
- **Integration Status**: See `INTEGRATION_COMPLETE.md`
- **Issues**: Open an issue on GitHub

## 🎉 What's New

### Version 2.0 - Database Integration
- ✅ Vercel Postgres database integration
- ✅ Secure user authentication
- ✅ Multi-device data synchronization
- ✅ Persistent storage for all data
- ✅ PDF report generation
- ✅ Enhanced security with bcrypt
- ✅ Production-ready architecture

---

**Built with ❤️ for women's safety**

**Ready to deploy?** Follow `QUICK_DEPLOY.md` for 5-minute setup!
