import Message from "../models/Message.js";
import User from '../models/User.js';
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from '../server.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
    const unseenMessages = {};

    await Promise.all(filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({ senderId: user._id, receiverId: userId, seen: false });
      if (count > 0) unseenMessages[user._id] = count;
    }));

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.otherUserId;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany({ senderId: selectedUserId, receiverId: myId, seen: false }, { seen: true });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    message.seen = true;
    await message.save();
    res.status(200).json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
