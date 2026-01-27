const Groq = require("groq-sdk");
const express = require("express");
const router = express.Router();
const knowledge = `
Gadigo is a ride-booking platform.

Ride Booking:
- Users select pickup and drop location
- Fare is calculated using distance and vehicle type
- When a ride is requested, the system searches for drivers for 30 seconds within a 5 km radius
- If no driver accepts, the system retries searching again
- Drivers (captains) accept rides manually

Driver Arrival & Ride Start:
- When the driver reaches the pickup location, both user and captain can call each other through the app
- Captain asks for OTP to start the ride
- Ride cannot start without OTP verification

Ride Status Flow:
- searching → accepted → ongoing → completed

Payments:
- Supports Wallet, Razorpay (online), and Cash payments
- Wallet balance must be sufficient before booking (if wallet is selected)
- Users can also pay online using Razorpay after the ride
- Cash payment option is available

Cancellations:
- Free cancellation within 2 minutes of booking
- After 2 minutes, a small cancellation fee applies
- Both user and captain can cancel the ride (as per rules)

Live Features:
- Live ride tracking is enabled during the trip

Drivers (Captains):
- Captains can go online/offline anytime
- Captains can view their earnings in their profile
- Captains can see their ride history and ride summary

Users:
- Users can view their ride history
- Users can see ride summaries in their profile
- Users can report issues from trip history

Account & Safety:
- Admin (Aldin) can block accounts if suspicious activity is detected
Support:
- Users can contact support for any issues to suppoprt@gadigo
`;


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/ai-chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are Gadigo's AI assistant.
Only answer based on the information below.
If question is outside Gadigo, say you don't know.

${knowledge}
          `,
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "AI error" });
  }
});
module.exports = router;