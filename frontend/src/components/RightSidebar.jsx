import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import assets from '../assets/assets'
import { Button } from './ui/button'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // Get all the images from the messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image))
  }, [messages])

  return selectedUser && (
    <div className={`bg-[#fdfdfd] rounded-2xl text-black w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pt-8 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-sm font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-[#00A9FF]'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-6 mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4' />
      <div className='px-5 text-xs'>
        <p>Media</p>
           <div className="flex justify-center w-full mb-4 mt-3">
  <Tabs defaultValue="media" className="w-full max-w-xs">
    <TabsList className="w-full justify-between bg-gray-100 h-10 rounded-2xl shadow-sm">
      <TabsTrigger
        value="media"
        className="w-full rounded-2xl data-[state=active]:bg-white data-[state=active]:text-[#00A9FF] data-[state=active]:shadow text-xs"
      >
        Media
      </TabsTrigger>
      <TabsTrigger
        value="link"
        className="w-full rounded-2xl data-[state=active]:bg-white data-[state=active]:text-[#00A9FF] data-[state=active]:shadow text-xs"
      >
        Link
      </TabsTrigger>
      <TabsTrigger
        value="docs"
        className="w-full rounded-2xl data-[state=active]:bg-white data-[state=active]:text-[#00A9FF] data-[state=active]:shadow text-xs"
      >
        Docs
      </TabsTrigger>
    </TabsList>
  </Tabs>
</div> 
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, idx) => (
            <div key={idx} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-[#00A9FF]
      text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </Button>
    </div>
  )
}

export default RightSidebar
