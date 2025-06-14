import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants'
import { Link } from 'react-router-dom'

const FriendCard = ({ friend }) => {
  const getLanguageFlag = (language) => {
    if (!language) return null

    const langLower = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[langLower]

    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${language} flag`}
          className='w-5 h-3 object-cover rounded-sm shadow-sm'
        />
      )
    }

    return null
  }

  return (
    <div className='card bg-base-200 shadow-md hover:shadow-lg transition-all rounded-xl'>
      <div className='card-body p-5 space-y-4'>
 
        <div className='flex items-center gap-4'>
          <div className='avatar'>
            <div className='w-12 h-12 rounded-full bg-base-300'>
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          <h3 className='font-semibold text-lg truncate'>{friend.fullName}</h3>
        </div>

        <div className='flex flex-wrap gap-2'>
          <span className='flex items-center gap-1 bg-base-100 border border-base-300 text-sm px-3 py-1 rounded-full'>
            {getLanguageFlag(friend.nativeLanguage)}
            <span className='opacity-70'>Native: {friend.nativeLanguage}</span>
          </span>
          <span className='flex items-center gap-1 bg-base-100 border border-base-300 text-sm px-3 py-1 rounded-full'>
            {getLanguageFlag(friend.learningLanguage)}
            <span className='opacity-70'>Learning: {friend.learningLanguage}</span>
          </span>
        </div>
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
      </div>
    </div>
  )
}

export default FriendCard
