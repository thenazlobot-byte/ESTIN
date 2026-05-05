import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center min-w-[120px]">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                idx < currentStep
                  ? 'bg-teal-700 text-white'
                  : idx === currentStep
                  ? 'bg-teal-700 text-white ring-4 ring-teal-200'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <span className={`text-xs font-semibold ${
              idx <= currentStep ? 'text-teal-700' : 'text-gray-600'
            }`}>
              {step}
            </span>
          </div>

          {idx < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 transition-all ${
                idx < currentStep ? 'bg-teal-700' : 'bg-gray-200'
              }`}
              style={{ minWidth: '40px' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
