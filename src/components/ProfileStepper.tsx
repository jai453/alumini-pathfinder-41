import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProfileStepperProps {
  currentStep: number;
  steps: Step[];
}

export function ProfileStepper({ currentStep, steps }: ProfileStepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                transition-all duration-300
                ${currentStep > step.number 
                  ? 'bg-primary text-primary-foreground' 
                  : currentStep === step.number 
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                    : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="mt-2 text-center">
              <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div 
              className={`
                w-16 sm:w-24 h-0.5 mx-4 transition-colors duration-300
                ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}
              `} 
            />
          )}
        </div>
      ))}
    </div>
  );
}
