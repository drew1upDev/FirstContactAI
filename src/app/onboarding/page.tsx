'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

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
  webhookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratedVoicePrompt, setCalibratedVoicePrompt] = useState('');

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
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'brokerageName'];
    } else if (step === 2) {
      fieldsToValidate = ['personaSamples', 'voiceIdentity'];
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
      }
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (values: OnboardingValues) => {
    setIsSubmitting(true);
    try {
      // 1. Create/Update Agent in Supabase
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
            metadata: {
              webhook_url: values.webhookUrl,
              onboarding_completed: true,
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Redirect to dashboard (or show success)
      alert('Onboarding complete! Redirecting to dashboard...');
      window.location.href = '/';
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Agent Profile' },
    { id: 2, title: 'Persona Calibration' },
    { id: 3, title: 'Market Setup' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-[#0F1B2D] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-[#00C896] rounded-xl mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Set up your AI Agent</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Let's configure your AI to match your voice and business goals.
            </p>
          </div>
          
          <div className="space-y-6 mt-8 md:mt-0">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors",
                  step >= s.id ? "border-[#00C896] text-[#00C896]" : "border-slate-700 text-slate-500"
                )}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  step >= s.id ? "text-white" : "text-slate-500"
                )}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                <p className="text-slate-500 text-sm mb-8">This information helps the AI identify as part of your team.</p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">First Name</Label>
                      <Input {...form.register('firstName')} placeholder="e.g. Sarah" />
                      {form.formState.errors.firstName && (
                        <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Last Name</Label>
                      <Input {...form.register('lastName')} placeholder="e.g. Jenkins" />
                      {form.formState.errors.lastName && (
                        <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email Address</Label>
                    <Input {...form.register('email')} type="email" placeholder="sarah@example.com" />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Brokerage Name</Label>
                    <Input {...form.register('brokerageName')} placeholder="e.g. Coastal Realty Group" />
                    {form.formState.errors.brokerageName && (
                      <p className="text-xs text-red-500">{form.formState.errors.brokerageName.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold mb-2">Persona Calibration</h2>
                <p className="text-slate-500 text-sm mb-8">Paste 3-5 examples of your past texts or emails so the AI can learn your style.</p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Conversation Samples</Label>
                    <Textarea 
                      {...form.register('personaSamples')} 
                      className="min-h-[150px]" 
                      placeholder="Agent: Hey John, just checking in if you saw that house on Main St..." 
                    />
                    {form.formState.errors.personaSamples && (
                      <p className="text-xs text-red-500">{form.formState.errors.personaSamples.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Target Voice Identity</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Friendly', 'Professional', 'Energetic'].map((voice) => (
                        <button
                          key={voice}
                          type="button"
                          onClick={() => form.setValue('voiceIdentity', voice as any)}
                          className={cn(
                            "p-3 border-2 rounded-xl text-center transition-all",
                            form.watch('voiceIdentity') === voice 
                              ? "border-[#00C896] bg-[#00C896]/5" 
                              : "border-slate-100 hover:border-slate-300"
                          )}
                        >
                          <p className="text-sm font-bold">{voice}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold mb-2">Market & Integrations</h2>
                <p className="text-slate-500 text-sm mb-8">Tell the AI about your primary market area and set up your lead ingestion.</p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Market Description</Label>
                    <Textarea 
                      {...form.register('marketArea')} 
                      className="min-h-[120px]" 
                      placeholder="e.g. I focus on luxury condos in downtown Miami..." 
                    />
                    {form.formState.errors.marketArea && (
                      <p className="text-xs text-red-500">{form.formState.errors.marketArea.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lead Source Webhook (Optional)</Label>
                    <div className="flex gap-2">
                      <Input {...form.register('webhookUrl')} placeholder="https://api.firstcontact.ai/v1/webhooks/..." />
                    </div>
                    <p className="text-[10px] text-slate-400">Connect your CRM (Zillow, Facebook, etc.) to this URL to start qualifying leads instantly.</p>
                    {form.formState.errors.webhookUrl && (
                      <p className="text-xs text-red-500">{form.formState.errors.webhookUrl.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-8 flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : <div></div>}
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep} disabled={isCalibrating} className="bg-[#0F1B2D] text-white hover:bg-slate-800">
                  {isCalibrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calibrating...
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-[#00C896] text-white hover:bg-[#00C896]/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finishing...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
