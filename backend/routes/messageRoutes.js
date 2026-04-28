const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");

// GET ALL REGISTERED USERS (for chat list)
router.get("/users", async (req, res) => {
    console.log("[DEBUG] GET /api/messages/users hit");
    try {
        const users = await User.find({}, "_id name email").sort({ name: 1 });
        console.log("[DEBUG] Users found:", users.length);
        res.json(users);
    } catch (err) {
        console.log("[DEBUG] Error fetching users:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET CONVERSATION BETWEEN TWO USERS
router.get("/conversation/:userId1/:userId2", async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEND A PRIVATE MESSAGE
router.post("/send", async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        if (!senderId || !receiverId || !text || text.trim() === "") {
            return res.status(400).json({ message: "All fields required" });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text.trim()
        });

        await newMessage.save();
        res.json({ message: "Message sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🆕 GET LAST MESSAGE + UNREAD COUNT FOR EACH USER (for chat list preview)
router.get("/summary/:myUserId", async (req, res) => {
    try {
        const { myUserId } = req.params;

        // Get all messages where this user is either sender or receiver
        const allMessages = await Message.find({
            $or: [
                { senderId: myUserId },
                { receiverId: myUserId }
            ]
        }).sort({ timestamp: -1 });

        // Build summary per other user
        const summary = {};

        allMessages.forEach(msg => {
            const otherId = String(msg.senderId) === String(myUserId)
                ? String(msg.receiverId)
                : String(msg.senderId);

            if (!summary[otherId]) {
                summary[otherId] = {
                    lastMessage: msg.text,
                    lastTimestamp: msg.timestamp,
                    unreadCount: 0
                };
            }

            // Count unread messages sent TO me
            if (String(msg.receiverId) === String(myUserId) && !msg.isRead) {
                summary[otherId].unreadCount++;
            }
        });

        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🆕 MARK ALL MESSAGES IN CONVERSATION AS READ
router.post("/mark-read", async (req, res) => {
    try {
        const { myUserId, otherUserId } = req.body;

        if (!myUserId || !otherUserId) {
            return res.status(400).json({ message: "myUserId and otherUserId required" });
        }

        const result = await Message.updateMany(
            {
                senderId: otherUserId,
                receiverId: myUserId,
                isRead: false
            },
            { $set: { isRead: true } }
        );

        res.json({ message: "Messages marked as read", modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
