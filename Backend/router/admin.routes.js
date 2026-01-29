const express = require("express");
const router = express.Router();
const { adminLogin, createAdmin,getAdminStats, getAllUsers,getAllCaptains,getAllRides,getRideStats, blockUnblockUser, blockUnblockCaptain,getAllReports,updateReportStatus } = require("../controllers/admin.controller");

// ⛔ only manually create admin 1 time then disable this route
// router.post("/create", createAdmin);

router.post("/login", adminLogin);
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/captains", getAllCaptains);
router.get("/rides", getAllRides);
router.get("/ride-stats", getRideStats);
router.post("/block-user/:userId",blockUnblockUser);
router.post("/block-captain/:captainId",blockUnblockCaptain);
router.get("/reports",getAllReports);
router.put("/report-status/:id",updateReportStatus);

module.exports = router;
