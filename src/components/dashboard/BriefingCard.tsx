"use client";

import { Lead, LeadScore } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, Mail, Phone, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefingCardProps {
  lead: Lead;
  score: LeadScore;
  onTakeOver?: () => void;
  onQualifyManually?: () => void;
  className?: string;
}

export function BriefingCard({ lead, score, onTakeOver, onQualifyManually, className }: BriefingCardProps) {
  return (
    <Card className={cn("border-accent/30 shadow-lg bg-white", className)}>
      <CardHeader className="bg-accent/5 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-accent flex items-center justify-center text-white">
              <Zap size={20} className="fill-current" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-primary">Lead Briefing</CardTitle>
              <CardDescription className="text-accent font-bold uppercase tracking-widest text-[10px]">
                Appointment Ready
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-accent text-white border-none text-lg px-3 py-1">
            {score.score}/100
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-3 text-slate-800">
            <User size={18} className="text-accent" />
            <h3 className="font-bold">Contact Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 ml-7">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
              <p className="text-sm font-medium text-slate-700">{lead.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Source</p>
              <p className="text-sm font-medium text-slate-700">{lead.source || "Unknown"}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
              <p className="text-sm font-medium text-slate-700">{lead.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
              <p className="text-sm font-medium text-slate-700">{lead.phone || "N/A"}</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-800">
            <ClipboardList size={18} className="text-accent" />
            <h3 className="font-bold">AI Qualification Summary</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed ml-7">
            {score.summary || "No summary provided by AI."}
          </p>
        </section>

        {score.criteria && Object.keys(score.criteria).length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-800">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <h3 className="font-bold">Key Intent Signals</h3>
            </div>
            <div className="flex flex-wrap gap-2 ml-7">
              {Object.entries(score.criteria).map(([key, value]) => (
                <Badge key={key} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 py-1">
                  {key.replace(/_/g, ' ')}: {String(value)}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 pt-2 border-t border-slate-100 bg-slate-50/50">
        <Button 
          variant="outline" 
          className="flex-1 border-slate-200 text-slate-600 font-bold"
          onClick={onQualifyManually}
        >
          Qualify Manually
        </Button>
        <Button 
          className="flex-1 bg-primary text-white font-bold hover:bg-primary/90"
          onClick={onTakeOver}
        >
          Take Over Lead
        </Button>
      </CardFooter>
    </Card>
  );
}
