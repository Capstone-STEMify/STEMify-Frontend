'use client'
import React, { useState } from 'react'
import { Camera, Edit, Save } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { useModal } from '@/providers/ModalProvider';

export default function ProfileDetails() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    website: '',
    bio: ''
  });
  const { openModal } = useModal()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Profile data:', formData);
    // Handle save logic here
  };

  return (
    <div className="flex-1">
      {/* Cover Photo Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white transition-colors flex items-center space-x-2 text-sm font-medium">
            <Edit onClick={() => openModal('image')} className="w-4 h-4" />
            <span className="hidden sm:inline">Edit cover photo</span>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 sm:-mt-20 mb-4">
            <img
              src="/images/Rosie.jpg"
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
            <button onClick={() => openModal('image')}  className="absolute -bottom-2 left-28 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 text-sm sm:text-base">Update your photo and personal details</p>
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </div>

          {/* Bio Section - Full Width */}
          <div className="mt-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write a short introduction about yourself..."
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Write a short introduction about yourself</p>
          </div>
        </div>
      </div>
    </div>
  );
}
