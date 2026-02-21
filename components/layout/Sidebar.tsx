"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/llm-console", label: "LLM Console" },
  { href: "/comfyui-workflows", label: "ComfyUI Workflows" },
  { href: "/settings", label: "Settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-48 min-h-screen shrink-0 md:w-56 noir-sidebar-bg border-r border-noir-600/80 backdrop-blur-sm">
      <nav className="flex flex-col gap-0.5 p-3">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-cobalt-700/80 text-accent border border-accent/30 shadow-[0_0_12px_rgba(45,212,191,0.15)]"
                  : "text-slate-400 hover:bg-noir-600/80 hover:text-accent hover:border border border-transparent"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
