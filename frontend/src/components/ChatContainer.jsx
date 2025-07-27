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
  Mic, Image, Smile, SendHorizontal, MapPin
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
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-[#fdfdfd] border-3 border-[#EAEFEF] max-md:hidden rounded-2xl">
        <img src={assets.logo_icon} alt="Chat logo" className="max-w-20" />
        <p className="text-3xl font-semibold text-[#00A9FF]">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl h-full overflow-hidden relative bg-[#fdfdfd] border-3 border-[#EAEFEF]">
      {/* Top Bar */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-[#EAEFEF] ">
        <img
        onClick={() => setSelectedUser(null)}
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-black flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-[#00A9FF] inline-block" />
          )}
        </p>
        <Video className="text-gray-400 hover:text-gray-600 w-5 h-5 cursor-pointer" />
        <Phone className="text-gray-400 hover:text-gray-600 w-5 h-5 cursor-pointer" />
        <EllipsisVertical className="text-gray-400 hover:text-gray-600 w-5 h-5 cursor-pointer" />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] bg-gray-100 overflow-y-auto p-3 pb-6">
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
                    className={`p-2 text-sm rounded-md break-words w-fit max-w-xs ${
                      isOwn
                        ? "bg-[#00A9FF] text-white rounded-br-none"
                        : "bg-[#EAEFEF] text-black rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-end justify-between gap-1">
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <span
                        className={`text-[10px] pl-1 pt-1 self-end ${
                          isOwn ? "text-white" : "text-black"
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
  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl w-full max-w-3xl mx-auto">
    {/* Mic Icon */}
    <button type="button" className="text-gray-400 hover:text-gray-600">
      <Mic size={20} />
    </button>

    {/* Message Input */}
    <input
      type="text"
      placeholder="Type a message"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500 text-black px-2"
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
      <label htmlFor="image" className="cursor-pointer text-gray-400 hover:text-gray-600">
        <Image size={20} />
      </label>
      <button type="button" className="text-gray-400 hover:text-gray-600">
        <Smile size={20} />
      </button>
      <button type="submit" className="text-gray-400 hover:text-gray-600">
        <SendHorizontal size={20} />
      </button>
      <button type="button" className="text-gray-400 hover:text-gray-600">
        <MapPin size={20} />
      </button>
    </div>
  </div>
</form> this code responsive code laptop screen mobile screen tablet screen

    </div>
  );
};

export default ChatContainer;
