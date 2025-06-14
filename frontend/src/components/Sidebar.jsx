
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from 'lucide-react'

const Sidebar = () => {
    const { authUser } = useAuthUser()
    const location = useLocation()
    const currentpath = location.pathname

    const navigate = useNavigate()

    return (
        <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 '>
            <div onClick={() => navigate('/')} className='m-4 flex items-center gap-2.5'>
                <ShipWheelIcon className='text-primary size-9' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Streamify</span>
            </div>

            <nav className='flex-1 p-4 space-y-1'>
                <Link to='/' className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentpath === '/' ? "btn-active" : ""}`}>
                    <HomeIcon className='size-5 text-base-content opacity-70' />
                    <span>Home</span>
                </Link>

                <Link to='/friends' className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentpath === '/friends' ? "btn-active" : ""}`}>
                    <UsersIcon className='size-5 text-base-content opacity-70' />
                    <span>Friends</span>
                </Link>

                <Link to='/notifications' className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentpath === '/notifications' ? "btn-active" : ""}`}>
                    <BellIcon className='size-5 text-base-content opacity-70' />
                    <span>Notifications</span>
                </Link>
            </nav>
            {/**user profile section */}
            <div className='p-4 border-t border-base-300 mt-auto'>
                <div className='flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='w-10 rounded-full'>
                            <img src={authUser?.profilePic} alt="User Avatar" />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-xs'>{authUser?.fullName}</p>
                        <p className='text-xs text-success flex items-center gap-1'>
                            <span className='size-2 rounded-full bg-success inline-block'>
                            </span>
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar