import React from 'react'
import { useSelector } from 'react-redux'
const Profile = () => {
  const {currentUser} = useSelector(state => state.user)

  return (
    <div className='p-3 max-w-lg m-auto'>
   <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
   <form className='flex flex-col gap-4 '>
<img src={currentUser.avatar} className='rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center mt-2' alt="profile" />
<input type="text" className="border p-3 rounded-lg " placeholder='username' id="username" />
<input type="email" className="border p-3 rounded-lg " placeholder='email' id="email" />
<input type="password" className="border p-3 rounded-lg " placeholder='password' id="password" />
<button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>
UPDATE
</button>
   </form>
   <div className='flex justify-between mt-5'>
    <span className='text-red-700 cursor-pointer font-semibold'>
      Delete Account
    </span>
    <span className='text-red-700 cursor-pointer font-semibold'>
      Sign Out
    </span>
   </div>
   </div>
  )
}

export default Profile