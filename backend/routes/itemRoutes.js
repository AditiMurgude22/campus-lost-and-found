const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const multer = require("multer");
const path = require("path");

// 📸 MULTER SETUP
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ➕ ADD ITEM (✅ CATEGORY FIX ADDED)
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const newItem = new Item({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            location: req.body.location,

            // ✅ IMPORTANT FIX (CATEGORY SAVE)
            category: req.body.category,

            date: new Date(),
            image: req.file ? req.file.filename : "",
            ownerId: req.body.ownerId || "",
            ownerName: req.body.ownerName || ""
        });

        await newItem.save();

        res.json({ message: "Item added successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// 📥 GET ALL ITEMS
router.get("/all", async (req, res) => {
    try {
        const items = await Item.find();
        console.log("[DEBUG] Items fetched:", items.length);
        items.forEach(i => console.log("[DEBUG] Item image:", i.title, "→", i.image));
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🗑 DELETE ITEM
router.delete("/delete/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;