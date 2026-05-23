# 🗄️ Database Setup Guide - SafeGuard

## Overview

SafeGuard now uses **Vercel Postgres** for data persistence. This allows:
- ✅ User authentication with secure passwords
- ✅ Persistent emergency contacts
- ✅ Incident history across devices
- ✅ Voice settings sync
- ✅ PDF report generation
- ✅ Multi-device access

---

## 🚀 Quick Setup (Vercel)

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (or create new)

2. **Add Postgres Database**
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose region (closest to users)
   - Click "Create"

3. **Get Connection String**
   - Click on your database
   - Go to ".env.local" tab
   - Copy all environment variables

### Step 2: Add Environment Variables

1. **Local Development**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Paste your Vercel Postgres variables
   # (from Vercel Dashboard → Storage → .env.local tab)
   ```

2. **Production (Vercel)**
   - Go to Project Settings → Environment Variables
   - Add all POSTGRES_* variables
   - They're automatically added when you create the database

### Step 3: Push Database Schema

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio to view data
npm run db:studio
```

### Step 4: Deploy

```bash
# Deploy to Vercel
vercel --prod
```

**Done!** Your database is ready.

---

## 📊 Database Schema

### Tables

#### 1. **users**
Stores user accounts with secure password hashing.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | User's full name |
| email | TEXT | Email (unique) |
| password | TEXT | Bcrypt hashed password |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update |

#### 2. **contacts**
Emergency contacts for each user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| name | TEXT | Contact name |
| phone | TEXT | Phone number |
| relation | TEXT | Relationship (optional) |
| created_at | TIMESTAMP | When added |

#### 3. **incidents**
All emergency incidents (SOS, voice, video).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| type | TEXT | 'sos_button', 'voice_trigger', 'video_recording' |
| latitude | REAL | GPS latitude |
| longitude | REAL | GPS longitude |
| accuracy | REAL | GPS accuracy (meters) |
| address | TEXT | Reverse geocoded address |
| message | TEXT | Emergency message sent |
| video_blob | TEXT | Base64 encoded video (if recorded) |
| contacts_notified | JSONB | Array of contact IDs notified |
| created_at | TIMESTAMP | When incident occurred |

#### 4. **voice_settings**
Custom voice trigger settings per user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users (unique) |
| keyword | TEXT | Custom trigger word |
| repeat_count | INTEGER | How many times to repeat |
| enabled | INTEGER | 0 = disabled, 1 = enabled |
| updated_at | TIMESTAMP | Last update |

#### 5. **reports**
Generated PDF reports metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| title | TEXT | Report title |
| description | TEXT | Report description |
| incident_ids | JSONB | Array of incident IDs included |
| start_date | TIMESTAMP | Report period start |
| end_date | TIMESTAMP | Report period end |
| pdf_url | TEXT | URL to generated PDF (optional) |
| created_at | TIMESTAMP | When generated |

---

## 🔧 API Functions

All database operations are in `src/lib/db-api.ts`:

### User Operations
```typescript
createUser(name, email, password)
authenticateUser(email, password)
getUserById(userId)
```

### Contact Operations
```typescript
getContacts(userId)
addContact(userId, name, phone, relation?)
deleteContact(contactId, userId)
```

### Incident Operations
```typescript
createIncident(userId, type, data)
getIncidents(userId, limit?)
getIncidentsByDateRange(userId, startDate, endDate)
```

### Voice Settings
```typescript
getVoiceSettings(userId)
updateVoiceSettings(userId, keyword, repeatCount, enabled)
```

### Reports
```typescript
createReport(userId, title, description, incidentIds, startDate, endDate)
getReports(userId)
getReportById(reportId, userId)
```

---

## 🔒 Security Features

### Password Security
- ✅ Bcrypt hashing (10 rounds)
- ✅ Passwords never stored in plain text
- ✅ Secure comparison

### Data Privacy
- ✅ User data isolated by user_id
- ✅ Cascade delete (delete user → delete all data)
- ✅ No cross-user data access

