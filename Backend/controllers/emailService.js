const brevo = require("@getbrevo/brevo");

const client = new brevo.TransactionalEmailsApi();
client.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendOTP(email, otp) {
  try {
    await client.sendTransacEmail({
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email }],
      subject: "🔐 Your Wheelzy OTP Code",
      htmlContent: `
        <div style="font-family:Arial; padding:20px;">
          <h2>Welcome to <strong style="color:#E23744">Wheelzy 🚗</strong></h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#E23744;font-size:32px;letter-spacing:4px;">${otp}</h1>
          <p>This code expires in <strong>10 minutes.</strong></p>
        </div>
      `,
    });

    console.log("📩 OTP sent successfully!");
  } catch (err) {
    console.error(
      "❌ Email sending failed:",
      err.response?.body?.message || err.message
    );
  }
}

module.exports = sendOTP;
