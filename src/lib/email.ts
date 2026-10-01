import nodemailer from 'nodemailer';

export async function sendDownloadEmail({
  fullName,
  email,
  productTitle,
  amount,
  downloadUrl,
  orderId,
}: {
  fullName: string;
  email: string;
  productTitle: string;
  amount: number;
  downloadUrl: string;
  orderId: string;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER or EMAIL_PASS not set, skipping email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Download Link for ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #4f46e5;">Thank you for your purchase!</h2>
        <p>Dear ${fullName},</p>
        <p>Your payment has been successfully processed. Here are your order details:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #1e293b;">Order Details:</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Product:</strong> ${productTitle}</p>
          <p><strong>Amount Paid:</strong> ₹${amount}</p>
          <p><strong>Date:</strong> ${new Date().toDateString()}</p>
        </div>
        
        <p><strong>Download your digital file:</strong></p>
        <p style="margin: 25px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #4f46e5; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
             Download Now
          </a>
        </p>
        
        <p style="font-size: 13px; color: #64748b; margin-top: 30px;">
          If you have questions or did not receive your file, please contact us at ${process.env.EMAIL_USER}.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
