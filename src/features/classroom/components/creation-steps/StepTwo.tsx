import { Upload, User } from 'lucide-react';
import React from 'react'

export default function StepTwo({ data, updateData }: {
  data: any;
  updateData: (data: any) => void;
}) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          What's your name?
        </h1>
        <p className="text-gray-600">
          Adding your name and profile photo helps your students recognize and connect with you more easily.
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="something@company.com"
          value={data.userName || ''}
          onChange={(e) => updateData({ userName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
        />
      </div>
      
      <div className="mb-8">
        <div className="mb-3 text-sm text-gray-600">Your profile photo (Optional)</div>
        <div className="mb-3 text-xs text-gray-500">Help your students know they're talking to the right person.</div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </button>
      </div>
    </div>
  );
}