### SQL Injection Protection
- ✅ Drizzle ORM with parameterized queries
- ✅ Type-safe database operations
- ✅ No raw SQL strings

---

## 📱 Migration from LocalStorage

### Automatic Migration (Future Feature)

When users first login with database enabled:
1. Check localStorage for existing data
2. Migrate contacts to database
3. Migrate incidents to database
4. Migrate voice settings to database
5. Clear localStorage
6. Show success message

### Manual Migration

If you have existing users:
1. Export localStorage data
2. Create user accounts
3. Import data via API
4. Verify migration
5. Clear localStorage

---

## 🧪 Testing Database

### Local Testing

```bash
# Start dev server
npm run dev

# Open Drizzle Studio (database GUI)
npm run db:studio
# Opens at http://localhost:4983
```

### Test Operations

1. **Register User**
   - Go to /register
   - Create account
   - Check users table in Drizzle Studio

2. **Add Contact**
   - Go to /contacts
   - Add contact
   - Check contacts table

3. **Trigger SOS**
   - Double-tap SOS button
   - Check incidents table

4. **Generate Report**
   - Go to /reports
   - Create report
   - Check reports table
   - Download PDF

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Vercel Postgres database created
- [ ] Environment variables added to Vercel
- [ ] Schema pushed: `npm run db:push`
- [ ] Test locally with real database
- [ ] Verify all CRUD operations work

### After Deploying

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test contact management
- [ ] Test SOS activation
- [ ] Test report generation
- [ ] Verify data persists across sessions

---

## 🐛 Troubleshooting

### Error: "Connection refused"
**Solution**: Check POSTGRES_URL in .env.local

### Error: "Table does not exist"
**Solution**: Run `npm run db:push`

### Error: "Authentication failed"
**Solution**: Verify POSTGRES_PASSWORD is correct

### Error: "Cannot find module '@vercel/postgres'"
**Solution**: Run `npm install`

### Data not persisting
**Solution**: 
1. Check database connection
2. Verify environment variables
3. Check browser console for errors
4. Verify API calls in Network tab

---

## 📊 Database Management

### View Data
```bash
# Open Drizzle Studio
npm run db:studio
```

### Backup Data
```bash
# Export from Vercel Dashboard
# Storage → Postgres → Backups
```

### Reset Database
```bash
# Drop all tables and recreate
npm run db:push
```

---

## 💡 Best Practices

### Development
1. Use `.env.local` for local database
2. Never commit `.env.local` to git
3. Test with real data locally
4. Use Drizzle Studio to inspect data

### Production
1. Use Vercel Postgres for production
2. Enable automatic backups
3. Monitor database usage
4. Set up alerts for errors

### Security
1. Never expose database credentials
2. Use environment variables
3. Validate all user input
4. Sanitize data before storage

---

## 📈 Scaling

### Free Tier Limits (Vercel Postgres)
- 256 MB storage
- 60 hours compute time/month
- Good for ~1000 users

### Upgrade When:
- Storage > 200 MB
- Users > 500
- High traffic
- Need more compute time

### Optimization Tips
1. Index frequently queried columns
2. Limit incident history (e.g., 6 months)
3. Compress video blobs
4. Archive old reports
5. Use pagination for large datasets

---

## 🔗 Useful Links

- **Vercel Postgres Docs**: https://vercel.com/docs/storage/vercel-postgres
- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview
- **Drizzle Kit Docs**: https://orm.drizzle.team/kit-docs/overview

---

## ✅ Quick Commands

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# Open database GUI
npm run db:studio

# Start dev server
npm run dev

# Deploy to Vercel
vercel --prod
```

---

## 🎯 Summary

1. **Create Vercel Postgres database**
2. **Copy environment variables**
3. **Run `npm run db:push`**
4. **Deploy with `vercel --prod`**

**Your database is ready!** 🎉

---

**Need Help?** Check Vercel Postgres documentation or open an issue.
