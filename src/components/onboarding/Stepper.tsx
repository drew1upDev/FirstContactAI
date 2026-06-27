import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : isCompleted
                  ? "border-accent bg-accent text-white"
                  : "border-slate-700 text-slate-500"
              )}
            >
              {isCompleted ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-500"
              )}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
