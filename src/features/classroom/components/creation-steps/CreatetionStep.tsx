'use client'
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import SkipModal from "./skipModal/SkipModal";
import StepOne from "./step-one/StepOne";
import StepTwo from "./step-two/StepTwo";
import StepThree from "./step-three/StepThree";
import StepFour from "./step-four/StepFour";
import { useState } from "react";

interface CreationData {
  classroomName?: string;
  userName?: string;
  // Add other fields as needed
}

const CreationSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CreationData>({});
  const [showSkipModal, setShowSkipModal] = useState(false);

  const totalSteps = 4;

  const updateData = (newData: any) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.classroomName && data.classroomName.trim().length > 0;
      case 2:
        return data.userName && data.userName.trim().length > 0;
      case 3:
        return true; // Can skip team members
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSkip = () => {
    if (currentStep === 3) {
      setShowSkipModal(true);
    }
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={data} updateData={updateData} />;
      case 2:
        return <StepTwo data={data} updateData={updateData} />;
      case 3:
        return <StepThree data={data} updateData={updateData} />;
      case 4:
        return <StepFour data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Classroom Information";
      case 2:
        return "Personal Details";
      case 3:
        return "Classroom's Students";
      case 4:
        return "Classroom Settings";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{getStepTitle()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep === 3 && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Skip for now
              </button>
            )}
            
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Skip Modal */}
      <SkipModal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={confirmSkip}
      />
    </div>
  );
};

export default CreationSteps;