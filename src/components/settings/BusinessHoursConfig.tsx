"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BusinessHoursConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Availability</CardTitle>
        <CardDescription>
          Specify when the AI should respond as you. Outside these hours, it will still collect leads but may delay responses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs font-medium">
          <Clock size={16} />
          Current Timezone: America/New_York (EST)
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3 w-32">
                <Checkbox id={`day-${day}`} defaultChecked={day !== "Sunday"} />
                <Label htmlFor={`day-${day}`} className="font-bold text-slate-700">{day}</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <TimePicker defaultValue="09:00" />
                <span className="text-slate-400">to</span>
                <TimePicker defaultValue="18:00" />
              </div>

              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                {day === "Sunday" ? "Closed" : "9h Active"}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-bold">After-Hours Handling</Label>
              <p className="text-xs text-slate-500">How to handle leads that arrive late at night.</p>
            </div>
            <Select defaultValue="queue">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="queue">Queue for Morning</SelectItem>
                <SelectItem value="minimal">Minimal Response</SelectItem>
                <SelectItem value="full">Always On (24/7)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold px-8">Save Schedule</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TimePicker({ defaultValue }: { defaultValue: string }) {
  const times = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0');
    const min = (i % 2 === 0 ? '00' : '30');
    return `${hour}:${min}`;
  });

  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-[100px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {times.map(t => (
          <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
