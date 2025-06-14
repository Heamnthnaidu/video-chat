import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getOnBoard } from '../lib/api'
import toast from 'react-hot-toast'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants/index.js'

const OnBoarding = () => {

  const queryClient = useQueryClient()

  const { authUser } = useAuthUser()
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || ""
  })

  const { mutate, isPending } = useMutation({
    mutationFn: getOnBoard,
    onSuccess: () => {
      toast.success("Profile Onboarded Successfully")
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  })

  const handleRandomAvator = () => {
    const index = Math.floor(Math.random() * 100) +1
    const randomAvator = `https://avatar.iran.liara.run/public/${index}.png`

    setFormData({...formData, profilePic: randomAvator})
    toast.success("Avatar Changed Successfully")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(formData)
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/*profile pic container */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/*image preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {
                  formData.profilePic ? (
                    <img src={formData.profilePic} alt="profile picture" className='w-full h-full object-cover' />
                  ) : (
                    <div className='flex items-center justify-center h-full'>
                      <CameraIcon className='size-32 text-base-content opacity-40' />
                    </div>
                  )
                }
              </div>
              {/** generate random avator btn */}
              <div className='flex items-center ga-2'>
                <button type='button' onClick={handleRandomAvator} className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/**full name */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input type="text"
                name='fullName'
                placeholder='Your Full Name'
                className='input input-bordered w-full'
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/**Bio */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                name='bio'
                placeholder='Tell others about yourself and your language learning goals'
                className='textarea textarea-bordered h-24 w-full'
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/**languages */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              {/**native language */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full' >
                  <option value=''>Select Your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()} >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/**learning language */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select name="learningLanguage"
                  value={formData.learningLanguage}
                  onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                  className='select select-bordered w-full' >
                  <option value=''>Select Your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()} >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/**location */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>
              <div className="relative">
                 <MapPinIcon className='absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500 z-10' />
                <input 
                  type='text'
                  name='location'
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location:e.target.value})}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country' />
              </div>
            </div>
                  
            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-4 mr-2' />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-4 mr-2' />
                  Onboarding...
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoarding