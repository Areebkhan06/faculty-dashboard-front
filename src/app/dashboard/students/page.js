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
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useFaculty } from "@/context/facultyContext";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";

export default function StudentsDashboard() {
  const { students, fetchAllStudents } = useFaculty();
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchAllStudents();
    }
  }, [isSignedIn, fetchAllStudents]);

  /* ------------------------------
   Optimized Search
--------------------------------*/
  const filteredStudents = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return students.filter((s) => {
      return (
        s.name?.toLowerCase().includes(search) ||
        s.rollno?.toLowerCase().includes(search) ||
        s.course?.toLowerCase().includes(search)
      );
    });
  }, [students, searchTerm]);

  /* ------------------------------
   Optimized Stats (Single Loop)
--------------------------------*/
  const { activeCount, dropoutCount, totalRevenue } = useMemo(() => {
    let active = 0;
    let dropout = 0;
    let revenue = 0;

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

  /* ------------------------------
   Currency Format (memoized)
--------------------------------*/
  const formattedRevenue = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(totalRevenue);
  }, [totalRevenue]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteStudent = async (id) => {
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch("http://localhost:3014/api/delete-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAllStudents(); // refresh list
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
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
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-8">
            <div className="relative w-full sm:flex-1 sm:max-w-sm">
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

            <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition duration-200 text-slate-700 w-full sm:w-auto shadow-sm">
              <Filter size={18} /> Filter
            </button>
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
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                              {s.name}
                            </p>
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
                          <StatusBadge status={s.status} />
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block">
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
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                                  <Eye size={16} /> View Details
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                                  <Edit size={16} /> Edit
                                </button>
                                <button onClick={()=>handleDeleteStudent(s._id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition">
                                  <Trash2  size={16} /> Delete
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
                      <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{s.email}</p>
                    </div>
                    <StatusBadge status={s.status} />
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
                      <p className="font-semibold text-slate-900 text-sm">
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{s.email}</p>
                    </div>
                    <StatusBadge status={s.status} />
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
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium">
                      <Eye size={14} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition font-medium">
                      <Edit size={14} /> Edit
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
