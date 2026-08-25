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
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div className={clsx("relative max-w-[75%] rounded-2xl px-4 py-3", isAgent ? "bg-gray-50 border border-gray-100" : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20")}>
        <p className={clsx("text-[10px] font-bold uppercase tracking-wider mb-1", isAgent ? "text-blue-500" : "text-white/60")}>
          {isAgent ? "AI Agent" : "Customer"}
        </p>
        <p className={clsx("text-sm leading-relaxed", isAgent ? "text-gray-700" : "text-white")}>
          {displayText}
          {streaming && displayText.length < message.length && (
            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
        <div className={clsx("flex items-center gap-2 mt-2", isAgent ? "justify-between" : "justify-end")}>
          {timestamp && isAgent && (
            <span className="text-[10px] text-gray-400">{timestamp}</span>
          )}
          {isAgent && (
            <button
              onClick={handleCopy}
              className={clsx(
                "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all",
                copied ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
            >
              {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
            </button>
          )}
        </div>
      </div>

      {!isAgent && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <User size={14} className="text-white" />
        </div>
      )}
    </div>
  );
}