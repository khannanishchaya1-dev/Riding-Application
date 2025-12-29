const express = require("express");
const Ride = require("../models/ride");
const router = express.Router();

router.post("/summary", async (req, res) => {
  try {
    const { captainId } = req.body;
    const rides = await Ride.find({ captain: captainId, status: "COMPLETED" });

    if (!rides.length)
      return res.json({ summary: "🚗 No completed rides yet." });

    const totalRides = rides.length;
    const totalEarned = rides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const avgEarning = (totalEarned / totalRides).toFixed(2);

    // Favorite pickup area
    const pickupCount = {};
    rides.forEach(r => {
      pickupCount[r.origin] = (pickupCount[r.origin] || 0) + 1;
    });
    const favPickup = Object.entries(pickupCount).sort((a,b) => b[1] - a[1])[0][0];

    // Longest ride by distance
    const longestRide = rides.reduce((a,b) => (a.distance||0) > (b.distance||0) ? a : b);

    const summary = `
🚖 Captain Performance Summary
• Total rides completed: ${totalRides}
• Total earnings: ₹${totalEarned}
• Avg earning per ride: ₹${avgEarning}
• Most active pickup area: ${favPickup}
• Longest ride: ${longestRide.origin} → ${longestRide.destination} (${longestRide.distance} km / ₹${longestRide.fare})
`;

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "⚠ Unable to load analytics." });
  }
});

// ==== Chart Data (For graphs) ====
router.post("/data", async (req, res) => {
  try {
    const { captainId } = req.body;
    const rides = await Ride.find({ captain: captainId, status: "COMPLETED" });

    // Monthly Earnings
    const monthlyEarn = {};
    rides.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      monthlyEarn[key] = (monthlyEarn[key] || 0) + r.fare;
    });

    // 🆕 Pickup Count Fix
    const pickupCount = {};
    rides.forEach(r => {
      const pickup = r.origin;
      pickupCount[pickup] = (pickupCount[pickup] || 0) + 1;
    });

    res.json({
      chartData: {
        monthlyEarn,
        earningsPerRide: rides.map(r => r.fare),
        pickupAreas: pickupCount   // <-- now defined
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: true });
  }
});


module.exports = router;
