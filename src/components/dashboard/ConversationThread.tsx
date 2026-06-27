"use client";

import { Conversation } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Bot, Mail, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  message: Conversation;
  leadName: string;
}

function MessageBubble({ message, leadName }: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";
  const isAI = message.metadata?.sender_type === "ai";
  const channel = message.channel;

  const Icon = channel === "sms" ? MessageSquareIcon : channel === "email" ? Mail : Phone;

  function MessageSquareIcon({ size, className }: { size: number, className?: string }) {
    return <Mail size={size} className={className} />; // Fallback for now if I don't have it
  }

  return (
    <div className={cn("flex gap-3 mb-6", isInbound ? "flex-row" : "flex-row-reverse")}>
      <Avatar className={cn("size-8 mt-1 border", isInbound ? "border-slate-200" : "border-primary/20")}>
        {isInbound ? (
          <>
            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
              {leadName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className={cn("text-xs", isAI ? "bg-accent text-white" : "bg-primary text-white")}>
              {isAI ? <Bot size={14} /> : <User size={14} />}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isInbound ? "items-start" : "items-end")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            {isInbound ? leadName : (isAI ? "AI Assistant" : "Agent")}
          </span>
          <span className="text-[10px] text-slate-400">
            {format(new Date(message.created_at), "h:mm a")}
          </span>
          {!isInbound && isAI && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] h-3 px-1">
              AI
            </Badge>
          )}
          <div className="text-slate-400">
            <Icon size={10} />
          </div>
        </div>

        <div 
          className={cn(
            "p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap",
            isInbound 
              ? "bg-white border border-slate-100 rounded-tl-none text-slate-800" 
              : "bg-primary text-white rounded-tr-none"
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
  className?: string;
}

export function ConversationThread({ messages, leadName, className }: ConversationThreadProps) {
  return (
    <div className={cn("flex flex-col h-full bg-slate-50/30 rounded-xl border border-slate-100 overflow-hidden", className)}>
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-slate-200">
            <AvatarFallback className="bg-slate-50 text-slate-600 font-bold">
              {leadName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">{leadName}</h2>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              AI Active
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} leadName={leadName} />
        ))}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-20">
            No messages yet
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400 italic flex items-center">
            AI is handling this conversation...
          </div>
          <button className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
            <Phone size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
