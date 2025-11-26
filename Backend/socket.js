const { Server } = require("socket.io");
const userModel = require("./models/user");
const captainModel = require("./models/captain");
const mongoose = require("mongoose");

let io;

const initializeSocketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`🚗 New socket connected: ${socket.id}`);

    // ==== JOIN ROOM ====
    socket.on("join", async ({ userId, userType }) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(`❌ Invalid userId: ${userId}`);
        return;
      }

      // Join user-specific room
      socket.join(userId);
      console.log(`🏠 Socket ${socket.id} joined room: ${userId} (${userType})`);

      // Optional: store socket id in DB for fallback usage
      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else {
          console.log(`⚠ Unknown userType: ${userType}`);
        }
      } catch (err) {
        console.error("❌ Error saving socket ID in DB:", err);
      }
    });

    // ==== UPDATE CAPTAIN LIVE LOCATION ====
    socket.on("updateCaptainLocation", async ({ captainId, location }) => {
      try {
        if (
          !location ||
          typeof location.lng !== "number" ||
          typeof location.ltd !== "number"
        ) {
          console.log("⚠ Invalid location payload:", location);
          return;
        }

        const geoJSONLocation = {
          type: "Point",
          coordinates: [location.lng, location.ltd],
        };

        await captainModel.findByIdAndUpdate(
          captainId,
          { location: geoJSONLocation },
          { new: true }
        );

        // Broadcast updated location to rider (if ride started)
        io.to(captainId).emit("captain-location-updated", geoJSONLocation);

        console.log(`📍 Captain ${captainId} location updated:`, geoJSONLocation);
      } catch (err) {
        console.error("❌ Location update error:", err);
      }
    });

    // ==== CUSTOM TEST EVENT ====
    socket.on("customEvent", (data) => {
      console.log(`📩 Custom event from ${socket.id}:`, data);
    });

    // ==== DISCONNECT ====
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

// ==== UNIVERSAL MESSAGE SENDER ====
// Instead of socketId → use room (stable identifier)
const sendSocketMessageTo = (userId, { event, data }) => {
  if (!io) {
    return console.error("❌ Socket server not initialized.");
  }

  io.to(userId).emit(event, data);
  console.log(`🚀 Sent "${event}" to room ${userId}`, data);
};

module.exports = {
  initializeSocketConnection,
  sendSocketMessageTo,
};
