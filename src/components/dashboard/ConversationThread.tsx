"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Bot, Mail, Phone, User, SendHorizontal, Pause, Play, MessageSquare, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Conversation;
  leadName: string;
}

function MessageBubble({ message, leadName }: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";
  const isAI = message.metadata?.sender_type === "ai";
  const channel = message.channel;

  const Icon = channel === "sms" ? MessageSquare : channel === "email" ? Mail : Phone;

  return (
    <div className={cn("flex gap-3 mb-6", isInbound ? "flex-row" : "flex-row-reverse")}>
      <Avatar className={cn("size-8 mt-1 border shadow-sm", isInbound ? "border-slate-200" : "border-primary/20")}>
        {isInbound ? (
          <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
            {leadName.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        ) : (
          <AvatarFallback className={cn("text-xs", isAI ? "bg-accent text-white" : "bg-primary text-white")}>
            {isAI ? <Bot size={14} /> : <User size={14} />}
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isInbound ? "items-start" : "items-end")}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            {isInbound ? leadName : (isAI ? "AI Assistant" : "Agent (You)")}
          </span>
          <span className="text-[10px] text-slate-400">
            {format(new Date(message.created_at), "h:mm a")}
          </span>
          {!isInbound && isAI && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] h-3 px-1 font-black">
              AI
            </Badge>
          )}
          {!isInbound && !isAI && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 text-[8px] h-3 px-1 font-black">
              MANUAL
            </Badge>
          )}
          <div className="text-slate-400">
            <Icon size={10} />
          </div>
        </div>

        <div 
          className={cn(
            "p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed",
            isInbound 
              ? "bg-white border border-slate-100 rounded-tl-none text-slate-800" 
              : isAI 
                ? "bg-primary text-white rounded-tr-none"
                : "bg-blue-600 text-white rounded-tr-none"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

interface ConversationThreadProps {
  messages: Conversation[];
  leadName: string;
  isAIPaused?: boolean;
  onToggleAI?: () => void;
  onSendMessage?: (content: string) => void;
  className?: string;
}

export function ConversationThread({ 
  messages, 
  leadName, 
  isAIPaused = false, 
  onToggleAI, 
  onSendMessage,
  className 
}: ConversationThreadProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-slate-50/30 rounded-xl border border-slate-100 shadow-inner overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-slate-200">
            <AvatarFallback className="bg-slate-50 text-slate-600 font-bold">
              {leadName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">{leadName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                isAIPaused ? "text-amber-500" : "text-emerald-500"
              )}>
                <span className={cn(
                  "size-1.5 rounded-full",
                  isAIPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                )} />
                {isAIPaused ? "Manual Mode" : "AI Active"}
              </p>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-400 font-medium">SMS + Email</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-8 px-3 text-[10px] font-black uppercase tracking-widest transition-all",
                    isAIPaused 
                      ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" 
                      : "border-amber-200 text-amber-600 hover:bg-amber-50"
                  )}
                  onClick={onToggleAI}
                >
                  {isAIPaused ? (
                    <><Play size={12} className="mr-1 fill-current" /> Resume AI</>
                  ) : (
                    <><Pause size={12} className="mr-1 fill-current" /> Take Over</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAIPaused ? "Hand control back to AI" : "Pause AI and message manually"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="icon" className="size-8 text-slate-400">
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} leadName={leadName} />
          ))}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic py-20 gap-2">
              <MessageSquare size={32} className="opacity-10" />
              <p>No messages yet</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-lg">
        {isAIPaused ? (
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="pr-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl"
              />
              <button 
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors",
                  inputValue.trim() ? "text-blue-600 hover:bg-blue-50" : "text-slate-300"
                )}
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <SendHorizontal size={20} />
              </button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="size-10 rounded-xl border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                    <Phone size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Call {leadName}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4 py-2.5 text-xs text-slate-400 italic flex items-center gap-2 group">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              AI is handling this conversation...
              <button 
                className="ml-auto text-[10px] font-black uppercase text-primary hover:underline"
                onClick={onToggleAI}
              >
                Take Over
              </button>
            </div>
            <Button size="icon" variant="outline" className="size-10 rounded-xl border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
              <Phone size={18} />
            </Button>
          </div>
        )}
        <div className="flex justify-between mt-2 px-1">
          <p className="text-[9px] text-slate-400 font-medium">
            AI Assistant is {isAIPaused ? "paused" : "monitoring for intent"}
          </p>
          <div className="flex gap-3">
             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight cursor-pointer hover:text-primary">SMS</span>
             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight cursor-pointer hover:text-primary opacity-50">Email</span>
          </div>
        </div>
      </div>
    </div>
  );
}
