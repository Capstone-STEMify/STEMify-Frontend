import { CheckIcon } from 'lucide-react';
import React from 'react';

interface LearningObjective {
  id: number;
  text: string;
}

interface LearningObjectivesProps {
  title?: string;
  objectives?: LearningObjective[];
}

const defaultObjectives: LearningObjective[] = [
  {
    id: 1,
    text: "Understand the role of HTML, CSS, JavaScript, and React in modern frontend development."
  },
  {
    id: 2,
    text: "Apply frontend technologies to build user-friendly, responsive web pages."
  },
  {
    id: 3,
    text: "Analyze the structure and behavior of React components within a dynamic application"
  },
  {
    id: 4,
    text: "Create complete, interactive web applications using React and core web development skills"
  }
];

export default function LearningObjectives({ 
  title = "What you'll learn",
  objectives = defaultObjectives 
}) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectives.map((objective) => (
          <div key={objective.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <CheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              {objective.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};