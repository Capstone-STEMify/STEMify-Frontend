import React from 'react'
import ProfileDetails from '../components/ProfileDetails'
import ProfileSideBar from '../components/ProfileSideBar'

export default function Profile() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col gap-6 p-4 lg:flex-row'>
          <ProfileSideBar />
          <ProfileDetails />
        </div>
      </div>
    </div>
  )
}
