const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

async function sendOTP(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"Wheelzy 🚗" <khannanishchaya1@gmail.com>`, // verified sender
      to: email,
      subject: "🔐 Your Wheelzy OTP",
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2>Welcome to Wheelzy 🚗</h2>
          <p>Here is your OTP:</p>
          <h1 style="color:#E23744; font-size:32px; letter-spacing:4px;">
            ${otp}
          </h1>
          <p>This OTP expires in <strong>10 minutes</strong>.</p>
        </div>`,
    });

    console.log("📩 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
}

module.exports = sendOTP;
