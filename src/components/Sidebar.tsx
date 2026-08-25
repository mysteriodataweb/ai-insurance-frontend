"use client";

import { usePathname } from "next/navigation";
import { Home, FileText, LayoutDashboard, BarChart3, Shield, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/submit", label: "Submit Claim", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
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
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
                <Shield className="text-white" size={18} />
              </div>
              <div>
                <h1 className="font-extrabold text-[15px] tracking-tight">AI Insurance</h1>
                <p className="text-[11px] text-gray-400 font-medium">Operations Platform</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-gray-100" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a key={link.href} href={link.href} className={clsx("sidebar-link group", isActive && "sidebar-link-active")}>
                  <link.icon size={18} className={clsx(isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                  <span className="flex-1">{link.label}</span>
                  {isActive && <ChevronRight size={14} className="text-blue-400" />}
                </a>
              );
            })}
          </nav>

          {/* Bottom card */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                  AI
                </div>
                <div>
                  <p className="text-sm font-semibold">Ops Agent</p>
                  <p className="text-[11px] text-gray-400">admin@insurance.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Online
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}