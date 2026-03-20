"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  TrendingUp,
  BookOpen,
  DollarSign,
  Filter,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Phone,
  Eye,
  Zap,
  Award,
  Briefcase,
  IndianRupee,
  MapPin,
  PlusCircleIcon,
  ArrowRightLeft,
} from "lucide-react";
import { useFaculty } from "@/context/facultyContext";
import { useRouter } from "next/navigation";

const EnhancedStudentDashboard = () => {
  const { requestCount } = useFaculty();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("students");

  // Students Data
  const studentsData = [
    {
      _id: "1",
      name: "Arjun Patel",
      phone: "9012345678",
      rollno: "2347",
      course: "ADEA",
      courseDuration: "4 months",
      batch: "12:00-1:30",
      days: "Weekend",
      status: "active",
      monthlyFee: 1527,
      admissionDate: "2024-01-05",
    },
    {
      _id: "2",
      name: "Priya Verma",
      phone: "9876543210",
      rollno: "2258",
      course: "BPO",
      courseDuration: "6 months",
      batch: "3:30-5:00",
      days: "MWF",
      status: "active",
      monthlyFee: 1449,
      admissionDate: "2024-01-10",
    },
    {
      _id: "3",
      name: "Raj Kumar",
      phone: "9123456789",
      rollno: "2156",
      course: "ADEA",
      courseDuration: "4 months",
      batch: "6:00-7:30",
      days: "TTS",
      status: "dropout",
      monthlyFee: 1527,
      admissionDate: "2023-12-15",
    },
    {
      _id: "4",
      name: "Sneha Singh",
      phone: "9234567890",
      rollno: "2245",
      course: "BPO",
      courseDuration: "6 months",
      batch: "10:00-11:30",
      days: "Weekend",
      status: "active",
      monthlyFee: 1449,
      admissionDate: "2024-02-01",
    },
  ];

  // Activities Data
  const activitiesData = [
    {
      _id: "a1",
      title: "Web Development Seminar",
      topic: "React & Next.js Fundamentals",
      description:
        "Learn the basics of modern web development with React and Next.js frameworks",
      activityType: "seminar",
      date: "2026-03-15",
      month: "Mar-2026",
      scoreWeight: 5,
    },
    {
      _id: "a2",
      title: "Advanced Excel Workshop",
      topic: "Data Analysis & Visualization",
      description:
        "Master Excel for business analytics and data-driven decision making",
      activityType: "workshop",
      date: "2026-03-18",
      month: "Mar-2026",
      scoreWeight: 8,
    },
    {
      _id: "a3",
      title: "Extra Class - Python Basics",
      topic: "Introduction to Python Programming",
      description: "Fundamental concepts of Python programming language",
      activityType: "extra_class",
      date: "2026-03-10",
      month: "Mar-2026",
      scoreWeight: 3,
    },
    {
      _id: "a4",
      title: "Startup Pitch Competition",
      topic: "Entrepreneurship Challenge",
      description: "Pitch your startup ideas and compete for prizes",
      activityType: "competition",
      date: "2026-03-25",
      month: "Mar-2026",
      scoreWeight: 10,
    },
    {
      _id: "a5",
      title: "Project Guidance Session",
      topic: "Real-world Application Development",
      description: "Get expert guidance on your ongoing projects",
      activityType: "project_guidance",
      date: "2026-03-12",
      month: "Mar-2026",
      scoreWeight: 6,
    },
  ];

  // Fees Data
  const feesData = [
    {
      _id: "f1",
      studentName: "Arjun Patel",
      studentId: "1",
      amount: 1527,
      month: 3,
      year: 2026,
      dueDate: "2026-03-15",
      paid: true,
      paidAt: "2026-03-10",
    },
    {
      _id: "f2",
      studentName: "Priya Verma",
      studentId: "2",
      amount: 1449,
      month: 3,
      year: 2026,
      dueDate: "2026-03-15",
      paid: false,
      paidAt: null,
    },
    {
      _id: "f3",
      studentName: "Sneha Singh",
      studentId: "4",
      amount: 1449,
      month: 3,
      year: 2026,
      dueDate: "2026-03-15",
      paid: true,
      paidAt: "2026-03-12",
    },
    {
      _id: "f4",
      studentName: "Arjun Patel",
      studentId: "1",
      amount: 1527,
      month: 2,
      year: 2026,
      dueDate: "2026-02-15",
      paid: true,
      paidAt: "2026-02-10",
    },
    {
      _id: "f5",
      studentName: "Priya Verma",
      studentId: "2",
      amount: 1449,
      month: 2,
      year: 2026,
      dueDate: "2026-02-15",
      paid: true,
      paidAt: "2026-02-14",
    },
  ];

  // Filter students
  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollno.includes(searchTerm) ||
      student.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalStudents = studentsData.length;
  const activeStudents = studentsData.filter(
    (s) => s.status === "active",
  ).length;
  const totalRevenue = studentsData
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.monthlyFee, 0);
  const totalActivities = activitiesData.length;
  const totalFeeAmount = feesData.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = feesData.filter((f) => f.paid).length;

  const getActivityTypeColor = (type) => {
    const colors = {
      seminar: "from-blue-500 to-blue-600",
      workshop: "from-purple-500 to-purple-600",
      extra_class: "from-emerald-500 to-emerald-600",
      project_guidance: "from-orange-500 to-orange-600",
      competition: "from-pink-500 to-pink-600",
      research: "from-indigo-500 to-indigo-600",
      other: "from-gray-500 to-gray-600",
    };
    return colors[type] || colors.other;
  };

  const getActivityTypeLabel = (type) => {
    const labels = {
      seminar: "Seminar",
      workshop: "Workshop",
      extra_class: "Extra Class",
      project_guidance: "Guidance",
      competition: "Competition",
      research: "Research",
      other: "Other",
    };
    return labels[type] || "Activity";
  };

  const getActivityIcon = (type) => {
    const icons = {
      seminar: <Briefcase className="w-5 h-5" />,
      workshop: <Award className="w-5 h-5" />,
      extra_class: <BookOpen className="w-5 h-5" />,
      project_guidance: <Zap className="w-5 h-5" />,
      competition: <TrendingUp className="w-5 h-5" />,
      research: <MapPin className="w-5 h-5" />,
      other: <AlertCircle className="w-5 h-5" />,
    };
    return icons[type] || icons.other;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getMonthYear = (month, year) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[month - 1]} ${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">
              Dashboard
            </p>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Overview & Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage students, activities, and track fee payments
              </p>
            </div>

            {/* Transfer Requests button */}
            <button
              onClick={() => router.push("/dashboard/request")}
              className="relative shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-200 whitespace-nowrap"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Transfer Requests</span>
              <span className="sm:hidden">Requests</span>

              {/* ✅ only show badge if there are pending requests */}
              {requestCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {requestCount > 9 ? "9+" : requestCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {[
            {
              label: "Total Students",
              value: totalStudents,
              icon: Users,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              label: "Active Students",
              value: activeStudents,
              icon: CheckCircle2,
              color: "from-emerald-500 to-emerald-600",
              bgColor: "bg-emerald-50",
            },
            {
              label: "Activities",
              value: totalActivities,
              icon: Zap,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
            },
            {
              label: "Pending Fees",
              value: feesData.filter((f) => !f.paid).length,
              icon: AlertCircle,
              color: "from-red-500 to-red-600",
              bgColor: "bg-red-50",
            },
            {
              label: "Revenue",
              value: `₹${totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "from-cyan-500 to-cyan-600",
              bgColor: "bg-cyan-50",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                style={{
                  animation: `slideIn 0.6s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        {/* <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: "students", label: "Students", icon: Users },
            { id: "activities", label: "Activities", icon: Zap },
            { id: "fees", label: "Fees", icon: IndianRupee },
            { id: "Request", label: "Request", icon: PlusCircleIcon  },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white/80 border border-gray-200 text-gray-900 hover:border-blue-300"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {tab.label}
              </button>
            );
          })}
        </div> */}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, roll number, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-base"
                  />
                </div>
                <div className="relative flex items-center">
                  <Filter className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-base appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="dropout">Dropout</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, idx) => (
                <div
                  key={student._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group"
                  style={{
                    animation: `slideUp 0.6s ease-out ${idx * 0.08}s both`,
                  }}
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                          {student.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Roll No. {student.rollno}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ml-2 flex-shrink-0 ${getStatusColor(
                          student.status,
                        )}`}
                      >
                        {student.status === "active" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-900">
                          {student.course}
                        </span>{" "}
                        • {student.courseDuration}
                      </p>
                      <p>
                        📅 {student.batch} ({student.days})
                      </p>
                      <p>💰 ₹{student.monthlyFee.toLocaleString()}/month</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activitiesData.map((activity, idx) => (
                <div
                  key={activity._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  style={{
                    animation: `slideUp 0.6s ease-out ${idx * 0.08}s both`,
                  }}
                >
                  <div
                    className={`h-1 bg-gradient-to-r ${getActivityTypeColor(activity.activityType)}`}
                  ></div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getActivityTypeColor(activity.activityType)} flex items-center justify-center text-white`}
                      >
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {activity.scoreWeight} pts
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 break-words">
                      {activity.title}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      {getActivityTypeLabel(activity.activityType)}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {activity.topic}
                    </p>
                    {activity.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(activity.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.month}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            {/* Fees Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Fees
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{totalFeeAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 shadow-lg p-6">
                <p className="text-emerald-600 text-sm font-medium mb-2">
                  Paid Fees
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700">
                  {paidFees}/{feesData.length}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200 shadow-lg p-6">
                <p className="text-red-600 text-sm font-medium mb-2">
                  Pending Fees
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-red-700">
                  ₹
                  {feesData
                    .filter((f) => !f.paid)
                    .reduce((sum, f) => sum + f.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Student
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                        Month/Year
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesData.map((fee) => (
                      <tr
                        key={fee._id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                          {fee.studentName}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                          {getMonthYear(fee.month, fee.year)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                          ₹{fee.amount.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              fee.paid
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {fee.paid ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5" />
                            )}
                            {fee.paid ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                          {fee.paid && fee.paidAt
                            ? formatDate(fee.paidAt)
                            : formatDate(fee.dueDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedStudentDashboard;
