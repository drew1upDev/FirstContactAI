"use client";

import { Lead, LeadScore } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarDays, Flame, MessageSquare, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LeadCardProps {
  lead: Lead;
  latestScore?: LeadScore;
  className?: string;
  onClick?: () => void;
}

export function LeadCard({ lead, latestScore, className, onClick }: LeadCardProps) {
  const isHot = (latestScore?.score || 0) >= 80;
  const isAppointmentReady = latestScore?.is_appointment_ready;

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:border-primary/50 transition-colors shadow-sm",
        isHot && "border-orange-200 bg-orange-50/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 truncate pr-2">
            {lead.name}
          </h3>
          {isHot && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 gap-1 flex shrink-0">
              <Flame size={12} className="fill-current" />
              Hot
            </Badge>
          )}
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
