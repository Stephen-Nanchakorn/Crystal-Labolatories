import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationProps {
  toEmail: string;
  customerName?: string;
  orderId: string;
  licenses: Array<{
    pluginName: string;
    licenseKey: string;
  }>;
}

export async function sendOrderConfirmationEmail({
  toEmail,
  customerName = "Valued Customer",
  orderId,
  licenses,
}: SendOrderConfirmationProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not defined. Email skipped.");
    return;
  }

  // สร้าง HTML กล่อง License Key
  const licenseRows = licenses
    .map(
      (lic) => `
      <div style="background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; font-weight: 600;">Product</div>
        <div style="color: #ffffff; font-size: 16px; font-weight: bold; margin-bottom: 8px;">${lic.pluginName}</div>
        <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; font-weight: 600;">License Key</div>
        <div style="color: #22d3ee; font-family: monospace; font-size: 16px; background-color: #030712; padding: 8px 12px; border-radius: 6px; letter-spacing: 1px; display: inline-block;">
          ${lic.licenseKey}
        </div>
      </div>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Crystal Laboratories</title>
      </head>
      <body style="background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; color: #f3f4f6;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Crystal Laboratories</h1>
            <p style="color: #22d3ee; font-size: 14px; margin-top: 4px;">Order Confirmed & License Issued</p>
          </div>

          <p style="font-size: 15px; color: #d1d5db;">สวัสดีครับคุณ <b>${customerName}</b>,</p>
          <p style="font-size: 14px; color: #9ca3af; line-height: 1.5;">
            ขอบคุณที่สั่งซื้อปลั๊กอินเสียงกับ Crystal Laboratories ออเดอร์ของคุณหมายเลข <b>#${orderId.slice(0, 8)}</b> ชำระเงินเรียบร้อยแล้ว ด้านล่างนี้คือรหัสสิทธิ์การใช้งาน (License Keys) ของคุณ:
          </p>

          <div style="margin: 24px 0;">
            ${licenseRows}
          </div>

          <div style="background-color: #111827; border-left: 4px solid #22d3ee; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
              💡 <b>วิธีเริ่มใช้งาน:</b> เปิดแอป <b>Crystal Access Central</b> หรือตัวปลั๊กอินใน DAW ของคุณ แล้วนำรหัส License Key ไปกรอกเพื่อปลดล็อกสิทธิ์ใช้งานได้ทันที (รองรับสูงสุด 2 เครื่อง)
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://crystal-labolatories-zc28.vercel.app/profile" style="background-color: #06b6d4; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              ไปยังหน้า My Profile เพื่อจัดการเครื่อง
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #1f2937; margin: 32px 0 16px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Crystal Laboratories. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: "Crystal Laboratories <onboarding@resend.dev>", // หรือใส่ชื่อโดเมนของคุณเมื่อ verify โดเมนแล้ว เช่น noreply@yourdomain.com
      to: [toEmail],
      subject: `[Crystal Laboratories] ใบเสร็จและ License Key ของคุณ (#${orderId.slice(0, 8)})`,
      html: emailHtml,
    });
    return data;
  } catch (error) {
    console.error("Failed to send order email:", error);
    return null;
  }
}