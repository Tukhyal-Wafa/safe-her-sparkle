# 🐛 Email Debugging Guide

## Problem: Not Receiving Password Reset Emails

This guide will help you identify and fix the issue.

---

## ✅ Fixed Issues

### 1. Vercel Routing Configuration
**Problem**: The `vercel.json` was redirecting ALL routes (including `/api/*`) to `index.html`, preventing the serverless function from being called.

**Solution**: Updated `vercel.json` to exclude API routes:
```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",  // ✅ Exclude /api/* routes
      "destination": "/index.html"
    }
  ]
}
```

### 2. Added Enhanced Logging
**Added to serverless function**:
- CORS headers for cross-origin requests
- Detailed error logging
- Request validation logging
- Resend API response logging

**Added to frontend**:
- Console logs for debugging
- API response status tracking
- Detailed error messages

---

## 🔍 How to Debug

### Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab when you submit the forgot password form.

**Expected Output (Success)**:
```
🔄 Sending password reset email...
Email: user@example.com
Reset Link: https://your-app.com/reset-password?token=xxx
📨 Email API Response Status: 200
📨 Email API Response Data: { success: true, emailId: "..." }
✅ Password reset email sent successfully!
Email ID: re_xxxxxxxxx
```

**Error Indicators**:

#### A. 404 Error (Function Not Found)
```
❌ POST /api/send-reset-email 404 (Not Found)
```
**Cause**: Serverless function not deployed or routing issue
**Fix**: 
1. Make sure you pushed the latest code with fixed `vercel.json`
2. Redeploy: `vercel --prod` or `git push`
3. Wait 1-2 minutes for deployment to complete

#### B. 500 Error (Email Service Not Configured)
```
📨 Email API Response Status: 500
📨 Email API Response Data: { 
  error: "Email service not configured",
  hint: "Add RESEND_API_KEY to Vercel environment variables"
}
```
**Cause**: `RESEND_API_KEY` not set in Vercel
**Fix**: Follow Step 2 below

#### C. 500 Error (Resend API Error)
```
📨 Email API Response Status: 500
📨 Email API Response Data: { 
  error: "Failed to send email",
  details: { ... }
}
```
**Cause**: Issue with Resend API (invalid key, rate limit, etc.)
**Fix**: Follow Step 3 below

#### D. Network Error
```
❌ Email API error: TypeError: Failed to fetch
```
**Cause**: Network issue or CORS problem
**Fix**: 
1. Check your internet connection
2. Try redeploying with the updated CORS headers

---

### Step 2: Verify Environment Variable

#### Check in Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Look for `RESEND_API_KEY`

**Should see**:
```
Name:  RESEND_API_KEY
Value: re_••••••••••••••••••••••••
Environments: ✅ Production ✅ Preview ✅ Development
```

**If missing or incorrect**:
1. Click "Add New"
2. Name: `RESEND_API_KEY`
3. Value: Your Resend API key (starts with `re_`)
4. Select all environments
5. **Important**: Redeploy after adding!

#### Redeploy After Adding Variable
```bash
# Option 1: Automatic via git
git commit --allow-empty -m "Trigger redeploy"
git push

# Option 2: Manual via CLI
vercel --prod

# Option 3: Via Dashboard
Go to Deployments → Click "..." → Redeploy
```

---

### Step 3: Verify Resend API Key

#### Check Your API Key
1. Go to https://resend.com/api-keys
2. Check if your API key exists
3. Verify it has "Sending access" permission

#### Test Your API Key
You can test it directly in your browser console:

```javascript
// Go to https://resend.com and open console, then run:
fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer re_YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    from: 'onboarding@resend.dev',
    to: ['your-email@example.com'],
    subject: 'Test Email',
    html: '<p>This is a test</p>'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

**Expected response**:
```json
{
  "id": "re_xxxxxxxxx"
}
```

**If error**:
- Invalid API key → Create a new one
- Rate limit → Wait or upgrade plan
- Invalid email → Check email format

---

### Step 4: Check Vercel Function Logs

#### View Real-Time Logs
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** → Click latest deployment
4. Click **Functions** tab
5. Click on `/api/send-reset-email`
6. View logs

**Look for**:
```
✅ Good: "Attempting to send email to: user@example.com"
✅ Good: "Email sent successfully: re_xxxxxxxxx"
❌ Bad: "RESEND_API_KEY not configured"
❌ Bad: "Resend API error: ..."
```

---

### Step 5: Test the API Directly

Test the serverless function directly (after deployment):

```bash
# Replace with your actual deployment URL
curl -X POST https://your-app.vercel.app/api/send-reset-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "token": "test-token-123",
    "resetLink": "https://your-app.com/reset-password?token=test-token-123"
  }'
