import React, { useEffect, useRef, useContext, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "@/lib/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  EllipsisVertical,
  Phone,
  Video,
  Mic,
  Image,
  Smile,
  SendHorizontal,
  MapPin,
} from "lucide-react";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const scrollEnd = useRef(null);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = { text: input.trim() };
    setInput("");
    try {
      await sendMessage(newMessage);
    } catch (err) {
      toast.error("Failed to send message.");
      console.error(err);
    }
  };

  const handleSendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await sendMessage({ image: reader.result });
        e.target.value = "";
      } catch (err) {
        toast.error("Failed to send image.");
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 bg-secondary  rounded-(--border-radius-xl) border-2 border-(--border-color)  max-md:hidden">
        <img src={assets.logo_icon} alt="Chat logo" className="max-w-32" />
        <p className="text-4xl font-semibold text-green">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className=" h-full overflow-hidden relative bg-secondary rounded-(--border-radius-xl) border-2 border-(--border-color) ">
      {/* Top Bar */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b  border-(--border-color) ">
        <img
          onClick={() => setSelectedUser(null)}
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-black flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green inline-block" />
          )}
        </p>
        <Video className="text-(--icon-color) hover:text-gray-600 w-5 h-5 cursor-pointer" />
        <Phone className="text-(--icon-color) hover:text-gray-600 w-5 h-5 cursor-pointer" />
        <EllipsisVertical className="text-(--icon-color) hover:text-gray-600 w-5 h-5 cursor-pointer" />
      </div>
      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] bg-primary overflow-y-auto p-3 pb-6">
        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === authUser._id;
          const key = `${msg._id || "temp"}-${msg.createdAt || idx}-${idx}`;

          return (
            <div
              key={key}
              className={`flex gap-2 items-end mb-3 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwn && (
                <img
                  src={selectedUser.profilePic || assets.avatar_icon}
                  alt="Sender"
                  className="w-7 h-7 rounded-full self-end"
                />
              )}

              <div className="flex flex-col max-w-[60%]">
                {msg.image ? (
                  <div className="relative">
                    <img
                      src={msg.image}
                      alt="Sent image"
                      className="rounded-lg  max-w-full"
                    />
                    <span className="absolute bottom-1 right-2 text-xs text-white bg-black/60 px-1 rounded">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`p-2 text-sm rounded-md break-words w-fit max-w-xs border-2 ${
                      isOwn
                        ? "bg-green text-primary rounded-br-none border-[var(--border-color)]"
                        : "bg-secondary text-black rounded-bl-none border-[var(--border-color)]"
                    }`}
                  >
                    <div className="flex items-end justify-between gap-1">
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <span
                        className={`text-[8px] pl-1 pt-1 self-end ${
                          isOwn ? "text-white" : "text-black pr-1"
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {isOwn && (
                <img
                  src={authUser.profilePic || assets.avatar_icon}
                  alt="You"
                  className="w-7 h-7 rounded-full self-end"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      {/* Input Field */}
      <form
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 right-0 md:px-4 px-2 py-2 bg-white"
      >
        <div className="flex items-center gap-3 bg-primary px-4 py-3 rounded-(--border-radius-xl) border-2 border-(--border-color) w-full max-w-3xl mx-auto">
          {/* Mic Icon */}
          <button
            type="button"
            className="text-(--icon-color) hover:text-[var(--icon-color-hover)]"
          >
            <Mic size={20} className="cursor-pointer" />
          </button>

          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-(--text-color-input) px-2"
          />

          {/* Hidden File Input */}
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />

          {/* Icons */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="image"
              className="cursor-pointer text-(--icon-color) hover:text-[var(--icon-color-hover)]"
            >
              <Image size={20} />
            </label>
            <button
              type="button"
              className="cursor-pointer text-(--icon-color) hover:text-[var(--icon-color-hover)]"
            >
              <Smile size={20} />
            </button>
            <button
              type="submit"
              className="cursor-pointer text-(--icon-color) hover:tcursor-pointer ext-[var(--icon-color-hover)]"
            >
              <SendHorizontal size={20} />
            </button>
            <button
              type="button"
              className="cursor-pointer text-(--icon-color) hover:text-[var(--icon-color-hover)]"
            >
              <MapPin size={20} />
            </button>
          </div>
        </div>
      </form>{" "}
      this code responsive code laptop screen mobile screen tablet screen
    </div>
  );
};

export default ChatContainer;
