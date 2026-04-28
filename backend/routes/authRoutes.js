const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Generate unique EN-prefixed userId
async function generateUniqueUserId() {
    let userId;
    let exists;
    do {
        const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8-digit
        userId = "EN" + randomNum;
        exists = await User.findOne({ userId });
    } while (exists);
    return userId;
}

// ✅ REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password.length < 4) {
            return res.status(400).json({ message: "Weak password (min 4 chars)" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const userId = await generateUniqueUserId();
        const user = new User({ name, email, password, userId });
        await user.save();

        res.json({
            message: "Registration successful",
            user: { id: user._id, userId: user.userId, name: user.name, email: user.email }
        });

    } catch (err) {
        console.log("[AUTH ERROR] Register:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 🆕 FIX: If legacy user has no userId, generate and save one now
        if (!user.userId) {
            user.userId = await generateUniqueUserId();
            await user.save();
            console.log("[AUTH] Assigned userId to legacy user:", user.userId);
        }

        res.json({
            message: "Login successful",
            user: { id: user._id, userId: user.userId, name: user.name, email: user.email }
        });

    } catch (err) {
        console.log("[AUTH ERROR] Login:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
