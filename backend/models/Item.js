const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String,       // lost / found
    location: String,
    category: String,   // ✅ NEW FIELD (IMPORTANT)
    date: {
        type: Date,
        default: Date.now
    },
    image: String,
    ownerId: String,    // ✅ ID of user who posted the item
    ownerName: String   // ✅ Name of user who posted the item
});

module.exports = mongoose.model("Item", itemSchema);
