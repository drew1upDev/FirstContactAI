'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Stepper } from '@/components/onboarding/Stepper';
import { OnboardingInput, OnboardingTextarea } from '@/components/onboarding/OnboardingField';
import { ZipCodeSelector } from '@/components/onboarding/ZipCodeSelector';
import { WebhookDisplay } from '@/components/onboarding/WebhookDisplay';

const onboardingSchema = z.object({
  // Step 1: Profile
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  brokerageName: z.string().min(2, 'Brokerage name is required'),
  phone: z.string().optional(),
  
  // Step 2: Persona
  personaSamples: z.string().min(10, 'Please provide more samples for better calibration'),
  voiceIdentity: z.enum(['Friendly', 'Professional', 'Energetic']),
  
  // Step 3: Market & Integrations
  marketArea: z.string().min(2, 'Market area description is required'),
  zipCodes: z.array(z.string()).min(1, 'At least one zip code is required'),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratedVoicePrompt, setCalibratedVoicePrompt] = useState('');
  const [agentId, setAgentId] = useState<string | null>(null);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      brokerageName: '',
      phone: '',
      personaSamples: '',
      voiceIdentity: 'Professional',
      marketArea: '',
      zipCodes: [],
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'brokerageName'];
    } else if (step === 2) {
      fieldsToValidate = ['personaSamples', 'voiceIdentity'];
      
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;

      setIsCalibrating(true);
      try {
        const response = await fetch('/api/agents/calibrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            samples: form.getValues('personaSamples'),
            targetVoice: form.getValues('voiceIdentity')
          }),
        });
        const data = await response.json();
        if (data.voicePrompt) {
          setCalibratedVoicePrompt(data.voicePrompt);
        }
      } catch (error) {
        console.error('Calibration failed:', error);
      } finally {
        setIsCalibrating(false);
        setStep(step + 1);
      }
      return;
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (values: OnboardingValues) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phone: values.phone,
            bio: `Brokerage: ${values.brokerageName}`,
            voice_prompt: calibratedVoicePrompt || `Voice: ${values.voiceIdentity}`,
            market_area: values.marketArea,
            zip_codes: values.zipCodes,
            metadata: {
              onboarding_completed: true,
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setAgentId(data.id);
      setStep(4); // Success step
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Profile' },
    { id: 2, title: 'Persona' },
    { id: 3, title: 'Market' },
  ];

  const webhookUrl = agentId 
    ? `https://api.firstcontact.ai/v1/webhooks/ingest/${agentId}`
    : "https://api.firstcontact.ai/v1/webhooks/ingest/PENDING";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row h-auto md:h-[700px] border border-slate-100">
        {/* Sidebar */}
        <div className="w-full md:w-[320px] bg-primary p-10 text-white flex flex-col">
          <div className="mb-12">
            <div className="w-12 h-12 bg-accent rounded-2xl mb-8 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/20 rounded-full blur-sm animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold mb-4">FirstContact AI</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your 24/7 lead qualification partner. Let's get your agent ready for the field.
            </p>
          </div>
          
          <Stepper steps={steps} currentStep={step} className="mt-4" />
          
          <div className="mt-auto pt-10 border-t border-white/10 hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Trusted by solo agents</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto">
          {step <= 3 ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <header className="mb-10">
                    <h2 className="text-3xl font-bold text-primary mb-2">Agent Profile</h2>
                    <p className="text-slate-500">Tell us who you are and where you work.</p>
                  </header>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <OnboardingInput 
                        label="First Name" 
                        {...form.register('firstName')} 
                        placeholder="e.g. Sarah"
                        error={form.formState.errors.firstName?.message}
                      />
                      <OnboardingInput 
                        label="Last Name" 
                        {...form.register('lastName')} 
                        placeholder="e.g. Jenkins"
                        error={form.formState.errors.lastName?.message}
                      />
                    </div>

                    <OnboardingInput 
                      label="Email Address" 
                      type="email" 
                      {...form.register('email')} 
                      placeholder="sarah@example.com"
                      error={form.formState.errors.email?.message}
                    />

                    <OnboardingInput 
                      label="Brokerage Name" 
                      {...form.register('brokerageName')} 
                      placeholder="e.g. Coastal Realty Group"
                      error={form.formState.errors.brokerageName?.message}
                    />
                    
                    <OnboardingInput 
                      label="Phone Number (Optional)" 
                      {...form.register('phone')} 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <header className="mb-10">
                    <h2 className="text-3xl font-bold text-primary mb-2">Persona Calibration</h2>
                    <p className="text-slate-500">Our AI learns your specific communication style.</p>
                  </header>

                  <div className="space-y-8">
                    <OnboardingTextarea 
                      label="Communication Samples"
                      description="Paste 3-5 examples of your past texts or emails. This helps the AI mirror your voice."
                      {...form.register('personaSamples')} 
                      placeholder="Agent: Hey John, just checking in if you saw that house on Main St..." 
                      error={form.formState.errors.personaSamples?.message}
                    />

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tone Preference</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['Friendly', 'Professional', 'Energetic'].map((voice) => (
                          <button
                            key={voice}
                            type="button"
                            onClick={() => form.setValue('voiceIdentity', voice as any)}
                            className={cn(
                              "p-4 border-2 rounded-2xl text-center transition-all duration-200",
                              form.watch('voiceIdentity') === voice 
                                ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                                : "border-slate-100 hover:border-slate-200"
                            )}
                          >
                            <p className={cn(
                              "text-sm font-bold",
                              form.watch('voiceIdentity') === voice ? "text-primary" : "text-slate-600"
                            )}>{voice}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <header className="mb-10">
                    <h2 className="text-3xl font-bold text-primary mb-2">Market & Territory</h2>
                    <p className="text-slate-500">Define where your AI should focus its local expertise.</p>
                  </header>

                  <div className="space-y-8">
                    <OnboardingTextarea 
                      label="Market Description"
                      description="Describe your primary focus area and any neighborhood specialties."
                      {...form.register('marketArea')} 
                      placeholder="e.g. I focus on luxury condos in downtown Miami and waterfront properties in Brickell..." 
                      error={form.formState.errors.marketArea?.message}
                    />

                    <ZipCodeSelector 
                      label="Target Zip Codes"
                      description="Add the zip codes where you want the AI to handle leads."
                      zipCodes={form.watch('zipCodes')}
                      onChange={(zips) => form.setValue('zipCodes', zips)}
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-10 flex justify-between gap-4">
                {step > 1 ? (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={prevStep}
                    className="text-slate-500 hover:text-primary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : <div />}
                
                <Button 
                  type="button" 
                  onClick={step < 3 ? nextStep : form.handleSubmit(onSubmit)} 
                  disabled={isCalibrating || isSubmitting}
                  className={cn(
                    "min-w-[140px] rounded-xl h-12 font-bold transition-all",
                    step === 3 ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isCalibrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calibrating...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {step === 3 ? 'Complete Setup' : 'Continue'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-8">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">You're All Set!</h2>
                <p className="text-slate-500 max-w-sm mb-10">
                    Your AI agent is calibrated and ready. Use the webhook below to connect your lead sources.
                </p>
                
                <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 text-left">
                    <WebhookDisplay 
                        label="Your Inbound Webhook URL"
                        url={webhookUrl}
                    />
                    <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                        Copy this URL into your lead providers (Zillow, Facebook Leads, etc.) to start qualifying prospects instantly.
                    </p>
                </div>

                <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-primary hover:bg-primary/90 rounded-xl px-10 h-12 font-bold"
                >
                    Go to Dashboard
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
