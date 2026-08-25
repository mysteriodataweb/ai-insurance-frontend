"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, FileText, LayoutDashboard, BarChart3, Shield, Menu, X, ChevronDown, Settings, LogOut, Command } from "lucide-react";
import clsx from "clsx";
import CommandPalette from "@/components/CommandPalette";

const navGroups = [
  {
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/submit", label: "Submit Claim", icon: FileText },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
];

const bottomItems = [
  { href: "/login", label: "Sign In", icon: LogOut },
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

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-[260px] sidebar z-40 transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
                <Shield className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-extrabold text-[15px] tracking-tight">AI Insurance</h1>
                <p className="text-[11px] text-gray-400 font-medium">Operations Platform</p>
              </div>
            </div>
          </div>

          {/* Search trigger */}
          <div className="px-4 mb-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <Command size={14} />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded-md">⌘K</kbd>
            </button>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-gray-100" />

          {/* Navigation Groups */}
          <nav className="flex-1 p-4 space-y-4">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a key={item.href} href={item.href} className={clsx("sidebar-link group", isActive && "sidebar-link-active")}>
                      <item.icon size={18} className={clsx(isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                      <span className="flex-1">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 space-y-3">
            {/* User card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                  AI
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Ops Agent</p>
                  <p className="text-[11px] text-gray-400 truncate">admin@insurance.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </div>
            </div>

            {/* Bottom nav */}
            {bottomItems.map((item) => (
              <a key={item.href} href={item.href} className="sidebar-link group">
                <item.icon size={18} className="text-gray-400 group-hover:text-blue-500" />
                <span className="flex-1">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}