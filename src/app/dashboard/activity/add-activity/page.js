"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Tag,
  FileText,
  AlignLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useFaculty } from "@/context/facultyContext";

export default function AddActivity() {
  const { getToken } = useAuth();
  const { BackendURL } = useFaculty();
  
  // States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // type: "success" | "error"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    status: "pending",
    date: "",
  });

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/add-activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Activity created successfully!" });
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          status: "pending",
          date: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create activity." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-6 selection:bg-indigo-100">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        
        {/* --- STATUS MESSAGE (TOAST) --- */}
        {message.text && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg border animate-in fade-in zoom-in duration-300 ${
            message.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
            : "bg-rose-50 border-rose-100 text-rose-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold text-sm">{message.text}</span>
            <button onClick={() => setMessage({ type: "", text: "" })} className="ml-2 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Decorative Header */}
        <div className="bg-indigo-600 p-8 md:p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-indigo-200" />
              <span className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em]">
                Workspace
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Create Activity
            </h1>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-7">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide ml-1">
              Activity Title
            </label>
            <div className="group flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
              <FileText size={18} className="text-slate-400 mr-3 group-focus-within:text-indigo-500" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced React Workshop"
                className="w-full bg-transparent outline-none text-slate-800 font-medium"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide ml-1">
              Description
            </label>
            <div className="group flex bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
              <AlignLeft size={18} className="text-slate-400 mr-3 mt-1 group-focus-within:text-indigo-500" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the objectives..."
                rows={3}
                className="w-full bg-transparent outline-none text-slate-800 font-medium resize-none"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide ml-1">
                Category
              </label>
              <div className="group flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                <Tag size={18} className="text-slate-400 mr-3 group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Teaching"
                  className="w-full bg-transparent outline-none text-slate-800 font-medium"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide ml-1">
                Scheduled Date
              </label>
              <div className="group flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 transition-all focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                <CalendarDays size={18} className="text-slate-400 mr-3 group-focus-within:text-indigo-500" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-slate-800 font-medium"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 group ${
                loading 
                ? "bg-indigo-400 cursor-not-allowed text-indigo-50" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Add Activity</span>
                  <div className="bg-indigo-500 group-hover:bg-indigo-400 p-1 rounded-lg transition-colors">
                    <Sparkles size={16} />
                  </div>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}