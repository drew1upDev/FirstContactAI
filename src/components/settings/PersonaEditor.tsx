"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

export function PersonaEditor() {
  const [formality, setFormality] = useState([50]);
  const [phrases, setPhrases] = useState(["I'd love to help", "When works for you?", "Local market expert"]);
  const [newPhrase, setNewPhrase] = useState("");

  const addPhrase = () => {
    if (newPhrase.trim() && !phrases.includes(newPhrase.trim())) {
      setPhrases([...phrases, newPhrase.trim()]);
      setNewPhrase("");
    }
  };

  const removePhrase = (phrase: string) => {
    setPhrases(phrases.filter((p) => p !== phrase));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persona Profile</CardTitle>
        <CardDescription>
          Configure how the AI agent represents you in conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Tone & Formality</Label>
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-tighter">
                <span>Casual</span>
                <span>Professional</span>
              </div>
              <Slider 
                value={formality} 
                onValueChange={setFormality} 
                max={100} 
                step={1} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice-desc">Voice Descriptors</Label>
                <Input id="voice-desc" placeholder="e.g. Warm, knowledgeable, direct" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brokerage">Brokerage Mention</Label>
                <Input id="brokerage" placeholder="e.g. Always mention 'Coastal Realty'" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Common Phrases</Label>
          <div className="flex gap-2">
            <Input 
              value={newPhrase} 
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Add a phrase you frequently use..."
              onKeyDown={(e) => e.key === "Enter" && addPhrase()}
            />
            <Button size="icon" variant="outline" onClick={addPhrase}>
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {phrases.map((phrase) => (
              <Badge key={phrase} variant="secondary" className="bg-slate-100 text-slate-700 py-1 px-2 gap-1 border-slate-200">
                {phrase}
                <button onClick={() => removePhrase(phrase)} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <Label htmlFor="bio">Agent Bio (Context)</Label>
          <Textarea 
            id="bio" 
            placeholder="Briefly describe your experience and focus areas..." 
            className="min-h-[120px]"
          />
          <p className="text-[10px] text-slate-400">The AI uses your bio to answer specific questions about your background.</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold px-8">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
