"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Target, CheckCircle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  className?: string;
}

function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
            {change && (
              <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        title="Total Leads" 
        value="128" 
        change="+12% from last month" 
        icon={<Users size={20} />} 
      />
      <StatsCard 
        title="Qualification Rate" 
        value="64%" 
        change="+5% from last month" 
        icon={<Target size={20} />} 
      />
      <StatsCard 
        title="Avg. Response Time" 
        value="42s" 
        change="-15s from last week" 
        icon={<TrendingUp size={20} />} 
      />
      <StatsCard 
        title="Appointments" 
        value="18" 
        change="+2 this week" 
        icon={<CheckCircle size={20} />} 
      />
    </div>
  );
}

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Lead Source Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end gap-4 px-4">
            <div className="flex-1 bg-primary rounded-t-lg relative group" style={{ height: '80%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Zillow: 45%</div>
            </div>
            <div className="flex-1 bg-accent rounded-t-lg relative group" style={{ height: '60%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">FB Ads: 30%</div>
            </div>
            <div className="flex-1 bg-blue-400 rounded-t-lg relative group" style={{ height: '40%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Organic: 15%</div>
            </div>
            <div className="flex-1 bg-slate-300 rounded-t-lg relative group" style={{ height: '20%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Others: 10%</div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
            <span className="flex-1 text-center">Zillow</span>
            <span className="flex-1 text-center">FB Ads</span>
            <span className="flex-1 text-center">Organic</span>
            <span className="flex-1 text-center">Others</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Total Leads</span>
              <span className="text-slate-900">128</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-slate-300 h-full w-full" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Contacted</span>
              <span className="text-slate-900">112 (88%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full w-[88%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Qualified</span>
              <span className="text-slate-900">82 (64%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[64%]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Appointments</span>
              <span className="text-slate-900">18 (14%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[14%]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
