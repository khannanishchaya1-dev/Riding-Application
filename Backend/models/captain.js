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
        required: false,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required:true,
      

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
      //added auto-rickshae
      vehicleType: {
        type: String,
        enum: ["car", "motorcycle","auto",],
        required: true,
      },
      numberPlate: {
        type: String,
        required: true,
        unique: true,
      },
    },
    location:{
      lat:{
type:Number,
      },
      lng:{
type:Number,
      }
    },
  },
  { timestamps: true }
);

// Hash password before save

captainSchema.pre("save", function (next) {
  const captain = this;

  // Only hash the password if it has been modified (or is new)
  if (!captain.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");   // ✅ always use hex encoding
  const hashedPassword = createHmac("sha256", salt)
    .update(captain.password)
    .digest("hex");

  captain.salt = salt;
  captain.password = hashedPassword;

  next();
});


// Method to generate token
captainSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    role: "captain",
  };

  return jwt.sign(payload,"$#Nishu@123", { expiresIn: "24h"});
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

const Captain = mongoose.model("Captain", captainSchema);
module.exports = Captain;
