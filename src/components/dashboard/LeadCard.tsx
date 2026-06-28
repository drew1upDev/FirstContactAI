"use client";

import { Lead, LeadScore } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays, Flame, MessageSquare, Phone, Zap, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LeadCardProps {
  lead: Lead;
  latestScore?: LeadScore;
  isPaused?: boolean;
  className?: string;
  onClick?: () => void;
}

export function LeadCard({ lead, latestScore, isPaused, className, onClick }: LeadCardProps) {
  const isHot = (latestScore?.score || 0) >= 80;
  const isAppointmentReady = latestScore?.is_appointment_ready;
  const isQualifying = lead.metadata?.is_qualifying && !isPaused;
  const hasNewActivity = lead.metadata?.unread_count > 0;

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:border-primary/50 transition-all duration-300 shadow-sm relative group overflow-hidden",
        isHot && "border-orange-400 bg-orange-50/50 shadow-orange-100",
        isQualifying && "border-teal-400 bg-teal-50/30",
        isPaused && "border-blue-400 bg-blue-50/30",
        className
      )}
      onClick={onClick}
    >
      {hasNewActivity && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
      )}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-900 truncate pr-2 group-hover:text-primary transition-colors">
            {lead.name}
          </h3>
          <div className="flex gap-1 shrink-0">
            {isQualifying && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200 gap-1 flex animate-pulse">
                <Zap size={10} className="fill-current" />
                AI
              </Badge>
            )}
            {isPaused && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 gap-1 flex">
                <User size={10} className="fill-current" />
                You
              </Badge>
            )}
            {isHot && (
              <Badge variant="secondary" className="bg-orange-500 text-white border-orange-600 gap-1 flex shrink-0 shadow-sm">
                <Flame size={12} className="fill-current" />
                Hot
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
            {lead.status}
          </Badge>
          {latestScore && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-[10px] font-bold",
                latestScore.score >= 80 ? "bg-emerald-100 text-emerald-700" : 
                latestScore.score >= 50 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
              )}
            >
              Score: {latestScore.score}
            </Badge>
          )}
          {isAppointmentReady && (
            <Badge className="bg-accent text-white text-[10px] uppercase font-bold border-none">
              Ready
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-slate-500 gap-2">
            <MessageSquare size={14} className="text-slate-400" />
            <span className="truncate">{lead.email || "No email"}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500 gap-2">
            <Phone size={14} className="text-slate-400" />
            <span>{lead.phone || "No phone"}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400 gap-2 pt-1 border-t border-slate-100 mt-2">
            <CalendarDays size={14} />
            <span>{formatDistanceToNow(new Date(lead.created_at))} ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
