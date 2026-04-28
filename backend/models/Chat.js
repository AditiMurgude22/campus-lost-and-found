const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true   // ✅ IMPORTANT (this fixes your issue)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Chat", chatSchema);