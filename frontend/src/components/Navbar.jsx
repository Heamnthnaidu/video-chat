import React from 'react'
import { getAuthUser, logout } from '../lib/api.js'
import { Link, useLocation } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react'
import ThemeSelector from './ThemeSelector.jsx'
import useAuthUser from '../hooks/useAuthUser.js'

const Navbar = () => {
    const { authUser } = useAuthUser()
    const location = useLocation()
    const isChatpage = location.pathname?.startsWith('/chat')

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    })


    return (
        <nav className='bg-base-200 border-b border-base-200 sticky top-0 z-30 h-16 flex items-center'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-end w-full'>
                    {/**logo if we are in chat page */}
                    {
                        isChatpage && (
                            <div className='pl-5'>
                                <Link to='/' className='flex items-center gap-2.5'>
                                    <ShipWheelIcon className='size-9 text-primary' />
                                    <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                                        Streamify
                                    </span>
                                </Link>
                            </div>
                        )
                    }

                    <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                        <Link to='/notifications'>
                            <button className='btn btn-ghost btn-circle'>
                                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
                            </button>
                        </Link>

                        <ThemeSelector />

                        <div className='avatar'>
                            <div className='w-9 rounded-full'>
                                <img src={authUser?.profilePic} alt="User Avatar" rel='noreferrer' />
                            </div>
                        </div>

                        <button className='btn btn-ghost btn-circle' onClick={mutate}>
                            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar