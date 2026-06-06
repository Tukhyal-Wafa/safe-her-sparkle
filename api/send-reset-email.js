// Vercel Serverless Function to send password reset emails
// This runs on Vercel's servers, not in the browser

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token, resetLink } = req.body;

  // Validate inputs
  if (!email || !token || !resetLink) {
    console.error('Missing required fields:', { email: !!email, token: !!token, resetLink: !!resetLink });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get Resend API key from environment variables
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured in environment variables');
    return res.status(500).json({ 
      error: 'Email service not configured',
      hint: 'Add RESEND_API_KEY to Vercel environment variables'
    });
  }

  console.log('Attempting to send email to:', email);

  try {
    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'SafeGuard <onboarding@resend.dev>', // Use your verified domain later
        to: [email],
        subject: '🔐 Reset Your SafeGuard Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #ffffff;
                padding: 40px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white !important;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
              }
              .button:hover {
                background: linear-gradient(135deg, #059669, #047857);
              }
              .footer {
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-radius: 0 0 10px 10px;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .code {
                background: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                word-break: break-all;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔐 Reset Your Password</h1>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>We received a request to reset your SafeGuard password. If you made this request, click the button below to reset your password:</p>
              
              <center>
                <a href="${resetLink}" class="button">Reset My Password</a>
              </center>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="code">${resetLink}</div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link expires in <strong>1 hour</strong></li>
                  <li>This link can only be used <strong>once</strong></li>
                  <li>If you didn't request this, you can safely ignore this email</li>
                </ul>
              </div>
              
              <p>For your security:</p>
              <ul>
                <li>Never share this link with anyone</li>
                <li>SafeGuard will never ask for your password via email</li>
                <li>Always verify the URL before entering sensitive information</li>
              </ul>
              
              <p>If you have any questions or didn't request this password reset, please contact support immediately.</p>
              
              <p>Stay safe,<br>
              <strong>The SafeGuard Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from SafeGuard. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} SafeGuard. All rights reserved.</p>
            </div>
          </body>
          </html>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', JSON.stringify(data, null, 2));
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: data,
        statusCode: response.status
      });
    }

    console.log('✅ Email sent successfully:', data.id);
    
    return res.status(200).json({ 
      success: true,
      message: 'Password reset email sent successfully',
      emailId: data.id 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
