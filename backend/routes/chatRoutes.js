const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// SEND MESSAGE
router.post("/send", async (req, res) => {
    try {
        const newMsg = new Chat(req.body);
        await newMsg.save();
        res.json({ message: "Message sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL CHATS (GROUPED)
router.get("/all", async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: -1 });

        // group by itemId
        const grouped = {};

        chats.forEach(msg => {
            const key = msg.itemId;

            if (!grouped[key]) {
                grouped[key] = msg; // keep latest message
            }
        });

        res.json(Object.values(grouped));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET CHAT BY ITEM
router.get("/:itemId", async (req, res) => {
    try {
        const messages = await Chat.find({ itemId: req.params.itemId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;