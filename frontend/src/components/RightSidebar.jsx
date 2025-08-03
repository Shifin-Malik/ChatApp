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
    <div className={`bg-secondary dark:bg-(--foreground) rounded-(--border-radius-xl) border-2 border-(--border-color) text-black w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pt-8 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-sm font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green'></p>}
         <p className='dark:text-(--text-color)'>{selectedUser.fullName}</p> 
        </h1>
        <p className='px-6 mx-auto text-input dark:text-(--text-color) '>{selectedUser.bio}</p>
      </div>
      <hr className='border border-(--border-color) my-4' />
      <div className='px-5 text-xs'>
        <p className='dark:text-(--text-color)'>Media</p>
           <div className="flex justify-center w-full mb-4 mt-3">
  <Tabs defaultValue="media" className="w-full max-w-xs">
    <TabsList className="w-full justify-between bg-primary dark:bg-(--forground) h-10  shadow-sm">
      <TabsTrigger
        value="media"
        className="w-full data-[state=active]:text-primary rounded-2xl text-xs"
      >
        Media
      </TabsTrigger>
      <TabsTrigger
        value="link"
        className="w-full data-[state=active]:text-primary rounded-2xl text-xs"
      >
        Link
      </TabsTrigger>
      <TabsTrigger
        value="docs"
        className="w-full data-[state=active]:text-primary rounded-2xl text-xs"
      >
        Docs
      </TabsTrigger>
    </TabsList>
  </Tabs>
</div> 
        <div className='mt-2 max-h-[150px] overflow-y-scroll grid grid-cols-3 gap-4 opacity-80'>
          {msgImages.map((url, idx) => (
            <div key={idx} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-40px rounded-(--border-radius-xl)' />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 
       border-none text-primary  text-sm  py-2 px-20'>
        Logout
      </Button>
    </div>
  )
}

export default RightSidebar
