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
    console.log(`⚡ Socket connected: ${socket.id}`);

    // ===============================
    // JOIN USER / CAPTAIN PERSONAL ROOM
    // ===============================
    socket.on("join", async ({ userId, userType }) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) return;
      socket.join(userId);
      console.log(`🏠 ${userType} joined personal room: ${userId}`);

      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
        if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (err) {
        console.error("❌ Failed to update socketId:", err);
      }
    });

    // ===============================
    // JOIN RIDE ROOM
    // ===============================
    socket.on("join-ride", ({ rideId }) => {
      if (!rideId) return;
      socket.join(rideId);
      console.log(`🚕 Socket ${socket.id} joined ride room: ${rideId}`);
    });

    // ===============================
    // CAPTAIN LIVE LOCATION UPDATE
    // ===============================
    socket.on("updateCaptainLocation", async ({ captainId, rideId, lat, lon }) => {
      try {
        if (!rideId || typeof lat !== "number" || typeof lon !== "number") {
          return console.log("⚠ Invalid GPS payload");
        }

        const geoLoc = { type: "Point", coordinates: [lon, lat] };

        // save captain latest location in DB
        await captainModel.findByIdAndUpdate(captainId, { location: geoLoc });

        // 🚀 Send location ONLY to user inside ride room
        io.to(rideId).emit(`location-update-${rideId}`, {
          lat,
          lon,
          captainId,
        });

        console.log(`📍 GPS → Captain:${captainId} → Ride:${rideId}`, { lat, lon });
      } catch (err) {
        console.error("❌ GPS ERROR:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
};

// send socket message helper
const sendSocketMessageTo = (userId, { event, data }) => {
  if (!io) return console.error("❌ Socket server not initialized");
  io.to(userId).emit(event, data);
};

module.exports = { initializeSocketConnection, sendSocketMessageTo };
