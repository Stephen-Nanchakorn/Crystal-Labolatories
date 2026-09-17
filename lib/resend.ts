import { Resend } from 'resend';

// ✅ ตรวจสอบว่า RESEND_API_KEY มีค่า
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
}

// ✅ สร้าง Resend instance ถ้ามี API key
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// ✅ Interface สำหรับ Email Response
interface EmailResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// ==================== 1. ส่ง Invoice Email ====================
export async function sendInvoiceEmail(
  to: string,
  invoiceNumber: string,
  invoiceDate: string,
  totalAmount: number,
  currency: string = "USD",
  downloadUrl: string,
  language: string = "en"
): Promise<EmailResponse> {
  
  // ✅ ตรวจสอบว่า Resend instance มีค่า
  if (!resend) {
    console.warn('Resend is not configured. Skipping email send.');
    return {
      success: false,
      error: 'Email service is not configured'
    };
  }

  try {
    const symbol = currency === "THB" ? "฿" : "$";
    
    const subject = language === "th" 
      ? `ใบเสร็จการซื้อ ${invoiceNumber} - Crystal Lab`
      : `Invoice ${invoiceNumber} - Crystal Lab`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .invoice-info { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${language === "th" ? "ใบเสร็จการซื้อ" : "Purchase Invoice"}</h1>
              <h2>${invoiceNumber}</h2>
            </div>
            <div class="content">
              <div class="invoice-info">
                <p><strong>${language === "th" ? "วันที่ออกใบเสร็จ" : "Invoice Date"}:</strong> ${invoiceDate}</p>
                <p><strong>${language === "th" ? "ยอดรวม" : "Total Amount"}:</strong> ${symbol}${totalAmount.toFixed(2)}</p>
              </div>
              
              <p>${language === "th" 
                ? "ขอบคุณที่เลือกใช้บริการ Crystal Lab ใบเสร็จของคุณพร้อมดาวน์โหลดแล้ว" 
                : "Thank you for choosing Crystal Lab. Your invoice is ready for download."}</p>
              
              <a href="${downloadUrl}" class="button">
                ${language === "th" ? "📥 ดาวน์โหลดใบเสร็จ" : "📥 Download Invoice"}
              </a>
              
              <p style="margin-top: 20px;">
                ${language === "th" 
                  ? "ใบเสร็จนี้สามารถดูได้ตลอดเวลาในบัญชีของคุณที่ <a href='https://crystal-labolatories-zc28.vercel.app/profile/invoices'>รายการใบเสร็จ</a>" 
                  : "This invoice can be viewed anytime in your account at <a href='https://crystal-labolatories-zc28.vercel.app/profile/invoices'>My Invoices</a>"}
              </p>
              
              <div class="footer">
                <p>Crystal Lab Audio Plugins</p>
                <p>${language === "th" 
                  ? "สอบถามเพิ่มเติม: support@crystallab.com" 
                  : "Need help? support@crystallab.com"}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Crystal Lab <invoices@crystallab.com>',
      to: to,
      subject: subject,
      html: html
    });

    if (error) {
      console.error("Error sending email:", error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : JSON.stringify(error)
      };
    }

    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return { 
      success: false, 
      error: "Failed to send email" 
    };
  }
}

