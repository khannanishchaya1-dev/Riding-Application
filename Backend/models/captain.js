const mongoose = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const { type } = require('os');

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true, // ⭐ Setting lastname to required, matching route validation
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: { // ⭐ NEW FIELD: Captain's phone number
      type: String,
      required: true,
      unique: true, // Phone numbers should typically be unique
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: {
        type: String,
        required: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      vehicleType: {
        type: String,
        enum: ["car", "motorcycle", "auto", "truck"], // ⭐ UPDATED: Added "auto" and kept "truck" (from route validation)
        required: true,
      },
      vehicleModel: { // ⭐ NEW FIELD: Car Name/Model
        type: String,
        required: true,
      },
      numberPlate: {
        type: String,
        required: true,
        unique: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before save

captainSchema.pre("save", function (next) {
  const captain = this;

  // Only hash the password if it has been modified (or is new)
  if (!captain.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex"); // ✅ always use hex encoding
  const hashedPassword = createHmac("sha256", salt)
    .update(captain.password)
    .digest("hex");

  captain.salt = salt;
  captain.password = hashedPassword;

  next();
});

// Method to generate token
captainSchema.methods.generateAuthToken = function () {
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    _id: this._id,
    email: this.email,
    role: "captain",
  };

  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

// Method to validate password
captainSchema.methods.matchPasswordAndGenerateToken = async function (password) {
  const salt = this.salt;
  const hashedPassword= this.password;

  const hashedPasswordProvided = createHmac("sha256",salt)
    .update(password)
    .digest("hex");

  if (this.password !== hashedPasswordProvided) {
    throw new Error("Incorrect password");
  }

  return this.generateAuthToken();
};

const captainModel = mongoose.model("captain", captainSchema);
module.exports = captainModel;