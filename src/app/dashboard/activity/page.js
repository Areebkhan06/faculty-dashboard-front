"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarDays,
  Tag,
  Plus,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useFaculty } from "@/context/facultyContext";

const statusConfig = {
  completed: {
    style: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: <CheckCircle2 size={14} />,
    label: "Completed",
  },
  pending: {
    style: "bg-amber-50 text-amber-700 border-amber-100",
    icon: <Clock3 size={14} />,
    label: "Pending",
  },
  cancelled: {
    style: "bg-rose-50 text-rose-700 border-rose-100",
    icon: <XCircle size={14} />,
    label: "Cancelled",
  },
};

export default function ActivityDashboard() {
  const { getToken } = useAuth();
  const { BackendURL } = useFaculty();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear()
  );

  // ✅ FETCH DATA
  const fetchActivity = async () => {
    try {
      setLoading(true);

      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/fetch-activity`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setActivities(
          (data.activities || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CALL ON LOAD
  useEffect(() => {
    fetchActivity();
  }, []);

  // ✅ FILTER LOGIC
  const filteredActivities = activities.filter((a) => {
    const date = new Date(a.createdAt);

    const matchMonth =
      date.getMonth() + 1 === currentMonth &&
      date.getFullYear() === currentYear;

    const matchStatus =
      filter === "All" ? true : a.status === filter.toLowerCase();

    return matchMonth && matchStatus;
  });

  // ✅ HANDLE COMPLETE
  const handleComplete = (id) => {
    setActivities((prev) =>
      prev.map((a) =>
        a._id === id
          ? {
              ...a,
              status: "completed",
              completedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-20">
  <div className="max-w-5xl mx-auto p-6 md:p-10">
    
    {/* --- HEADER --- */}
    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1 w-8 bg-indigo-600 rounded-full" />
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Workspace</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Activity <span className="text-indigo-600">Feed</span>
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Track your progress and upcoming milestones.
        </p>
      </div>

      <Link
        href="/dashboard/activity/add-activity"
        className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
      >
        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        <span>New Activity</span>
      </Link>
    </header>

    {/* --- FILTERS SECTION --- */}
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
      {/* Status Pills */}
      <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-2xl w-fit">
        {["All", "Completed", "Pending", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              filter === tab
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date Selectors */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <CalendarDays size={16} className="text-slate-400" />
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* --- ACTIVITY LIST --- */}
    <div className="space-y-4">
      {filteredActivities.map((activity) => (
        <div
          key={activity._id}
          className="group bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100"
        >
          {/* Visual Status Indicator */}
          <div className={`hidden md:flex h-12 w-12 items-center justify-center rounded-2xl border ${
            activity.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
            activity.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
            'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            {activity.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock3 size={20} />}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                {activity.title}
              </h2>
              {/* Mobile Only Badge */}
              <span className={`md:hidden text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                activity.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                {activity.status}
              </span>
            </div>
            
            <p className="text-slate-500 text-sm font-medium line-clamp-2">
              {activity.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                <Tag size={12} className="text-indigo-400" />
                {activity.category}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                <CalendarDays size={12} className="text-indigo-400" />
                {new Date(activity.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
            {activity.status === "pending" ? (
              <button
                onClick={() => handleComplete(activity._id)}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Mark Complete
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100">
                <CheckCircle2 size={14} />
                Done
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Empty State */}
    {filteredActivities.length === 0 && (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No entries found</p>
      </div>
    )}

  </div>
</div>
  );
}