import React from 'react'

export default function StepOne({ data, updateData }: {
  data: any;
  updateData: (data: any) => void;
}) {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          What's the name of your classroom or team?
        </h1>
        <p className="text-gray-600">
          This will be the name of your Classroom — choose something that your team will recognize.
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Ex: Acme Marketing or Acme Co"
          value={data.classroomName || ''}
          onChange={(e) => updateData({ classroomName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
        />
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <input type="checkbox" className="mr-2" defaultChecked />
        <span>Let anyone with an @acme.com email join this workspace.</span>
      </div>
    </div>
  );
}
