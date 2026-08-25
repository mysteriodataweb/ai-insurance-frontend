"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FileText, LayoutDashboard, BarChart3, ArrowRight, X, Command } from "lucide-react";
import clsx from "clsx";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const actions = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard", shortcut: "D" },
  { id: "submit", label: "Submit New Claim", icon: FileText, href: "/submit", shortcut: "S" },
  { id: "analytics", label: "View Analytics", icon: BarChart3, href: "/analytics", shortcut: "A" },
  { id: "login", label: "Sign In", icon: ArrowRight, href: "/login", shortcut: "L" },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-gray-100">
          <Search size={18} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or type a command..."
            className="flex-1 py-4 outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
          <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No results found</div>
          ) : (
            filtered.map((action) => (
              <a
                key={action.id}
                href={action.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <action.icon size={16} className="text-gray-400 group-hover:text-blue-500" />
                <span className="flex-1">{action.label}</span>
                <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded-md">
                  {action.shortcut}
                </kbd>
              </a>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}