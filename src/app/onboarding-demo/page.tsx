"use client";

import { useState } from "react";
import { Stepper } from "@/components/onboarding/Stepper";
import { OnboardingInput, OnboardingTextarea } from "@/components/onboarding/OnboardingField";
import { ZipCodeSelector } from "@/components/onboarding/ZipCodeSelector";
import { WebhookDisplay } from "@/components/onboarding/WebhookDisplay";
import { Button } from "@/components/ui/button";

export default function OnboardingDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [zipCodes, setZipCodes] = useState(["90210", "33101"]);

  const steps = [
    { id: 1, title: "Agent Profile" },
    { id: 2, title: "Persona Calibration" },
    { id: 3, title: "Market Setup" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-primary p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-accent rounded-xl mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Set up your AI Agent</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Let&apos;s configure your AI to match your voice and business goals.
            </p>
          </div>

          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="flex-1 p-10 flex flex-col">
          <div className="flex-1 space-y-6">
            {currentStep === 1 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-slate-500 text-sm">
                    This information helps the AI identify as part of your team.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <OnboardingInput label="First Name" placeholder="e.g. Sarah" />
                  <OnboardingInput label="Last Name" placeholder="e.g. Jenkins" />
                </div>
                <OnboardingInput label="Brokerage Name" placeholder="e.g. Coastal Realty Group" />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Persona Calibration</h2>
                  <p className="text-slate-500 text-sm">
                    Provide sample texts to help the AI mirror your voice.
                  </p>
                </div>

                <OnboardingTextarea
                  label="Tone Sample"
                  placeholder="Paste a recent email or text message you sent to a client..."
                  description="The AI will analyze this to match your level of formality and warmth."
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Market Setup</h2>
                  <p className="text-slate-500 text-sm">
                    Define the areas you cover and connect your lead sources.
                  </p>
                </div>

                <ZipCodeSelector
                  label="Service Areas"
                  description="Add zip codes where you want the AI to represent you."
                  zipCodes={zipCodes}
                  onChange={setZipCodes}
                />

                <div className="pt-4 border-t border-slate-100">
                  <WebhookDisplay
                    label="Lead Ingestion Webhook"
                    url="https://api.firstcontact.ai/v1/webhook/agent_12345"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    Send your Zillow or Facebook leads to this URL for instant response.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="pt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            >
              {currentStep === 3 ? "Complete Setup" : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