// ==================== 2. ส่ง Password Reset Email ====================
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  language: string = "en"
): Promise<EmailResponse> {
  
  // ✅ ตรวจสอบว่า Resend instance มีค่า
  if (!resend) {
    console.warn('Resend is not configured. Skipping email send.');
    return {
      success: false,
      error: 'Email service is not configured'
    };
  }

  try {
    const subject = language === "th" 
      ? "รีเซ็ตรหัสผ่าน Crystal Lab" 
      : "Reset Your Crystal Lab Password";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { color: #e74c3c; font-size: 12px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${language === "th" ? "รีเซ็ตรหัสผ่าน" : "Password Reset"}</h1>
            </div>
            <div class="content">
              <p>${language === "th" 
                ? "เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชี Crystal Lab ของคุณ" 
                : "We received a request to reset your Crystal Lab account password."}</p>
              
              <a href="${resetLink}" class="button">
                ${language === "th" ? "รีเซ็ตรหัสผ่าน" : "Reset Password"}
              </a>
              
              <p class="warning">
                ${language === "th" 
                  ? "ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาละเว้นอีเมลนี้" 
                  : "This link expires in 1 hour. If you didn't request a password reset, please ignore this email."}
              </p>
              
              <p>${language === "th" 
                ? "หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:" 
                : "Or copy and paste this link in your browser:"}</p>
              <p style="word-break: break-all; color: #666;">${resetLink}</p>
              
              <div class="footer">
                <p>Crystal Lab Audio Plugins</p>
                <p>${language === "th" 
                  ? "สอบถามเพิ่มเติม: support@crystallab.com" 
                  : "Need help? support@crystallab.com"}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Crystal Lab <security@crystallab.com>',
      to: to,
      subject: subject,
      html: html
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : JSON.stringify(error)
      };
    }

    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { 
      success: false, 
      error: "Failed to send email" 
    };
  }
}

// ==================== 3. ส่ง Welcome Email ====================
export async function sendWelcomeEmail(
  to: string,
  userName: string = "",
  language: string = "en"
): Promise<EmailResponse> {
  
  if (!resend) {
    console.warn('Resend is not configured. Skipping email send.');
    return {
      success: false,
      error: 'Email service is not configured'
    };
  }

  try {
    const subject = language === "th" 
      ? "ยินดีต้อนรับสู่ Crystal Lab!" 
      : "Welcome to Crystal Lab!";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .feature-item { background: white; padding: 15px; border-radius: 8px; text-align: center; }
            .feature-icon { font-size: 24px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${language === "th" ? "ยินดีต้อนรับ!" : "Welcome!"}</h1>
              ${userName ? `<h2>${userName}</h2>` : ''}
            </div>
            <div class="content">
              <p>${language === "th" 
                ? "ขอบคุณที่สมัครสมาชิกกับ Crystal Lab! ตอนนี้คุณสามารถเริ่มใช้งานได้แล้ว" 
                : "Thank you for signing up with Crystal Lab! You can now start using our services."}</p>
              
              <div class="features">
                <div class="feature-item">
                  <div class="feature-icon">🎧</div>
                  <div><strong>${language === "th" ? "ปลั๊กอินคุณภาพ" : "Quality Plugins"}</div>
                  <div class="text-sm">${language === "th" ? "เสียงระดับสตูดิโอ" : "Studio-grade sound"}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">💰</div>
                  <div><strong>${language === "th" ? "เครดิตฟรี" : "Free Credits"}</div>
                  <div class="text-sm">${language === "th" ? "เริ่มต้นด้วย $10" : "Start with $10"}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">🔔</div>
                  <div><strong>${language === "th" ? "อัปเดตฟรี" : "Free Updates"}</div>
                  <div class="text-sm">${language === "th" ? "ตลอดการใช้งาน" : "Lifetime updates"}</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">👥</div>
                  <div><strong>${language === "th" ? "ชวนเพื่อนรับเครดิต" : "Refer & Earn"}</div>
                  <div class="text-sm">${language === "th" ? "รับ 10% ทุกการซื้อ" : "Earn 10% per referral"}</div>
                </div>
              </div>
              
              <a href="https://crystal-labolatories-zc28.vercel.app/plugins" class="button">
                ${language === "th" ? "🎵 เริ่มสำรวจปลั๊กอิน" : "🎵 Start Browsing Plugins"}
              </a>
              
              <div class="footer">
                <p>Crystal Lab Audio Plugins</p>
                <p>${language === "th" 
                  ? "สอบถามเพิ่มเติม: support@crystallab.com" 
                  : "Need help? support@crystallab.com"}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Crystal Lab <welcome@crystallab.com>',
      to: to,
      subject: subject,
      html: html
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { 
        success: false, 
        error: typeof error === 'string' ? error : JSON.stringify(error)
      };
    }

    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { 
      success: false, 
      error: "Failed to send email" 
    };
  }
}