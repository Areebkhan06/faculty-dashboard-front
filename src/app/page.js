"use client";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useState } from "react";
import FeatureCard from "@/components/FeatureCard";
import TrustCard from "@/components/TrustCard";
import MetricCard from "@/components/MetricCard";
import { useFaculty } from "@/context/facultyContext";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {checkFacultyProfile} = useFaculty()

  return (
    <div className="selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-32 pb-24 sm:pb-32 lg:pb-48">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-br from-blue-200/40 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/2 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-linear-to-bl from-indigo-200/30 to-blue-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute bottom-0 left-1/3 w-56 sm:w-80 h-56 sm:h-80 bg-linear-to-tr from-cyan-100/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Badge */}
          <div className="flex justify-center mb-8 sm:mb-12 lg:mb-14">
            <Link
              href={"/dashboard"}
              className="inline-flex items-center gap-2 sm:gap-3 bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200/60 text-blue-700 px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all group cursor-pointer"
            >
              <span className="flex gap-1.5 sm:gap-2 items-center">
                <Sparkles
                  size={12}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="hidden sm:inline">
                  New Faculty Portal 2026
                </span>
                <span className="sm:hidden">Portal 2026</span>
              </span>
              <ChevronRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Main Heading */}
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16 space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-slate-900 tracking-tight px-2">
              Elevate Academic
              <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Excellence
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Intelligent faculty management system that orchestrates courses,
              schedules, analytics, and institutional governance—all in one
              unified ecosystem.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-0 group">
            <div className="absolute -inset-1 sm:-inset-2 bg-linear-to-r from-blue-400/30 via-cyan-400/30 to-indigo-400/30 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <div className="relative bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="bg-linear-to-b from-slate-50 to-white border-b border-slate-200/60 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <div className="flex gap-1.5 sm:gap-2.5">
                  <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-red-400/70 hover:bg-red-500 transition"></div>
                  <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-amber-400/70 hover:bg-amber-500 transition"></div>
                  <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-green-400/70 hover:bg-green-500 transition"></div>
                </div>
                <span className="text-[8px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:inline">
                  IICS Analytics
                </span>
                <div className="w-8 sm:w-12"></div>
              </div>

              {/* Dashboard content */}
              <div className="p-4 sm:p-6 lg:p-8 bg-linear-to-b from-white via-slate-50 to-slate-100">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <MetricCard
                    label="Batches"
                    value="18"
                    icon={<Users size={16} />}
                  />
                  <MetricCard
                    label="Courses"
                    value="12"
                    icon={<BookOpen size={16} />}
                  />
                  <MetricCard
                    label="Reports"
                    value="247"
                    icon={<BarChart3 size={16} />}
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">System Performance</span>
                    <span className="text-emerald-600">99.9%</span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[99%] bg-linear-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section
        id="trust"
        className="py-16 sm:py-24 lg:py-28 bg-linear-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <TrustCard
              icon={<Lock className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="Military-Grade Security"
              desc="End-to-end encryption with institutional data protection."
              color="from-blue-500 to-blue-600"
            />
            <TrustCard
              icon={<Zap className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="Lightning-Fast Performance"
              desc="Sub-100ms response times for seamless workflows."
              color="from-amber-500 to-orange-600"
            />
            <TrustCard
              icon={<Target className="w-5 sm:w-6 h-5 sm:h-6" />}
              title="Intelligent Analytics"
              desc="AI-powered insights for data-driven decisions."
              color="from-emerald-500 to-green-600"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section
        id="features"
        className="py-20 sm:py-28 lg:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto px-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
              Comprehensive Academic
              <br className="hidden sm:block" /> Orchestration
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Four pillars of institutional excellence designed for modern
              education.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
            <FeatureCard
              icon={<BookOpen size={24} />}
              title="Course Lifecycle"
              desc="End-to-end syllabus, assignments, and milestone tracking."
              gradient="from-blue-500 to-cyan-500"
              index={0}
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Faculty Governance"
              desc="Dynamic role assignments and mentor allocation."
              gradient="from-indigo-500 to-blue-500"
              index={1}
            />
            <FeatureCard
              icon={<Calendar size={24} />}
              title="Smart Scheduling"
              desc="Automated timetable with real-time conflict detection."
              gradient="from-cyan-500 to-emerald-500"
              index={2}
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Advanced Analytics"
              desc="Granular performance metrics and compliance reporting."
              gradient="from-amber-500 to-orange-500"
              index={3}
            />
          </div>

          {/* Feature highlight */}
          <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl border border-slate-700/50 p-6 sm:p-8 lg:p-12 text-white overflow-hidden relative group hover:border-slate-600 transition">
            <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-linear-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="px-2 sm:px-0">
                <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6">
                  Unified Intelligence Layer
                </h3>
                <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                  All systems communicate through a central intelligence hub.
                  Real-time synchronization across faculty profiles, schedules,
                  batches, and performance metrics.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Real-time Sync
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    AI Insights
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700 transition">
                  <div className="text-xs text-slate-400 mb-2">Batches</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">
                    42
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700 transition">
                  <div className="text-xs text-slate-400 mb-2">Faculty</div>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                    128
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700 transition">
                  <div className="text-xs text-slate-400 mb-2">Courses</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                    89
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-4 border border-slate-600/50 hover:bg-slate-700 transition">
                  <div className="text-xs text-slate-400 mb-2">Analytics</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">
                    1.2K
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
