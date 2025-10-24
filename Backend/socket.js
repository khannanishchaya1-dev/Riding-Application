const { Server } = require("socket.io");
const userModel = require('./models/user');
const captainModel = require('./models/captain');
let io; // To store the socket.io instance
const initializeSocketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (adjust as needed)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    const mongoose = require("mongoose");

socket.on("join", async (data) => {
  const { userId, userType } = data;

  // 🧠 Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log(`❌ Invalid userId: ${userId}`);
    return;
  }

  try {
    if (userType === "user") {
      await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`✅ User ${userId} joined with socket ${socket.id}`);
    } else if (userType === "captain") {
      await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`✅ Captain ${userId} joined with socket ${socket.id}`);
    } else {
      console.log(`⚠️ Unknown userType: ${userType}`);
    }
  } catch (err) {
    console.error("Error updating socketId:", err);
  }
});
socket.on("updateCaptainLocation", async (data) => {
      const { captainId, location } = data;

      try {
        if (
          !location ||
          typeof location.lng !== "number" ||
          typeof location.ltd !== "number"
        ) {
          console.error("❌ Invalid location format:", location);
          return;
        }

        // ✅ Convert to GeoJSON format before saving
        const geoLocation = {
          type: "Point",
          coordinates: [location.lng, location.ltd], // [longitude, latitude]
        };

        await captainModel.findByIdAndUpdate(
          captainId,
          { location: geoLocation },
          { new: true }
        );

        console.log(`✅ Captain ${captainId} location updated:`, geoLocation);
      } catch (err) {
        console.error("❌ Error updating captain location:", err);
      }
    });

    // Listen for a custom event (optional)
    socket.on("customEvent", (data) => {
      console.log(`Received customEvent from ${socket.id}:`, data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
const sendSocketMessageTo = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data); // Emit a message to the specific socket ID
    console.log(`Message sent to ${socketId}:`, messageObject);
  } else {
    console.error("Socket.io is not initialized.");
  }
};
module.exports = {
  initializeSocketConnection,
  sendSocketMessageTo,
};