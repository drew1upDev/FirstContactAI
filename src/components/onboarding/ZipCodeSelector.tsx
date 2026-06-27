"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OnboardingField } from "./OnboardingField";

interface ZipCodeSelectorProps {
  label: string;
  description?: string;
  zipCodes: string[];
  onChange: (zipCodes: string[]) => void;
  className?: string;
}

export function ZipCodeSelector({
  label,
  description,
  zipCodes,
  onChange,
  className,
}: ZipCodeSelectorProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addZipCode();
    }
  };

  const addZipCode = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !zipCodes.includes(trimmedValue)) {
      onChange([...zipCodes, trimmedValue]);
      setInputValue("");
    }
  };

  const removeZipCode = (zip: string) => {
    onChange(zipCodes.filter((z) => z !== zip));
  };

  return (
    <OnboardingField label={label} description={description} className={className}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter zip code and press Enter"
            className="flex-1"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {zipCodes.map((zip) => (
            <Badge
              key={zip}
              variant="secondary"
              className="bg-accent/10 text-accent border-accent/20 px-2 py-1 gap-1"
            >
              {zip}
              <button
                type="button"
                onClick={() => removeZipCode(zip)}
                className="hover:text-accent/70 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Badge>
          ))}
          {zipCodes.length === 0 && (
            <p className="text-xs text-slate-400 italic">No zip codes added yet.</p>
          )}
        </div>
      </div>
    </OnboardingField>
  );
}
