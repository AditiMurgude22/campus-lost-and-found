const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("🚀 Server is running successfully");
});

// ✅ ROUTES
const itemRoutes = require("./routes/itemRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/items", itemRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ DB CONNECT (NO OLD OPTIONS)
mongoose.connect("mongodb://127.0.0.1:27017/lostfound")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ SERVER
const PORT = 5000;
app.listen(PORT, () => {
    console.log("🚀 Server running on http://127.0.0.1:" + PORT);
});