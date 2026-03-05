"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 p-3 bg-linear-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 lg:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 sm:w-72 bg-linear-to-b from-white via-slate-50 to-slate-100 border-r border-slate-200/60 shadow-xl
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:shadow-none lg:from-white lg:via-white lg:to-white`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-6 sm:py-8 border-b border-slate-200/60 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white font-black text-lg">II</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              IICS
            </h2>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 sm:p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-lg text-sm font-semibold transition-all duration-200 overflow-hidden
                  ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-linear-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isActive ? "opacity-0" : ""}`}></div>

                {/* Icon */}
                <div className={`relative shrink-0 transition-all duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  <Icon size={20} />
                </div>

                {/* Text */}
                <span className="relative flex-1">{item.name}</span>

                {/* Active indicator */}
                {isActive && (
                  <ChevronRight size={18} className="relative shrink-0 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with accent */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-blue-50 to-transparent p-4 border-t border-slate-200/60">
          <div className="rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/60 p-3 text-center">
            <p className="text-xs font-semibold text-slate-600 mb-2">Faculty Portal</p>
            <p className="text-[10px] text-slate-500">Indian Institute of Computer Science</p>
          </div>
        </div>
      </aside>

      {/* Main content spacer (optional - uncomment if needed for layout) */}
      {/* <div className="hidden lg:block w-64" /> */}
    </>
  );
}