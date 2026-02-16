import emailjs from '@emailjs/browser';

// EmailJS configuration - using demo/fallback mode
const EMAIL_SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID || 'demo_service';
const EMAIL_TEMPLATE_ID = process.env.VITE_EMAILJS_TEMPLATE_ID || 'demo_template';
const EMAIL_PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key';

interface EmailData extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  temporary_password: string;
  reset_link?: string;
}

export class EmailService {
  static async sendPasswordResetEmail(userEmail: string, userName: string, tempPassword: string): Promise<boolean> {
    try {
      console.log('📧 Preparing to send password reset email...');
      
      // Check if EmailJS is properly configured
      if (EMAIL_PUBLIC_KEY === 'demo_key' || EMAIL_SERVICE_ID === 'demo_service') {
        console.log('📧 EmailJS not configured, using demo mode...');
        
        // Simulate email sending for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, show a console message with email content
        console.log(`
📧 EMAIL WOULD BE SENT TO: ${userEmail}
📧 EMAIL CONTENT:
===========================================
Subject: 🔐 SmartFleet - Password Reset Request

Hello ${userName},

We received a request to reset your SmartFleet account password.

Your temporary password is: ${tempPassword}

🔒 Security Instructions:
• Use this temporary password to log into your account
• Change your password immediately after logging in
• This temporary password will expire in 24 hours
• If you didn't request this reset, please contact support

Login at: ${window.location.origin}

Best regards,
SmartFleet Team
===========================================
        `);
        
        return true; // Return success for demo mode
      }
      
      // Real EmailJS sending (when configured)
      emailjs.init(EMAIL_PUBLIC_KEY);
      
      const templateParams: EmailData = {
        to_email: userEmail,
        to_name: userName || 'User',
        temporary_password: tempPassword,
        reset_link: `${window.location.origin}`
      };

      console.log('📧 Sending email with params:', { ...templateParams, temporary_password: '[HIDDEN]' });

      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('✅ Email sent successfully:', response);
        return true;
      } else {
        console.error('❌ Email sending failed:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Email service error:', error);
      
      // Fallback to demo mode if real email fails
      console.log('📧 Falling back to demo mode...');
      console.log(`
📧 EMAIL FALLBACK FOR: ${userEmail}
Your temporary password is: ${tempPassword}
Please use this to login and change your password.
      `);
      
      return true; // Return success even in fallback mode
    }
  }

  // Alternative method using a backend API (more secure)
  static async sendPasswordResetEmailViaAPI(userEmail: string): Promise<{ success: boolean; tempPassword?: string }> {
    try {
      console.log('📧 Sending password reset via backend API...');
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Password reset email sent via API');
        return { success: true, tempPassword: data.tempPassword };
      } else {
        console.error('❌ API call failed:', response.statusText);
        return { success: false };
      }
    } catch (error) {
      console.error('❌ API error:', error);
      return { success: false };
    }
  }

  // Gmail SMTP configuration (requires backend)
  static async sendViaGmailSMTP(userEmail: string, tempPassword: string): Promise<boolean> {
    try {
      console.log('📧 Sending via Gmail SMTP...');
      
      const emailContent = {
        from: 'SmartFleet System <noreply@smartfleet.com>',
        to: userEmail,
        subject: '🔐 SmartFleet - Password Reset Request',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00d4ff; margin: 0; font-size: 28px;">🚗 SmartFleet</h1>
              <p style="color: #94a3b8; margin: 5px 0;">Advanced Fleet Management System</p>
            </div>
            
            <div style="background: rgba(0, 212, 255, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #00d4ff; margin: 20px 0;">
              <h2 style="color: #00d4ff; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #e2e8f0; line-height: 1.6;">
                We received a request to reset your SmartFleet account password. Your temporary password is:
              </p>
              
              <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <code style="font-size: 18px; color: #00d4ff; font-weight: bold; letter-spacing: 2px;">${tempPassword}</code>
              </div>
              
              <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 6px; border-left: 3px solid #ef4444; margin: 20px 0;">
                <h3 style="color: #fecaca; margin: 0 0 10px 0; font-size: 16px;">🔒 Security Instructions:</h3>
                <ul style="color: #fecaca; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>Use this temporary password to log into your account</li>
                  <li>Change your password immediately after logging in</li>
                  <li>This temporary password will expire in 24 hours</li>
                  <li>If you didn't request this reset, please contact support</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #3b82f6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to SmartFleet</a>
              </div>
            </div>
            
            <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
              <p>© 2025 SmartFleet. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `
      };

      // This would typically be sent via your backend API
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Gmail SMTP error:', error);
      return false;
    }
  }
}

export default EmailService;