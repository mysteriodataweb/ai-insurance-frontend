"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FileText, LayoutDashboard, BarChart3, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const actions = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "submit", label: "Submit New Claim", icon: FileText, href: "/submit" },
  { id: "analytics", label: "View Analytics", icon: BarChart3, href: "/analytics" },
  { id: "login", label: "Sign In", icon: ArrowRight, href: "/login" },
  { id: "register", label: "Create an Account", icon: ArrowRight, href: "/register" },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // The palette is mounted on open, so the query starts empty each time.
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/20" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl border border-zinc-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 border-b border-zinc-100">
          <Search size={16} className="text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or type a command..."
            className="flex-1 py-3.5 outline-none text-sm placeholder:text-zinc-400"
          />
          <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 rounded">
            ESC
          </kbd>
        </div>

        <div className="p-1.5 max-h-[280px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-400">No results</div>
          ) : (
            filtered.map((action) => (
              <a
                key={action.id}
                href={action.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                <action.icon size={16} className="text-zinc-400" />
                <span className="flex-1">{action.label}</span>
              </a>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-zinc-100 flex items-center gap-3 text-[11px] text-zinc-400">
          <span><kbd className="px-1 py-0.5 bg-zinc-100 rounded text-[10px] font-mono">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 py-0.5 bg-zinc-100 rounded text-[10px] font-mono">↵</kbd> Select</span>
        </div>
      </div>
    </div>
  );
}
