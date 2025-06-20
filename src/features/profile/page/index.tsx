import React from 'react'
import ProfileDetails from '../components/ProfileDetails';
import ProfileSideBar from '../components/ProfileSideBar';

export default function Profile() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 p-4">
          <ProfileSideBar />
          <ProfileDetails />
        </div>
      </div>
    </div>
  );
}
