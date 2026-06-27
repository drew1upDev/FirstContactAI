"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Mail, Phone, ArrowDown } from "lucide-react";

export function FollowUpConfig() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Qualification Sequence</CardTitle>
          <CardDescription>
            Set how aggressively the AI follows up with new inbound leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Initial Response Speed
              </p>
              <p className="text-xs text-slate-500">How long the AI waits before the first response.</p>
            </div>
            <Select defaultValue="instant">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant (&lt; 1m)</SelectItem>
                <SelectItem value="natural">Natural (2-3m)</SelectItem>
                <SelectItem value="delayed">Delayed (5-10m)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Multi-Channel Waterfall</Label>
            
            <div className="space-y-3">
              <WaterfallStep 
                number={1} 
                icon={<MessageSquare size={14} />} 
                label="SMS Lead Response" 
                detail="Immediate qualification attempt"
                active
              />
              <div className="flex justify-center py-1"><ArrowDown size={14} className="text-slate-300" /></div>
              <WaterfallStep 
                number={2} 
                icon={<Mail size={14} />} 
                label="Email Mirror" 
                detail="Sent if no SMS reply within 5 mins"
                active
              />
              <div className="flex justify-center py-1"><ArrowDown size={14} className="text-slate-300" /></div>
              <WaterfallStep 
                number={3} 
                icon={<Phone size={14} />} 
                label="AI Voice Call" 
                detail="Outbound call after 15 mins of silence"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Drip Persistence</Label>
                <p className="text-xs text-slate-500">Continue following up for 3 days if no engagement.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-accent hover:bg-accent/90 text-white font-bold">Save Sequence</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WaterfallStep({ number, icon, label, detail, active = false }: { 
  number: number; 
  icon: React.ReactNode; 
  label: string; 
  detail: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${active ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
      <div className="flex items-center gap-3">
        <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
          {number}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            {icon}
            {label}
          </p>
          <p className="text-[10px] text-slate-500">{detail}</p>
        </div>
      </div>
      <Switch checked={active} />
    </div>
  );
}
