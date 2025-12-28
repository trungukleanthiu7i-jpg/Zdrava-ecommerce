// server/routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// 📩 Create a new message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 📋 Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🗑️ DELETE message by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
