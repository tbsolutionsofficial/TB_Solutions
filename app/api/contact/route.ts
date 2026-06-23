import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, domain, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // CONTACT_EMAIL_USER = Gmail address used to SEND (e.g. yourgmail@gmail.com)
    // CONTACT_EMAIL_PASSWORD = Gmail App Password (16-char, from Google Account → Security → App Passwords)
    const senderEmail = process.env.CONTACT_EMAIL_USER || "tbsolutions.official@gmail.com";
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "tbsolutions.official@gmail.com";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: process.env.CONTACT_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"TB Solutions Contact" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `New Project Inquiry from ${name} — ${domain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #cc785c; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 20px;">New Project Inquiry</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">via TorchBearer Solutions</p>
          </div>
          <div style="background: #faf9f5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e6dfd8;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; color: #6c6a64; font-size: 13px; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #141413;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6c6a64; font-size: 13px;">College/Company</td><td style="padding: 8px 0; color: #3d3d3a;">${company}</td></tr>
              <tr><td style="padding: 8px 0; color: #6c6a64; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #cc785c;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6c6a64; font-size: 13px;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #cc785c;">${phone}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6c6a64; font-size: 13px;">Domain</td><td style="padding: 8px 0; color: #3d3d3a;">${domain}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e6dfd8; margin: 0 0 16px;" />
            <h3 style="color: #141413; font-size: 15px; margin: 0 0 8px;">Message</h3>
            <p style="color: #3d3d3a; line-height: 1.7; margin: 0; font-size: 14px;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="font-size: 11px; color: #6c6a64; text-align: center; margin-top: 16px;">
            Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
