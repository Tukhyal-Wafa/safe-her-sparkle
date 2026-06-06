# 📧 Email Setup Guide - Password Reset Emails

This guide explains how to set up password reset email functionality using Resend API.

## 🎯 Overview

The password reset system sends professional HTML emails to users when they request a password reset. The implementation includes:

- ✅ **Serverless Function**: `/api/send-reset-email.js` (runs on Vercel)
- ✅ **Professional HTML Email**: Branded template with SafeGuard styling
- ✅ **Security Features**: 1-hour token expiration, one-time use links
- ✅ **Fallback Behavior**: Shows reset link in UI if email service unavailable

## 📋 Prerequisites

- Vercel account (for deployment)
- Resend account (free tier: 100 emails/day, 3,000/month)

## 🚀 Setup Instructions

### Step 1: Sign Up for Resend

1. Go to **https://resend.com/signup**
2. Create a free account using your email or GitHub
3. Verify your email address

### Step 2: Get Your API Key

1. Log in to Resend Dashboard: **https://resend.com/api-keys**
2. Click **"Create API Key"**
3. Give it a name (e.g., "SafeGuard Production")
4. Select **"Sending access"** permission
5. Click **"Create"**
6. **Copy the API key** (starts with `re_`) - you won't see it again!

### Step 3: Configure Environment Variable

#### Option A: Vercel Dashboard (Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_`)
   - **Environments**: Select all (Production, Preview, Development)
4. Click **"Save"**
5. Redeploy your application

#### Option B: Local Development

1. Create a `.env` file in the project root (it's gitignored):

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

2. Pull environment variables from Vercel:

```bash
vercel env pull
```

3. Start local development server:

```bash
vercel dev
```

Note: Regular `npm run dev` won't work with serverless functions. Use `vercel dev` instead.

## 🧪 Testing

### Test Locally

1. Make sure you have Vercel CLI installed:

```bash
npm install -g vercel
```

2. Pull environment variables:

```bash
vercel env pull
```

3. Start development server:

```bash
vercel dev
```

4. Open the app in your browser (usually `http://localhost:3000`)
5. Go to **"Forgot Password"** page
6. Enter a registered email address
7. Check your inbox for the reset email

### Test in Production

1. Deploy to Vercel:

```bash
vercel --prod
```

2. Open your deployed app
3. Test the forgot password flow with a real email
4. Check your inbox

## 📨 Email Details

### What Users Will Receive

- **From**: SafeGuard <onboarding@resend.dev>
- **Subject**: 🔐 Reset Your SafeGuard Password
- **Content**:
  - Branded SafeGuard header (white/green theme)
  - Clear "Reset My Password" button
  - Clickable reset link
  - Security warnings (1-hour expiration)
  - Professional footer

### Email Features

- ✅ Responsive HTML design
- ✅ Works on all email clients
- ✅ Professional branding
- ✅ Security best practices
- ✅ 1-hour token expiration
- ✅ One-time use links

## 🔧 Customization

### Use Your Own Domain (Optional)

To send emails from your own domain (e.g., `noreply@yourdomain.com`):

1. Go to **Resend Dashboard → Domains**
2. Click **"Add Domain"**
3. Enter your domain name
4. Add the DNS records shown (MX, TXT, CNAME)
5. Wait for verification (usually 5-30 minutes)
6. Update the `from` field in `/api/send-reset-email.js`:

```javascript
from: 'SafeGuard <noreply@yourdomain.com>',
```

### Customize Email Template

Edit `/api/send-reset-email.js` and modify the HTML in the `html` field:

```javascript
html: `
  <!DOCTYPE html>
  <html>
    <!-- Your custom HTML here -->
  </html>
`
```

## 🛡️ Security Features

- **Token Expiration**: Reset links expire after 1 hour
- **One-Time Use**: Tokens are deleted after successful password reset
- **HTTPS Only**: All links use HTTPS
- **No Password in Email**: Never sends passwords via email
- **Session Clearing**: Clears all sessions after password reset

## 🐛 Troubleshooting

### Email Not Arriving

1. **Check spam folder** - Emails from new domains often go to spam
2. **Verify API key** - Make sure `RESEND_API_KEY` is set correctly
3. **Check Resend dashboard** - View email logs at https://resend.com/emails
4. **Use fallback link** - If email fails, a backup link is shown in the UI

### API Key Not Working

- Make sure you copied the full API key (starts with `re_`)
- Check if the key has "Sending access" permission
- Try creating a new API key
- Verify the environment variable is set in Vercel

### Serverless Function Not Running

- Make sure the file is at `/api/send-reset-email.js` (exact path)
- Redeploy after adding environment variables
- Check Vercel function logs: Dashboard → Deployments → Click deployment → Functions tab

### Local Development Not Working

- Use `vercel dev` instead of `npm run dev`
- Run `vercel env pull` to sync environment variables
- Make sure Vercel CLI is installed: `npm install -g vercel`

## 📊 Rate Limits

### Resend Free Tier
- **100 emails/day**
- **3,000 emails/month**
- Good for testing and small apps

### Resend Pro (if needed)
- **$20/month**
- **50,000 emails/month**
- Custom domains
- Priority support

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] `RESEND_API_KEY` added to Vercel environment variables
- [ ] Application redeployed
- [ ] Test email sent successfully
- [ ] Email received in inbox (check spam)
- [ ] Reset link works correctly
- [ ] Password reset successful

## 📖 Additional Resources

- **Resend Documentation**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference
- **Vercel Serverless Functions**: https://vercel.com/docs/functions
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables

## 💡 Tips

1. **Start with free tier** - 100 emails/day is enough for testing
2. **Use real email for testing** - Don't use temporary email services
3. **Check Resend dashboard** - Monitor email delivery status
4. **Add custom domain later** - onboarding@resend.dev works fine initially
5. **Keep API key secret** - Never commit it to git

## 🎉 You're All Set!

Once you've completed the setup, your password reset system will automatically send professional emails to users. The system includes fallback behavior, so even if email sending fails, users can still reset their password using the backup link shown in the UI.

Need help? Check the troubleshooting section above or review the Resend documentation.
