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
      subject: `🚗 Wheelzy Verification Code — You're Almost There!`,
      htmlContent: `
      <div style="font-family:Arial, sans-serif; padding:25px; background:#f7f7f7; border-radius:10px;">

        <h2 style="color:#E23744; text-align:center;">Welcome to Wheelzy 🚗</h2>

        <p style="font-size:16px; line-height:22px;">
          Hey there 👋<br><br>
          We're excited to have you join the <strong>Wheelzy family</strong> — where rides are fast, safe, and stress-free.
        </p>

        <p style="font-size:17px; margin-top:10px;">
          Your verification code is:
        </p>

        <div style="margin:20px auto; text-align:center;">
          <div style="background:#fff; padding:18px 25px; border-radius:12px; display:inline-block; font-size:34px; font-weight:bold; color:#E23744; letter-spacing:6px;">
            ${otp}
          </div>
        </div>

        <p style="font-size:15px; color:#333; text-align:center;">
          This code is valid for the next <strong>10 minutes</strong>.<br>
          Please don't share it with anyone for your safety 🔐
        </p>

        <hr style="margin:25px 0; border: none; border-top:1px solid #ddd;" />

        <p style="font-size:14px; color:#555;">
          Once verified, you’ll be all set to explore rides, connect with trusted captains, and travel with ease 🚕✨
        </p>

        <p style="font-size:14px; color:#777; margin-top:25px;">
          Need support? We're here for you 👉 support@wheelzy.in
        </p>

        <p style="font-size:12px; color:#aaa; margin-top:15px; text-align:center;">
          Made with ❤️ by Wheelzy • Safe rides, happy journeys
        </p>

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
