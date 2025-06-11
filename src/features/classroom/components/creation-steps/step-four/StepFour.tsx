import { Sparkles } from 'lucide-react';
import React, { useState } from 'react'

export default function StepFour({ data, updateData }: {
  data: any;
  updateData: (data: any) => void;
}) {
  const [settings, setSettings] = useState({
    allowDiscussions: true,
    enableNotifications: true,
    publicClassroom: false,
    allowFileSharing: true,
    ...data.classroomSettings
  });

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateData({ classroomSettings: newSettings });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Customize Your Classroom
        </h1>
        <p className="text-gray-600">
          Set up your classroom preferences to create the perfect learning environment.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Access</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Public Classroom</div>
                <div className="text-sm text-gray-500">Anyone can discover and join this classroom</div>
              </div>
              <button
                onClick={() => updateSetting('publicClassroom', !settings.publicClassroom)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.publicClassroom ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.publicClassroom ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Allow Discussions</div>
                <div className="text-sm text-gray-500">Students can create discussion threads</div>
              </div>
              <button
                onClick={() => updateSetting('allowDiscussions', !settings.allowDiscussions)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allowDiscussions ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.allowDiscussions ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">File Sharing</div>
                <div className="text-sm text-gray-500">Allow students to upload and share files</div>
              </div>
              <button
                onClick={() => updateSetting('allowFileSharing', !settings.allowFileSharing)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allowFileSharing ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.allowFileSharing ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Push Notifications</div>
                <div className="text-sm text-gray-500">Get notified about new activities</div>
              </div>
              <button
                onClick={() => updateSetting('enableNotifications', !settings.enableNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.enableNotifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.enableNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

