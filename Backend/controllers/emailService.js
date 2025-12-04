const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your gmail
    pass: process.env.EMAIL_PASS,   // app password (NOT Gmail password)
  },
});

async function sendOTP(email, otp) {
  try {
    const mailOptions = {
      from: `"Wheelzy 🚗" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Wheelzy Verification OTP",
      html: `
        <h2>Welcome to Wheelzy!</h2>
        <p>Your verification code is:</p>
        <h1 style="color:#E23744;letter-spacing:4px;">${otp}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 OTP sent successfully to: ${email}`);

  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
}


module.exports = sendOTP;
