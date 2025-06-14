import { LoaderIcon } from 'lucide-react'
import React from 'react'

const ChatLoader = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-4'>
        <LoaderIcon className='size-10 animate-spin text-primary' />
        <p className='mt-4 text-center tect-lg font-mono'>Connecting to Chat...</p>
    </div>
  )
}

export default ChatLoader