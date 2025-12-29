const express = require("express");
const Ride = require("../models/ride");
const router = express.Router();
router.post("/data", async (req, res) => {
  try {
    const { userId } = req.body;
    const rides = await Ride.find({ userId });

    if (!rides.length)
      return res.json({ rides: [], chartData: {} });

    // spending per ride
    const spending = rides.map(r => r.fare);

    // ride dates
    const dates = rides.map(r => new Date(r.createdAt).toLocaleDateString());

    // route usage
    const routeCount = {};
    rides.forEach(r => {
      const key = `${r.origin} → ${r.destination}`;
      routeCount[key] = (routeCount[key] || 0) + 1;
    });

    // 🆕 Monthly Spending
    const monthlySpend = {};  // { "Jan 2025": 320, "Feb 2025": 890 }
    rides.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      monthlySpend[key] = (monthlySpend[key] || 0) + r.fare;
    });

    res.json({
      chartData: {
        spending,
        dates,
        routes: routeCount,
        monthlySpend
      }
    });
  } catch (e) {
    res.status(500).json({ error: true });
  }
});


router.post("/summary", async (req, res) => {
  try {
    const { userId } = req.body;
    const rides = await Ride.find({ userId });

    if (!rides.length) {
      return res.json({
        summary: "🚕 You haven't taken any rides yet."
      });
    }

    const totalRides = rides.length;
    const totalSpent = rides.reduce((sum, r) => sum + (r.fare || 0), 0);

    // Favorite Route (most frequent origin → destination)
    const routeCount = {};
    rides.forEach(r => {
      const route = `${r.origin} → ${r.destination}`;
      routeCount[route] = (routeCount[route] || 0) + 1;
    });
    const favRoute = Object.entries(routeCount).sort((a, b) => b[1] - a[1])[0][0];

    // Longest Ride by distance
    const longestRide = rides.reduce((a, b) => (a.distance || 0) > (b.distance || 0) ? a : b);

    // Fastest Ride by duration
    const fastestRide = rides.reduce((a, b) => (a.duration || 0) < (b.duration || 0) ? a : b);

    // Average fare
    const avgFare = (totalSpent / totalRides).toFixed(2);

    // Build formatted summary
    const summaryText = `
🚕 Your Gadigo Ride Summary
• Total rides: ${totalRides}
• Total money spent: ₹${totalSpent}
• Avg fare per ride: ₹${avgFare}
• Favorite route: ${favRoute}
• Longest ride: ${longestRide.origin} → ${longestRide.destination} (${longestRide.distance} km / ₹${longestRide.fare})
• Fastest ride: ${fastestRide.origin} → ${fastestRide.destination} (${fastestRide.duration} mins)
`;

    res.json({ summary: summaryText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "⚠ Unable to generate summary. Try again later." });
  }
});

module.exports = router;
