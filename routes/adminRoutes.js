const express = require("express");
const router = express.Router();
const  authMiddleware  = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/role");
const { createAdmin } = require("../controllers/admincontroller");

// Only logged-in admins can create another admin
router.post("/create-admin", authMiddleware, isAdmin, createAdmin);

module.exports = router;
