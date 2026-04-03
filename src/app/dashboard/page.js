"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowRightLeft,
  Users,
  UserCheck,
  GraduationCap,
  IndianRupee,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useFaculty } from "@/context/facultyContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n = 0) => {
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(2) + "Cr";
  if (n >= 100_000) return "₹" + (n / 100_000).toFixed(1) + "L";
  if (n >= 1_000) return "₹" + (n / 1_000).toFixed(1) + "K";
  return "₹" + Math.round(n).toLocaleString("en-IN");
};

const pct = (a = 0, b = 0) => (!b ? 0 : Math.round((a / b) * 100));

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, topBarClass, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ animation: `fadeSlideUp 0.5s ease-out ${delay}ms both` }}
    >
      <div className={`h-1 w-full ${topBarClass}`} />
      <div className="p-5">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
          <Icon size={16} strokeWidth={1.8} className="text-gray-600" />
        </div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, total, barClass }) {
  const p = pct(value, total);
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${barClass}`}
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

// ─── DataRow ─────────────────────────────────────────────────────────────────

function DataRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      {children}
    </div>
  );
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

function Pill({ children, variant = "neutral" }) {
  const map = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    success: "bg-blue-50 text-blue-700 border border-blue-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${map[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-9 w-52 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 h-28 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 h-56 animate-pulse"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 h-40 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FacultyDashboard() {
  const { requestCount, BackendURL } = useFaculty();
  const { getToken } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const token = await getToken({ template: "default" });
        const res = await fetch(`${BackendURL}/api/faculty-stats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load stats");
        }

        setStats(data.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [BackendURL, getToken]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const s = stats?.students ?? {};
  const f = stats?.fees ?? {};
  const r = stats?.revenue ?? {};

  const dropout = Math.max(
    0,
    (s.total ?? 0) - (s.active ?? 0) - (s.completed ?? 0)
  );
  const totalRev = (r.collected ?? 0) + (r.pending ?? 0);
  const activePct = pct(s.active, s.total);
  const feePct = pct(f.paid, f.totalFees);
  const revPct = pct(r.collected, totalRev);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-red-500" strokeWidth={1.8} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Failed to load
          </h3>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spinning { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div
            className="flex flex-wrap items-start justify-between gap-4 mb-10"
            style={{ animation: "fadeSlideUp 0.4s ease-out both" }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500 mb-2">
                Faculty portal
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-light">
                Students, fees &amp; revenue — this month
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                title="Refresh"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
              >
                <RefreshCw
                  size={15}
                  strokeWidth={1.8}
                  className={refreshing ? "spinning" : ""}
                />
              </button>

              <button
                onClick={() => router.push("/dashboard/request")}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <ArrowRightLeft size={14} strokeWidth={1.8} />
                <span className="hidden sm:inline">Transfer requests</span>
                <span className="sm:hidden">Requests</span>
                {requestCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {requestCount > 9 ? "9+" : requestCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Stat Cards ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard
              label="Total students"
              value={s.total}
              sub="all enrolled"
              icon={Users}
              topBarClass="bg-blue-500"
              delay={0}
            />
            <StatCard
              label="Active"
              value={s.active}
              sub={`${activePct}% of total`}
              icon={UserCheck}
              topBarClass="bg-emerald-500"
              delay={60}
            />
            <StatCard
              label="Completed"
              value={s.completed}
              sub="finished course"
              icon={GraduationCap}
              topBarClass="bg-amber-500"
              delay={120}
            />
            <StatCard
              label="Collected"
              value={fmt(r.collected)}
              sub="this month"
              icon={IndianRupee}
              topBarClass="bg-green-500"
              delay={180}
            />
            <StatCard
              label="Outstanding"
              value={fmt(r.pending)}
              sub="pending"
              icon={AlertCircle}
              topBarClass="bg-red-500"
              delay={240}
            />
            <StatCard
              label="Fee records"
              value={f.totalFees}
              sub={`${f.paid ?? 0} paid · ${f.pending ?? 0} due`}
              icon={Clock}
              topBarClass="bg-violet-500"
              delay={300}
            />
          </div>

          {/* ── Two-column panels ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            {/* Student breakdown */}
            <Panel title="Student breakdown">
              <DataRow label="Total enrolled">
                <span className="text-sm font-semibold text-gray-800">
                  {s.total ?? "—"}
                </span>
              </DataRow>
              <DataRow label="Active">
                <Pill variant="active">
                  <CheckCircle2 size={11} />
                  {s.active ?? "—"} active
                </Pill>
              </DataRow>
              <DataRow label="Completed">
                <Pill variant="success">
                  <GraduationCap size={11} />
                  {s.completed ?? "—"} completed
                </Pill>
              </DataRow>
              <DataRow label="Inactive / dropout">
                <Pill variant="danger">
                  <AlertCircle size={11} />
                  {dropout} dropped
                </Pill>
              </DataRow>
              <div className="mt-4 pt-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Active rate</span>
                  <span className="font-medium text-gray-600">
                    {activePct}%
                  </span>
                </div>
                <ProgressBar
                  value={s.active}
                  total={s.total}
                  barClass="bg-emerald-500"
                />
              </div>
            </Panel>

            {/* Fee status */}
            <Panel title="Fee status — this month">
              <DataRow label="Total records">
                <span className="text-sm font-semibold text-gray-800">
                  {f.totalFees ?? "—"}
                </span>
              </DataRow>
              <DataRow label="Paid on time / late">
                <Pill variant="active">
                  <CheckCircle2 size={11} />
                  {f.paid ?? "—"} paid
                </Pill>
              </DataRow>
              <DataRow label="Unpaid / overdue">
                <Pill variant="danger">
                  <AlertCircle size={11} />
                  {f.pending ?? "—"} pending
                </Pill>
              </DataRow>
              <DataRow label="Collection rate">
                <span className="text-sm font-bold text-gray-900">
                  {feePct}%
                </span>
              </DataRow>
              <div className="mt-4 pt-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Paid vs total</span>
                  <span className="font-medium text-gray-600">
                    {f.paid ?? 0} / {f.totalFees ?? 0}
                  </span>
                </div>
                <ProgressBar
                  value={f.paid}
                  total={f.totalFees}
                  barClass="bg-emerald-500"
                />
              </div>
            </Panel>
          </div>

          {/* ── Revenue panel ─────────────────────────────────────────────── */}
          <Panel title="Revenue snapshot">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                {
                  label: "Total expected",
                  value: fmt(totalRev),
                  valClass: "text-gray-900",
                },
                {
                  label: "Collected",
                  value: fmt(r.collected),
                  valClass: "text-emerald-600",
                },
                {
                  label: "Outstanding",
                  value: fmt(r.pending),
                  valClass: "text-red-500",
                },
                {
                  label: "Collection rate",
                  value: `${revPct}%`,
                  valClass: "text-indigo-600",
                },
              ].map(({ label, value, valClass }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-[11px] text-gray-400 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${valClass}`}>{value}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Revenue collected</span>
                <span className="font-medium text-gray-600">{revPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${revPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-300 mt-1.5">
                <span>{fmt(r.collected)}</span>
                <span>{fmt(totalRev)}</span>
              </div>
            </div>
          </Panel>

        </div>
      </div>
    </>
  );
}