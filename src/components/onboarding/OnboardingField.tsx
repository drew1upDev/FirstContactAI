import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";

interface OnboardingFieldProps {
  label: string;
  description?: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

export function OnboardingField({
  label,
  description,
  error,
  className,
  children,
}: OnboardingFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
        {label}
      </Label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// Specialized versions
export function OnboardingInput(
  props: React.ComponentProps<typeof Input> & { label: string; description?: string; error?: string }
) {
  const { label, description, error, className, ...inputProps } = props;
  return (
    <OnboardingField label={label} description={description} error={error} className={className}>
      <Input
        {...inputProps}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
      />
    </OnboardingField>
  );
}

export function OnboardingTextarea(
  props: React.ComponentProps<typeof Textarea> & { label: string; description?: string; error?: string }
) {
  const { label, description, error, className, ...textareaProps } = props;
  return (
    <OnboardingField label={label} description={description} error={error} className={className}>
      <Textarea
        {...textareaProps}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all min-h-[100px]"
      />
    </OnboardingField>
  );
}
