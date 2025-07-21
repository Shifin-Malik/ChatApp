import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  image: String,
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


const Message = mongoose.model("Message", messageSchema);
export default Message;
