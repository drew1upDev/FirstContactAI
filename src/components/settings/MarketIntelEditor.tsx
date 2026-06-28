"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ZipCodeSelector } from "@/components/onboarding/ZipCodeSelector";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";

export function MarketIntelEditor() {
  const [zipCodes, setZipCodes] = useState(["90210", "90211", "90212"]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Coverage</CardTitle>
          <CardDescription>
            Define the areas where your AI agent is active and holds market knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZipCodeSelector 
            label="Service Zip Codes" 
            zipCodes={zipCodes} 
            onChange={setZipCodes} 
            description="Leads from these zip codes will be prioritized and answered with local context."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Neighborhood Intel</CardTitle>
            <CardDescription>
              Add specific notes for neighborhoods to improve lead conversion.
            </CardDescription>
          </div>
          <Button size="sm" className="bg-primary text-white">Add Note</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Area</TableHead>
                <TableHead>Intel / Context</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Beverly Hills</TableCell>
                <TableCell className="text-sm text-slate-600">Inventory is low in the $2M-$4M range. Focus on quick tours.</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="size-8"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-red-500"><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Westside</TableCell>
                <TableCell className="text-sm text-slate-600">Great for first-time buyers. Mention the new transit expansion.</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="size-8"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-red-500"><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global Pricing Trends</CardTitle>
          <CardDescription>
            General knowledge the AI should use when discussing market value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="e.g. Market is currently shifting to a buyer's market. Expect 15-20 days on market for well-priced homes..." 
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-4">
            <Button className="bg-accent hover:bg-accent/90 text-white font-bold">Update Global Intel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
