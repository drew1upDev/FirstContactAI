"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebhookDisplayProps {
  label: string;
  url: string;
  className?: string;
}

export function WebhookDisplay({ label, url, className }: WebhookDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={url}
          className="bg-slate-50 font-mono text-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
