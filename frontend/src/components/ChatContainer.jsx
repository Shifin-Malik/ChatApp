import React, { useEffect, useRef, useContext, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

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
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="Chat logo" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Top Bar */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="User profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6">
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
                  <img
                    src={msg.image}
                    alt="Sent image"
                    className="rounded-lg border border-gray-600"
                  />
                ) : (
                  <p
                    className={`p-2 text-white text-sm rounded-lg break-words ${
                      isOwn
                        ? "bg-blue-600 rounded-br-none"
                        : "bg-violet-500/40 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {formatMessageTime(msg.createdAt)}
                </span>
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
        className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/10"
      >
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm p-3 text-white placeholder-gray-400 bg-transparent outline-none"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <button type="submit">
          <img
            src={assets.send_button}
            alt="Send"
            className="w-7 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
