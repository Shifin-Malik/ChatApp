import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelsLeftBottom, Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";


const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  // Merge authUser at the top of the list
  const allUsers = authUser
    ? [authUser, ...users.filter((user) => user._id !== authUser._id)]
    : users;

  const filteredUsers = input
    ? allUsers.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : allUsers;

  return (
    <div
      className={`bg-secondary dark:bg-(--foreground) h-full  p-5 rounded-(--border-radius-xl) border-2 border-(--border-color) overflow-y-scroll text-black ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-2">
        {authUser && (
          <div className="flex dark:bg-(--foreground)  justify-between items-center gap-2 px-4 py-2 rounded-(--border-radius-xl) border-2 border-(--border-color)">
            <img
              src={authUser.profilePic || assets.avatar_icon}
              alt="User profile"
              className="w-12 rounded-full"
            />
            <p className="flex-1 text-sm text-(--icon-color) flex items-center gap-2">
              {authUser.fullName}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="p-2 rounded-full bg-primary text-white hover:bg-opacity-80 transition"
              >
                <Search className="text-(--icon-color)" size={18} />
              </button>
            </div>
            <div className="relative group cursor-pointer">
              <PanelsLeftBottom className="text-(--icon-color) w-5 h-5" />
            </div>
            <div className="relative group cursor-pointer">
              <ModeToggle className="text-(--icon-color)" />
            </div>

          </div>
        )}
      </div>
      {showSearch && (
        <div className="bg-primary dark:bg-(--foreground) rounded-(--border-radius-xl) border-2 border-(--border-color) flex items-center gap-2 py-3 px-4">
          <Search className="text-(--icon-color)" size={15} />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-black text-sm placeholder-(--text-color-input) flex-1"
            placeholder="Search User..."
          />
        </div>
      )}
      <div className="flex flex-col mt-2">
        
        <div className="flex justify-center w-full mb-4">
          <Tabs defaultValue="all" className="w-full max-w-xs">
            <TabsList className="w-full justify-between bg-primary dark:bg-(--foreground)  h-10  shadow-sm dark:shadow-green">
              <TabsTrigger
                value="all"
                className="w-full data-[state=active]:text-primary rounded-2xl  text-xs"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="personal"
                className="w-full data-[state=active]:text-primary rounded-2xl  text-xs"
              >
                Personal
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="w-full data-[state=active]:text-primary rounded-2xl  text-xs"
              >
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user),
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={user._id || index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-2xl cursor-pointer max-sm:text-sm 
            ${
              selectedUser?._id === user._id
                ? "bg-[#F2F2F2] dark:bg-(--foreground) rounded-(--border-radius-xl) border-2 border-(--border-color) dark:border-(--border-color) "
                : ""
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="font-medium text-sm text-black dark:text-(--text-color)">
                {user._id === authUser?._id
                  ? `${user.fullName} (You)`
                  : user.fullName}
              </p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-secondary text-xs">Online</span>
              ) : (
                <span className="text-input text-xs">Offline</span>
              )}
            </div>
            {unseenMessages?.[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-green text-input">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
