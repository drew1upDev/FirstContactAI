"use client";

import { Lead, LeadScore } from "@/types";
import { LeadCard } from "./LeadCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  title: string;
  count: number;
  leads: Lead[];
  scores: Record<string, LeadScore>;
  pausedLeads?: Set<string>;
  className?: string;
  onLeadClick?: (lead: Lead) => void;
}

function PipelineColumn({ 
  title, 
  count, 
  leads, 
  scores, 
  pausedLeads, 
  className, 
  onLeadClick 
}: PipelineColumnProps) {
  return (
    <div className={cn("flex flex-col h-full min-w-[300px] bg-slate-50/50 rounded-lg border border-slate-100", className)}>
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-lg">
        <h2 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
          {title}
        </h2>
        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              latestScore={scores[lead.id]} 
              onClick={() => onLeadClick?.(lead)}
              isPaused={pausedLeads?.has(lead.id)}
            />
          ))}
          {leads.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm italic">
              No leads in this stage
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface LeadPipelineProps {
  leads: Lead[];
  scores: Record<string, LeadScore>;
  pausedLeads?: Set<string>;
  onLeadClick?: (lead: Lead) => void;
}

export function LeadPipeline({ leads, scores, pausedLeads, onLeadClick }: LeadPipelineProps) {
  const columns = [
    { id: 'new', title: 'New Leads' },
    { id: 'qualified', title: 'Qualified' },
    { id: 'disqualified', title: 'Disqualified' },
    { id: 'archived', title: 'Archived' },
  ];

  const leadsByStatus = columns.reduce((acc, col) => {
    acc[col.id] = leads.filter(l => l.status === col.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4 no-scrollbar">
      {columns.map((col) => (
        <PipelineColumn
          key={col.id}
          title={col.title}
          count={leadsByStatus[col.id]?.length || 0}
          leads={leadsByStatus[col.id] || []}
          scores={scores}
          pausedLeads={pausedLeads}
          onLeadClick={onLeadClick}
        />
      ))}
    </div>
  );
}
