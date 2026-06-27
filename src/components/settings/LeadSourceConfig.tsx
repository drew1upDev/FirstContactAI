"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebhookDisplay } from "@/components/onboarding/WebhookDisplay";
import { RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LeadSourceConfig() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
              <Zap size={18} />
            </div>
            <CardTitle>Direct Ingestion</CardTitle>
          </div>
          <CardDescription>
            Use these unique URLs to connect your lead sources (Zillow, Facebook, Website) directly to FirstContact AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Zillow Tech Connect
                  <Badge variant="outline" className="text-[8px] bg-white">Connected</Badge>
                </p>
                <p className="text-xs text-slate-500">Last lead received: 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw size={14} />
                Rotate Key
              </Button>
            </div>
            <WebhookDisplay 
              label="Zillow Webhook URL" 
              url="https://api.firstcontact.ai/v1/ingest/zillow/k92j-82js-11pa" 
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Facebook Lead Ads</p>
              <Button size="sm" className="bg-primary text-white">Connect Account</Button>
            </div>
            <p className="text-xs text-slate-500">Authenticate with Facebook to automatically sync leads from your active campaigns.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <WebhookDisplay 
              label="Generic API / Zapier Webhook" 
              url="https://api.firstcontact.ai/v1/ingest/generic/agent_12345" 
            />
            <p className="text-[10px] text-slate-400">Use this for custom website forms or Zapier integrations.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/10">
        <CardHeader>
          <CardTitle className="text-red-900 text-sm">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Reset All Webhook Keys</p>
              <p className="text-[10px] text-slate-500">This will break all current lead ingestion integrations.</p>
            </div>
            <Button variant="destructive" size="sm">Reset Keys</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
