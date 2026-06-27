"use client";

import { useState } from "react";
import { LeadPipeline } from "@/components/dashboard/LeadPipeline";
import { ConversationThread } from "@/components/dashboard/ConversationThread";
import { BriefingCard } from "@/components/dashboard/BriefingCard";
import { DashboardStats, AnalyticsCharts } from "@/components/dashboard/Analytics";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { Lead, Conversation, LeadScore } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, MessageSquare, BarChart3, Bell, Search, Settings, Flame, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock Data
const mockLeads: Lead[] = [
  { id: '1', agent_id: '1', name: 'John Doe', status: 'qualified', source: 'Zillow', email: 'john@example.com', phone: '555-0101', created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(), metadata: { is_qualifying: true } },
  { id: '2', agent_id: '1', name: 'Alice Smith', status: 'new', source: 'Facebook', email: 'alice@example.com', phone: '555-0102', created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(), metadata: { unread_count: 1 } },
  { id: '3', agent_id: '1', name: 'Bob Johnson', status: 'new', source: 'Website', email: 'bob@example.com', phone: '555-0103', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: '4', agent_id: '1', name: 'Sarah Wilson', status: 'qualified', source: 'Zillow', email: 'sarah@example.com', phone: '555-0104', created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString() },
];

const mockScores: Record<string, LeadScore> = {
  '1': { id: 's1', lead_id: '1', score: 85, summary: 'Highly motivated buyer looking for 3BR in Westside. Budget $600k. Approved for financing.', criteria: { motivation: 'High', budget_fit: 'Yes', area_match: 'Exact' }, is_appointment_ready: true, created_at: new Date().toISOString() },
  '4': { id: 's4', lead_id: '4', score: 92, summary: 'Ready to list their home in Oakwood. Needs to sell within 2 months. Looking for an agent with local expertise.', criteria: { urgency: 'High', property_type: 'Single Family', local_focus: 'Yes' }, is_appointment_ready: true, created_at: new Date().toISOString() },
};

const mockMessages: Conversation[] = [
  { id: 'm1', lead_id: '1', agent_id: '1', channel: 'sms', direction: 'outbound', content: 'Hi John, I saw you were interested in 123 Main St. Are you looking to move soon?', created_at: new Date(Date.now() - 3000000).toISOString(), metadata: { sender_type: 'ai' } },
  { id: 'm2', lead_id: '1', agent_id: '1', channel: 'sms', direction: 'inbound', content: 'Yes, looking to buy in the next 3 months.', created_at: new Date(Date.now() - 2800000).toISOString() },
  { id: 'm3', lead_id: '1', agent_id: '1', channel: 'sms', direction: 'outbound', content: 'Great! What is your budget range for the new home?', created_at: new Date(Date.now() - 2500000).toISOString(), metadata: { sender_type: 'ai' } },
  { id: 'm4', lead_id: '1', agent_id: '1', channel: 'sms', direction: 'inbound', content: 'Around $500k - $600k.', created_at: new Date(Date.now() - 2000000).toISOString() },
  { id: 'm5', lead_id: '1', agent_id: '1', channel: 'sms', direction: 'outbound', content: 'Perfect. I have a few listings that might fit. Would you like to schedule a quick call to discuss?', created_at: new Date(Date.now() - 1500000).toISOString(), metadata: { sender_type: 'ai' } },
];

export default function DashboardDemo() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(mockLeads[0]);
  const [showHotAlert, setShowHotAlert] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Hot Lead Notification */}
      {showHotAlert && (
        <div className="absolute top-20 right-8 z-50 w-80 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-orange-500 text-white p-4 rounded-xl shadow-2xl shadow-orange-200 border border-orange-400 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
                  <Flame size={18} className="fill-current" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Immediate Action</p>
                  <p className="font-extrabold text-lg leading-tight">Hot Lead Detected!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHotAlert(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm font-bold">John Doe is ready for a call.</p>
              <p className="text-xs opacity-90 mt-1">AI score: 85/100 • 3 mins ago</p>
            </div>
            <button className="bg-white text-orange-600 w-full py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-colors shadow-lg">
              View Briefing
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 text-xl font-extrabold flex items-center gap-2 tracking-tight">
          <div className="size-8 bg-accent rounded-lg flex items-center justify-center">
            <div className="size-4 bg-white rounded-sm"></div>
          </div>
          FirstContact <span className="text-accent">AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Leads" />
          <NavItem icon={<MessageSquare size={20} />} label="Conversations" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="size-10 border border-slate-700">
              <AvatarFallback className="bg-slate-800 text-white font-bold">SJ</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Coastal Realty</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Search leads, properties..." 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
              Add New Lead
            </button>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs defaultValue="pipeline" className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Overview</h1>
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger value="pipeline" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Pipeline</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pipeline" className="space-y-8 mt-0 border-none p-0 outline-none">
              <DashboardStats />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Active Pipeline</h2>
                    <span className="text-xs text-slate-400 font-medium">Last updated: 2 mins ago</span>
                  </div>
                  <LeadPipeline 
                    leads={mockLeads} 
                    scores={mockScores} 
                    onLeadClick={setSelectedLead}
                  />
                </div>

                <div className="space-y-6">
                  {selectedLead ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-slate-800">Conversation Thread</h2>
                        <button className="text-xs text-accent font-bold hover:underline">View History</button>
                        </div>
                        <div className="h-[350px]">
                        <ConversationThread
                          messages={mockMessages}
                          leadName={selectedLead.name}
                        />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                        <LiveActivityFeed />
                        </div>

                        {mockScores[selectedLead.id] && (
                          <div className="space-y-4 pt-2">
                            <h2 className="font-bold text-slate-800">AI Intelligence</h2>
                            <BriefingCard 
                              lead={selectedLead} 
                              score={mockScores[selectedLead.id]} 
                            />
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                      <MessageSquare size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">Select a lead from the pipeline to view conversation and qualification briefing.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 border-none p-0 outline-none">
              <div className="space-y-8">
                <DashboardStats />
                <AnalyticsCharts />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm",
        active 
          ? "bg-accent/10 text-accent" 
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
      )}
    >
      {icon}
      {label}
    </a>
  );
}
