"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarDays,
  Tag,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useFaculty } from "@/context/facultyContext";

export default function ActivityDashboard() {
  const { getToken } = useAuth();
  const { BackendURL } = useFaculty();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  // Dynamic Date Ranges
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - 1 + i); // Prev, Current, Next
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/fetch-activity`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setActivities(
          (data.activities || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const filteredActivities = activities.filter((a) => {
    const date = new Date(a.createdAt);
    const matchMonth =
      date.getMonth() + 1 === currentMonth &&
      date.getFullYear() === currentYear;
    const matchStatus =
      filter === "All" ? true : a.status === filter.toLowerCase();
    return matchMonth && matchStatus;
  });

  const handleComplete = async (id) => {
    try {
      const token = await getToken({ template: "default" });

      // 1. Make the API Call first
      const res = await fetch(`${BackendURL}/api/mark-complete-activity`, {
        method: "POST", // or PATCH/PUT depending on your backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId: id }),
      });

      const data = await res.json();

      if (data.success) {
        // 2. Update UI state only if the database update succeeded
        setActivities((prev) =>
          prev.map((a) =>
            a._id === id
              ? {
                  ...a,
                  status: "completed",
                  completedAt: new Date().toISOString(),
                }
              : a,
          ),
        );
      } else {
        console.error("Failed to mark as complete:", data.message);
        // Optional: Add a toast notification here
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-20">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10">
        {/* --- HEADER --- */}
        <header className="mb-8 md:mb-12 flex flex-col sm:row sm:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 bg-indigo-600 rounded-full" />
              <span className="text-indigo-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                Workspace
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Activity <span className="text-indigo-600">Feed</span>
            </h1>
          </div>

          <Link
            href="/dashboard/activity/add-activity"
            className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            <span>New Activity</span>
          </Link>
        </header>

        {/* --- FILTERS & DYNAMIC SELECTORS --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="-mx-4 px-4 overflow-x-auto no-scrollbar lg:mx-0 lg:px-0">
            <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-2xl w-fit border border-slate-200/50">
              {["All", "Completed", "Pending", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    filter === tab
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- ACTIVITY LIST --- */}
        <div className="grid gap-4 sm:gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity._id}
              className="group bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:border-indigo-100 relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 md:hidden ${activity.status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`}
              />

              <div
                className={`hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                  activity.status === "completed"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-amber-50 border-amber-100 text-amber-600"
                }`}
              >
                {activity.status === "completed" ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Clock3 size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                      {activity.title}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      Created:{" "}
                      {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      activity.status === "completed"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>

                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                    <Tag size={12} className="text-indigo-400" />
                    {activity.category}
                  </div>

                  {/* Target Activity Date */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-xl">
                    <CalendarDays size={12} />
                    <span>
                      Target:{" "}
                      {new Date(activity.date).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                {activity.status === "pending" ? (
                  <button
                    onClick={() => handleComplete(activity._id)}
                    className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Done</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 w-full md:w-auto">
                    <CheckCircle2 size={14} />
                    Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Clock3 size={32} className="text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-center px-6">
              No activities for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
