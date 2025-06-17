import React, { useState } from 'react'

export default function StepThree({ data, updateData }: {
  data: any;
  updateData: (data: any) => void;
}) {
  const [emails, setEmails] = useState(data.teamEmails || '');
  
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Who else is on the test-classroom team?
        </h1>
        <p className="text-gray-600 mb-6">
          Add coworkers by email.
        </p>
        
        <div className="text-right mb-2">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Add from Google Contacts
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <textarea
          placeholder="Ex: otherperson@work.com, anotherperson@work.com"
          value={emails}
          onChange={(e) => {
            setEmails(e.target.value);
            updateData({ teamEmails: e.target.value });
          }}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>
      
      <p className="text-sm text-gray-500 mb-8">
        Keep in mind that students signed in 30+ days. You can always invited that number.
      </p>
      
      <div className="flex gap-3">
        <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Copy Invite Link
        </button>
      </div>
    </div>
  );
}
