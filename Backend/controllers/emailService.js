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
  subject: "🚦 Your Wheelzy OTP — Let’s Get You on the Road!",
  html: `
    <div style="font-family:Arial, sans-serif; max-width:450px; margin:auto; padding:20px; border-radius:10px; 
      background:#ffffff; border:1px solid #eee; box-shadow:0 4px 10px rgba(0,0,0,0.06)">
      
      <h2 style="text-align:center; color:#E23744; margin-bottom:5px;">🚗 Welcome to Wheelzy</h2>
      <p style="text-align:center; color:#444; margin-top:0;">
        Good rides. Good vibes. ❤️
      </p>

      <p style="font-size:15px; color:#333; line-height:1.6;">
        Hey there!  
        We're excited to have you join the Wheelzy community — where every journey matters.
        You're just one step away from unlocking a smoother and safer travel experience.
      </p>

      <div style="text-align:center; margin:25px 0;">
        <p style="font-size:14px; margin-bottom:8px; color:#666;">Your verification code</p>
        <h1 style="font-size:36px; color:#E23744; letter-spacing:6px; margin:0;">
          ${otp}
        </h1>
        <small style="display:block; margin-top:10px; color:#999;">(valid for only 5 minutes ⏳)</small>
      </div>

      <p style="font-size:15px; color:#333; line-height:1.6;">
        Thank you for trusting Wheelzy.  
        With every ride, you're helping build a platform that empowers drivers, supports communities, 
        and makes travel easier for everyone. 🌍
      </p>

      <p style="font-size:14px; color:#444; margin-top:25px;">
        If you didn't request this code, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">
      
      <p style="text-align:center; color:#999; font-size:13px;">
        Made with ❤️ by Team Wheelzy<br>
        © ${new Date().getFullYear()} Wheelzy. All rights reserved.
      </p>
    </div>
  `,
};


    await transporter.sendMail(mailOptions);
    console.log(`📩 OTP sent successfully to: ${email}`);

  } catch (error) {
    console.error("❌ Email sending error:", error.message);
  }
}


module.exports = sendOTP;
