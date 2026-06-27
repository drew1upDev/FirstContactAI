"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonaEditor } from "@/components/settings/PersonaEditor";
import { MarketIntelEditor } from "@/components/settings/MarketIntelEditor";
import { LeadSourceConfig } from "@/components/settings/LeadSourceConfig";
import { FollowUpConfig } from "@/components/settings/FollowUpConfig";
import { BusinessHoursConfig } from "@/components/settings/BusinessHoursConfig";
import { User, Map, Link2, Zap, Clock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsDemo() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
              <p className="text-slate-500 font-medium">Manage your AI persona and business configurations.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="persona" className="flex flex-col lg:flex-row gap-8">
          <TabsList className="flex lg:flex-col items-stretch h-auto bg-transparent gap-1 lg:w-64 p-0">
            <SettingsTabTrigger value="persona" icon={<User size={18} />} label="AI Persona" />
            <SettingsTabTrigger value="market" icon={<Map size={18} />} label="Market Intel" />
            <SettingsTabTrigger value="sources" icon={<Link2 size={18} />} label="Lead Sources" />
            <SettingsTabTrigger value="followup" icon={<Zap size={18} />} label="Follow-up" />
            <SettingsTabTrigger value="hours" icon={<Clock size={18} />} label="Business Hours" />
          </TabsList>

          <div className="flex-1">
            <TabsContent value="persona" className="mt-0 outline-none">
              <PersonaEditor />
            </TabsContent>
            <TabsContent value="market" className="mt-0 outline-none">
              <MarketIntelEditor />
            </TabsContent>
            <TabsContent value="sources" className="mt-0 outline-none">
              <LeadSourceConfig />
            </TabsContent>
            <TabsContent value="followup" className="mt-0 outline-none">
              <FollowUpConfig />
            </TabsContent>
            <TabsContent value="hours" className="mt-0 outline-none">
              <BusinessHoursConfig />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function SettingsTabTrigger({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="flex items-center gap-3 px-4 py-3 justify-start rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-white text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </TabsTrigger>
  );
}
