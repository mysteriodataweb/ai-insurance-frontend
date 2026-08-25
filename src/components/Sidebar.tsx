"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, FileText, LayoutDashboard, BarChart3, Shield, Menu, X, Settings, LogOut, Search } from "lucide-react";
import clsx from "clsx";
import CommandPalette from "@/components/CommandPalette";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submit", label: "Submit Claim", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-zinc-200"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setOpen(false)} />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-[240px] sidebar z-40 transition-transform duration-200",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={16} />
              </div>
              <div>
                <h1 className="font-semibold text-sm">AI Insurance</h1>
                <p className="text-[11px] text-zinc-400">Operations</p>
              </div>
            </div>
          </div>

          <div className="px-3 my-3">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <Search size={14} />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 rounded">⌘K</kbd>
            </button>
          </div>

          <div className="mx-3 h-px bg-zinc-200" />

          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a key={item.href} href={item.href} className={clsx("sidebar-link", isActive && "sidebar-link-active")}>
                  <item.icon size={16} className={clsx(isActive ? "text-zinc-900" : "text-zinc-400")} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="p-3 border-t border-zinc-200 space-y-1">
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[11px] font-medium">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Ops Agent</p>
                <p className="text-[11px] text-zinc-400 truncate">admin@insurance.ai</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <a href="/login" className="sidebar-link">
              <LogOut size={16} className="text-zinc-400" />
              <span>Sign In</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