```

**Expected response (success)**:
```json
{
  "success": true,
  "message": "Password reset email sent successfully",
  "emailId": "re_xxxxxxxxx"
}
```

**Expected response (no API key)**:
```json
{
  "error": "Email service not configured",
  "hint": "Add RESEND_API_KEY to Vercel environment variables"
}
```

---

## 🔧 Common Issues & Solutions

### Issue 1: 404 Error on `/api/send-reset-email`
**Symptoms**: 
- Console shows `404 Not Found`
- Network tab shows 404 status

**Solutions**:
1. ✅ Verify `vercel.json` has the correct rewrite rule (should exclude `/api`)
2. ✅ Verify `api/send-reset-email.js` file exists
3. ✅ Redeploy the application
4. ✅ Clear browser cache and try again

---

### Issue 2: "Email service not configured"
**Symptoms**:
- Console shows 500 error
- Error message mentions RESEND_API_KEY

**Solutions**:
1. ✅ Sign up at https://resend.com/signup
2. ✅ Get API key from https://resend.com/api-keys
3. ✅ Add to Vercel environment variables
4. ✅ **Redeploy** (very important!)
5. ✅ Wait 1-2 minutes for deployment
6. ✅ Try again

---

### Issue 3: "Failed to send email"
**Symptoms**:
- Console shows 500 error
- Error details from Resend API

**Possible Causes**:
1. **Invalid API key**: Create a new one
2. **Rate limit reached**: Wait or upgrade plan (free: 100/day)
3. **Invalid sender**: Use `onboarding@resend.dev` or verified domain
4. **Invalid recipient**: Check email format

**Solutions**:
1. Check Resend dashboard: https://resend.com/emails
2. View error details in function logs
3. Try creating a new API key
4. Verify you haven't hit rate limits

---

### Issue 4: Email Sent but Not Received
**Symptoms**:
- Console shows "Email sent successfully"
- But no email in inbox

**Solutions**:
1. ✅ **Check spam folder** (most common!)
2. ✅ Wait 1-2 minutes (sometimes delayed)
3. ✅ Check Resend dashboard for delivery status
4. ✅ Try different email address
5. ✅ Check email filters/rules
6. ✅ Verify email address is correct

---

### Issue 5: CORS Error
**Symptoms**:
- Console shows CORS error
- "Access-Control-Allow-Origin" error

**Solutions**:
1. ✅ Verify you deployed the updated serverless function with CORS headers
2. ✅ Redeploy the application
3. ✅ Clear browser cache
4. ✅ Try in incognito mode

---

## 📋 Deployment Checklist

Follow this checklist before testing:

- [ ] `vercel.json` updated with API route exclusion
- [ ] `api/send-reset-email.js` exists and has CORS headers
- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] `RESEND_API_KEY` added to Vercel environment variables
- [ ] All environments selected (Production, Preview, Development)
- [ ] **Application redeployed** after adding environment variable
- [ ] Waited 1-2 minutes for deployment to complete
- [ ] Browser cache cleared
- [ ] Tested in browser console

---

## 🧪 Testing Steps

### 1. Deploy Latest Code
```bash
# Make sure all changes are committed
git add .
git commit -m "Fix email API routing"
git push origin main

# Or manual deploy
vercel --prod
```

### 2. Wait for Deployment
- Go to Vercel dashboard
- Check deployment status
- Wait for "Ready" status (usually 1-2 minutes)

### 3. Test in Browser
1. Open your deployed app
2. Open browser console (F12)
3. Click "Forgot Password"
4. Enter registered email
5. Submit form
6. **Watch the console for logs**

### 4. Check Results

**Success Indicators**:
```
✅ Console shows: "Email sent successfully"
✅ Toast shows: "Password reset email sent! Check your inbox"
✅ Email arrives within 1-2 minutes
✅ Check spam folder too!
```

**Failure Indicators**:
```
❌ Console shows error messages
❌ Toast shows: "Email service unavailable"
❌ Fallback link appears in UI
→ Follow debugging steps above
```

---

## 📊 Monitoring Email Delivery

### Resend Dashboard
1. Go to https://resend.com/emails
2. View all sent emails
3. Check delivery status
4. View error messages if any

**Status meanings**:
- ✅ **Delivered**: Email successfully sent
- 🔄 **Queued**: Being processed
- ⏸️ **Deferred**: Temporary delay
- ❌ **Bounced**: Invalid email or rejected
- ❌ **Failed**: Error during sending

---

## 💡 Pro Tips

1. **Always check spam folder first** - 80% of "missing emails" are in spam
2. **Check Resend dashboard** - Shows real delivery status
3. **Use browser console** - All errors are logged there
4. **Redeploy after env changes** - Environment variables require redeploy
5. **Wait 1-2 minutes** - Deployments need time to propagate
6. **Test with different email** - Some providers block automated emails
7. **Use fallback link** - Always available in UI if email fails

---

## 🆘 Still Not Working?

### 1. Check Everything
Run through this complete checklist:

```
Resend Setup:
[ ] Signed up at resend.com
[ ] Verified email address
[ ] Created API key
[ ] API key starts with "re_"
[ ] API key has "Sending access" permission

Vercel Setup:
[ ] Added RESEND_API_KEY to environment variables
[ ] Selected all environments (Production, Preview, Development)
[ ] Redeployed after adding variable
[ ] Waited for deployment to complete
[ ] Latest code is deployed

Code:
[ ] vercel.json has correct routing (excludes /api)
[ ] api/send-reset-email.js file exists
[ ] src/pages/ForgotPassword.tsx updated
[ ] Build succeeds with no errors
[ ] All files committed and pushed

Testing:
[ ] Opened app in browser
[ ] Opened browser console (F12)
[ ] Submitted forgot password form
[ ] Watched console for errors
[ ] Checked spam folder
[ ] Waited 2-3 minutes
```

### 2. Use Fallback Link
The app has a built-in fallback system. If email fails, use the backup link shown in the UI to reset your password.

### 3. Check Recent Deployment
Go to Vercel dashboard → Deployments → Functions tab → View logs for detailed error messages.

---

## ✅ Success Checklist

When everything works, you should see:

```
✅ Form submits without errors
✅ Console shows: "Email sent successfully"
✅ Toast notification: "Password reset email sent!"
✅ Email arrives in inbox (or spam) within 1-2 minutes
✅ Email has green SafeGuard branding
✅ "Reset My Password" button works
✅ Can successfully reset password
```

---

**Need more help?** Check the function logs in Vercel dashboard for specific error messages.
