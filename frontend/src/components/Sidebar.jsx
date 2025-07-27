import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EllipsisVertical,Search } from 'lucide-react';

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
      className={`bg-secondary h-full  p-5 rounded-(--border-radius-xl) border-2 border-(--border-color) overflow-y-scroll text-black ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center px-4 py-2">
      <img src={assets.logo_icon} alt="logo" className="w-8 h-8" />
      <h1 className="text-2xl font-bold text-secondary">Textrox</h1>

      <div className="relative group cursor-pointer">
        <EllipsisVertical className="text-(--icon-color) w-5 h-5" />

        <div className="absolute top-full right-0 z-20 w-32 mt-2 p-3 rounded-(--border-radius-xl) border-2 border-(--border-color)  bg-secondary   text-input opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200">
          <p
            onClick={() => navigate("/profile")}
            className="cursor-pointer text-sm hover:text-green"
          >
            Edit Profile
          </p>
          <hr className="my-2 border-t border-green" />
          <p
            onClick={logout}
            className="cursor-pointer text-sm hover:text-green"
          >
            Logout
          </p>
        </div>
      </div>
    </div>

        <div className="bg-primary rounded-(--border-radius-xl) border-2 border-(--border-color) flex items-center gap-2 py-3 px-4 mt-5">
         <Search className="text-(--icon-color)" size={15}/>
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-black text-sm placeholder-(--text-color-input) flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col">
       <div className="flex justify-center w-full mb-4">
  <Tabs defaultValue="all" className="w-full max-w-xs">
    <TabsList className="w-full justify-between bg-primary h-10 rounded-(--border-radius-xl) border-2 border-(--border-color) shadow-sm">
      <TabsTrigger
        value="all"
        className="w-full data-[state=active]:text-primary data-[state=active]:shadow text-xs"
      >
        All
      </TabsTrigger>
      <TabsTrigger
        value="personal"
        className="w-full data-[state=active]:text-primary data-[state=active]:shadow text-xs"
      >
        Personal
      </TabsTrigger>
      <TabsTrigger
        value="groups"
        className="w-full data-[state=active]:text-primary data-[state=active]:shadow text-xs"
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
            ${selectedUser?._id === user._id ? "bg-[#F2F2F2] rounded-(--border-radius-xl) border border-(--border-color) " : ""}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="font-medium text-sm text-black">
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
