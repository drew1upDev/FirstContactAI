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
  const [isPaused, setIsPaused] = useState(false);

  return (
    <Card className={cn("border-accent/30 shadow-lg bg-white", className)}>
      <CardHeader className="bg-accent/5 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-accent flex items-center justify-center text-white">
              <Zap size={20} className={cn("fill-current", !isPaused && "animate-pulse")} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-primary">Lead Briefing</CardTitle>
              <CardDescription className="text-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                {isPaused ? "AI Interventon Paused" : "AI Qualification Active"}
                {!isPaused && <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-ping" />}
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-accent text-white border-none text-lg px-3 py-1">
            {score.score}/100
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Highlighting key insights */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Intent</p>
            <p className="text-xs font-bold text-slate-800">{score.criteria?.intent || "High"}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Budget</p>
            <p className="text-xs font-bold text-slate-800">{score.criteria?.budget || "$600k"}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Timeline</p>
            <p className="text-xs font-bold text-slate-800">{score.criteria?.timeline || "3 mo"}</p>
          </div>
        </div>

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
          </div>
        </section>

        <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-800">
            <ClipboardList size={18} className="text-accent" />
            <h3 className="font-bold">AI Qualification Summary</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed ml-7 font-medium italic">
            "{score.summary || "No summary provided by AI."}"
          </p>
        </section>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? "Resume AI" : "Pause AI"}
          </Button>
          <Button
            className="flex-1 bg-primary text-white font-bold hover:bg-primary/90"
            onClick={onTakeOver}
          >
            Take Over Lead
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest h-8"
          onClick={onQualifyManually}
        >
          Qualify Manually
        </Button>
      </CardFooter>
    </Card>
  );
}
