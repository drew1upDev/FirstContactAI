"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Zap, UserPlus, Calendar, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type ActivityType = 'new_lead' | 'ai_message' | 'lead_qualified' | 'appointment_ready' | 'call_scheduled';

interface Activity {
  id: string;
  type: ActivityType;
  leadName: string;
  content: string;
  timestamp: string;
}

const mockActivities: Activity[] = [
  { id: '1', type: 'new_lead', leadName: 'John Doe', content: 'New lead from Zillow', timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: '2', type: 'ai_message', leadName: 'John Doe', content: 'AI sent qualification SMS', timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: '3', type: 'lead_qualified', leadName: 'Alice Smith', content: 'Qualification complete (Score: 85)', timestamp: new Date(Date.now() - 300000).toISOString() },
];

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  // In a real app, this would be a websocket/realtime listener
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity occasionally
      if (Math.random() > 0.7) {
        const newActivity: Activity = {
          id: Math.random().toString(),
          type: 'ai_message',
          leadName: 'Alice Smith',
          content: 'AI is analyzing response...',
          timestamp: new Date().toISOString(),
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 10));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case 'new_lead': return <UserPlus size={14} className="text-blue-500" />;
      case 'ai_message': return <Zap size={14} className="text-teal-500" />;
      case 'lead_qualified': return <MessageSquare size={14} className="text-purple-500" />;
      case 'appointment_ready': return <Calendar size={14} className="text-orange-500" />;
      case 'call_scheduled': return <Phone size={14} className="text-emerald-500" />;
    }
  };

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Activity</CardTitle>
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-100 animate-pulse">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 group">
                <div className="size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-teal-200 transition-colors">
                  {getIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-bold text-slate-900">{activity.leadName}</span>
                    <span className="text-slate-500 mx-1">•</span>
                    <span className="text-slate-600">{activity.content}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
