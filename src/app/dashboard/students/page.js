"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  IndianRupee,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  Download,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Check,
  Loader, // ✅ add
  CheckCircle2, // ✅ add
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useFaculty } from "@/context/facultyContext";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";
import { courseOptions } from "@/data";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function StudentsDashboard() {
  const { students, fetchAllStudents, BackendURL, setStudents } = useFaculty();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  // ── useState ────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(null);

  // ── useMemo ─────────────────────────────────────
  const normalizedStudents = useMemo(() => {
    return students.map((s) => ({
      ...s,
      nameLower: s.name?.toLowerCase() || "",
      courseLower: s.course?.toLowerCase() || "",
      rollnoStr: s.rollno?.toString() || "",
    }));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return normalizedStudents.filter((s) => {
      if (
        search &&
        !(
          s.nameLower.includes(search) ||
          s.rollnoStr.includes(search) ||
          s.courseLower.includes(search)
        )
      )
        return false;
      if (courseFilter && s.courseLower !== courseFilter.toLowerCase())
        return false;
      if (batchFilter && s.batch !== batchFilter) return false;
      if (daysFilter && s.days !== daysFilter) return false;
      return true;
    });
  }, [normalizedStudents, searchTerm, courseFilter, batchFilter, daysFilter]);

  const { activeCount, dropoutCount, totalRevenue } = useMemo(() => {
    let active = 0,
      dropout = 0,
      revenue = 0;
    for (let s of students) {
      if (s.status === "active") {
        active++;
        revenue += Number(s.monthlyFee || 0);
      } else if (s.status === "dropout") {
        dropout++;
      }
    }
    return {
      activeCount: active,
      dropoutCount: dropout,
      totalRevenue: revenue,
    };
  }, [students]);

  const formattedRevenue = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(totalRevenue);
  }, [totalRevenue]);

  // ── useEffect ────────────────────────────────────
  useEffect(() => {
    const loadStudents = async () => {
      if (isSignedIn) {
        setLoading(true);
        await fetchAllStudents();
        setLoading(false);
      }
    };
    loadStudents();
  }, [isSignedIn]);

  useEffect(() => {
    // ✅ moved up before early return
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Early return AFTER all hooks ─────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loading />
        </div>
      </div>
    );
  }

  // ── Regular functions ────────────────────────────
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleDeleteStudent = async (id) => {
    try {
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/delete-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchAllStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAllStudents = async () => {
    if (!confirm("Are you sure you want to delete ALL students?")) return;
    setDeleting(true);
    try {
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/delete-all-students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("Deleted all students");
        fetchAllStudents();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const markComplete = async (id) => {
    setCompleting(id);
    try {
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/marke-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: id }),
      });
      const data = await res.json();
      if (data.success) fetchAllStudents();
    } catch (err) {
      console.error("markComplete error →", err);
    } finally {
      setCompleting(null);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== HEADER ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Student Directory
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Manage students, monitor status and track revenue
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition duration-200 text-slate-700 w-full sm:w-auto shadow-sm">
                <Download size={18} /> Export
              </button>
              <button
                onClick={handleDeleteAllStudents}
                disabled={deleting}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition duration-200 w-full sm:w-auto shadow-sm
                ${
                  deleting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white border border-red-500"
                }`}
              >
                {deleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={18} /> Delete All
                  </>
                )}
              </button>
              <button
                onClick={() => router.push("/dashboard/students/add-students")}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Plus size={18} /> Add Student
              </button>
            </div>
          </div>

          {/* ===== STATS GRID ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Students"
              value={students.length}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              trend="+12%"
              color="from-blue-100 to-blue-50"
              borderColor="border-blue-200"
            />
            <StatCard
              title="Active Students"
              value={activeCount}
              icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
              trend="+8%"
              color="from-emerald-100 to-emerald-50"
              borderColor="border-emerald-200"
            />
            <StatCard
              title="Dropouts"
              value={dropoutCount}
              icon={<UserX className="w-6 h-6 text-rose-600" />}
              trend="-3%"
              color="from-rose-100 to-rose-50"
              borderColor="border-rose-200"
            />
            <StatCard
              title="Total Fee count"
              value={formattedRevenue}
              icon={<IndianRupee className="w-6 h-6 text-indigo-600" />}
              trend="+15%"
              color="from-indigo-100 to-indigo-50"
              borderColor="border-indigo-200"
            />
          </div>

          {/* ===== SEARCH + FILTER ===== */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-8">
            {/* SEARCH */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, RollNo, or course..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full lg:w-auto">
              {/* Course Filter */}
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Courses</option>

                {courseOptions.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>

              {/* Batch Timing */}
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Timings</option>
                <option value="7:30-9:00">7:30 - 9:00</option>
                <option value="9:00-10:30">9:00 - 10:30</option>
                <option value="10:30-12:00">10:30 - 12:00</option>
                <option value="12:00-1:30">12:00 - 1:30</option>
                <option value="2:00-3:30">2:00 - 3:30</option>
                <option value="3:30-5:00">3:30 - 5:00</option>
                <option value="5:00-6:30">5:00 - 6:30</option>
              </select>

              {/* Class Days */}
              <select
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Days</option>
                <option value="MWF">MWF</option>
                <option value="TTS">TTS</option>
                <option value="Daily">Daily</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden lg:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Monthly Fee
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr
                        key={s._id}
                        className="hover:bg-slate-50 transition group"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <Link
                              href={`/dashboard/students/${s._id}`}
                              className="font-semibold text-slate-900 group-hover:text-blue-600 transition"
                            >
                              {s.name}
                            </Link>
                            <p className="text-xs text-slate-500 mt-1">
                              {s.rollno}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-700">{s.course}</td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">
                            ₹{s.monthlyFee}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            id={s._id}
                            status={s.status}
                            onClick={() => {
                              console.log("data");
                            }}
                          />
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block menu-container">
                            <button
                              onClick={() =>
                                setOpenMenu(openMenu === s._id ? null : s._id)
                              }
                              className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenu === s._id && (
                              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                                {/* ✅ Hide Mark Complete if already completed */}
                                {s.status !== "completed" && (
                                  <button
                                    onClick={() => {
                                      markComplete(s._id);
                                      setOpenMenu(null);
                                    }}
                                    disabled={completing === s._id}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {completing === s._id ? (
                                      <Loader
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CheckCircle2 size={16} />
                                    )}
                                    Mark Complete
                                  </button>
                                )}

                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                                  <Edit size={16} /> Edit
                                </button>

                                <button
                                  onClick={() => {
                                    handleDeleteStudent(s._id);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                                >
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No students found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== TABLET VIEW ===== */}
          <div className="hidden md:grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition space-y-4 group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <Link
                        href={`/dashboard/students/${s._id}`}
                        className="font-semibold text-slate-900 group-hover:text-blue-600 transition"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{s.email}</p>
                    </div>
                    <StatusBadge status={s.status} id={s._id} />
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">
                        Course
                      </p>
                      <p className="text-sm text-slate-700">{s.course}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium mb-1">
                        Monthly Fee
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        ₹{s.monthlyFee}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium">
                      <Eye size={14} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium">
                      <Edit size={14} /> Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-slate-500">
                No students found matching your search
              </div>
            )}
          </div>

          {/* ===== MOBILE CARD VIEW ===== */}
          <div className="md:hidden space-y-3">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        href={`/dashboard/students/${s._id}`}
                        className="font-semibold text-slate-900 text-sm"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{s.email}</p>
                    </div>
                    <StatusBadge status={s.status} id={s._id} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-200 pt-3">
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Course</p>
                      <p className="text-slate-700 text-xs">{s.course}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Fee</p>
                      <p className="text-slate-900 font-semibold">
                        ₹{s.monthlyFee}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {/* <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium">
                      <Eye size={14} /> View
                    </button> */}
                    <button
                      onClick={() => handleDeleteStudent(s._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                No students found matching your search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
