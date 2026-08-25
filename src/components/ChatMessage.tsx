"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Bot, User } from "lucide-react";
import clsx from "clsx";

interface ChatMessageProps {
  role: "agent" | "customer";
  message: string;
  timestamp?: string;
  streaming?: boolean;
}

export default function ChatMessage({ role, message, timestamp, streaming = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState(streaming ? "" : message);

  useEffect(() => {
    if (!streaming) {
      setDisplayText(message);
      return;
    }
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayText(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [message, streaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAgent = role === "agent";

  return (
    <div className={clsx("flex gap-3 group", isAgent ? "justify-start" : "justify-end")}>
      {isAgent && (
        <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div className={clsx("relative max-w-[75%] rounded-xl px-4 py-3", isAgent ? "bg-zinc-50 border border-zinc-200" : "bg-zinc-900 text-white")}>
        <p className={clsx("text-[10px] font-semibold uppercase tracking-wider mb-1", isAgent ? "text-zinc-400" : "text-zinc-400")}>
          {isAgent ? "AI Agent" : "Customer"}
        </p>
        <p className={clsx("text-sm leading-relaxed", isAgent ? "text-zinc-700" : "text-white")}>
          {displayText}
          {streaming && displayText.length < message.length && (
            <span className="inline-block w-0.5 h-4 bg-zinc-400 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
        <div className={clsx("flex items-center gap-2 mt-2", isAgent ? "justify-between" : "justify-end")}>
          {timestamp && isAgent && (
            <span className="text-[10px] text-zinc-400">{timestamp}</span>
          )}
          {isAgent && (
            <button
              onClick={handleCopy}
              className={clsx(
                "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all",
                copied ? "text-emerald-600 bg-emerald-50" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              )}
            >
              {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
            </button>
          )}
        </div>
      </div>

      {!isAgent && (
        <div className="w-7 h-7 bg-zinc-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-white" />
        </div>
      )}
    </div>
  );
}
