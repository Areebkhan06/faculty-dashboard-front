"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreVertical,
  X,
  Check,
  Loader,
  Menu,
  ArrowRight,
  ArrowRightLeft,
} from "lucide-react";
import { useFaculty } from "@/context/facultyContext";
import { useRouter } from "next/navigation";

const FeeManagement = () => {
  const { getToken } = useAuth();
  const { BackendURL } = useFaculty();
  const router = useRouter();

  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [monthHistory, setMonthHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
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

  // Initialize current month/year and generate history
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    setCurrentMonth(month);
    setCurrentYear(year);

    // Generate last 12 months history
    const history = [];
    for (let i = 0; i < 12; i++) {
      let m = month - i;
      let y = year;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      history.push({ month: m, year: y });
    }
    setMonthHistory(history);

    // Fetch fees for current month
    fetchFees(month, year);
  }, []);

  // Fetch fees from API
  const fetchFees = async (month, year) => {
    try {
      setLoading(true);

      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/get-fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month, year }),
      });

      const data = await res.json();

      if (data.success) {
        setFees(data.allfees || []);

        const months = new Map();

        data.allfees.forEach((fee) => {
          const key = `${fee.month}-${fee.year}`;

          if (!months.has(key)) {
            months.set(key, {
              month: fee.month,
              year: fee.year,
            });
          }
        });

        const sortedMonths = Array.from(months.values()).sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });

        setAvailableMonths(sortedMonths);

        if (sortedMonths.length > 0) {
          const firstMonth = sortedMonths[0];

          setCurrentMonth(firstMonth.month);
          setCurrentYear(firstMonth.year);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month, year) => {
    fetchFees(month, year);
  };

  const handlePreviousMonth = () => {
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth <= 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    handleMonthChange(prevMonth, prevYear);
  };

  const handleNextMonth = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    handleMonthChange(nextMonth, nextYear);
  };

  const handleMarkAsPaid = async () => {
    if (!paymentModal || !paymentDate) {
      alert("Please select a payment date");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/mark-fee-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feeId: paymentModal._id,
          paidAt: paymentDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFees((prevFees) =>
          prevFees.map((fee) =>
            fee._id === paymentModal._id
              ? {
                  ...fee,
                  status: data.data.status, // ✅ use backend status
                  paidAt: new Date(),
                }
              : fee,
          ),
        );

        setPaymentModal(null);
        setPaymentDate("");
      }
    } catch (error) {
      console.error(error);
      alert("Error marking fee as paid");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter fees based on search and status
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentId?.rollno?.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" &&
        (fee.status === "paid_on_time" || fee.status === "paid_late")) ||
      (filterStatus === "unpaid" && fee.status === "unpaid") ||
      (filterStatus === "not_paid_on_time" &&
        fee.status === "not_paid_on_time");

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = fees
    .filter(
      (fee) => fee.status === "paid_on_time" || fee.status === "paid_late",
    )
    .reduce((sum, fee) => sum + fee.amount, 0);

  const pendingAmount = totalAmount - paidAmount;
  const pendingCount = fees.filter(
    (fee) => fee.status === "unpaid" || fee.status === "not_paid_on_time",
  ).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const getStatusColor = (status) => {
    if (status === "paid_on_time") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }

    if (status === "paid_late") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "not_paid_on_time") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (status === "transfer_request_sent") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const getStatusLabel = (status) => {
    if (status === "paid_on_time") return "Paid On Time";
    if (status === "paid_late") return "Paid Late";
    if (status === "not_paid_on_time") return "Not Paid On Time";
    if (status === "transfer_request_sent") return "Transfer Sended";
    return "Unpaid";
  };

  const getStatusIcon = (status) => {
    if (status === "paid_on_time") {
      return <CheckCircle2 className="w-4 h-4" />;
    }

    if (status === "paid_late") {
      return <Clock className="w-4 h-4" />;
    }

    if (status === "not_paid_on_time") {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (status === "transfer_request_sent") {
      return <CheckCircle2 className="w-4 h-4" />;
    }

    return <Clock className="w-4 h-4" />;
  };

  const canGoPrevious =
    availableMonths.findIndex(
      (m) => m.month === currentMonth && m.year === currentYear,
    ) <
    availableMonths.length - 1;

  const canGoNext =
    availableMonths.findIndex(
      (m) => m.month === currentMonth && m.year === currentYear,
    ) > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 p-2 sm:p-4 lg:p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-100/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 bg-indigo-100/30 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Fee Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
            Track and manage student fee payments
          </p>
        </div>

        {/* MONTH NAVIGATION */}
        {availableMonths.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 shadow-lg p-2.5 sm:p-4 md:p-6">
            {/* Month Display and Navigation */}
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
              {/* Top Row: Label and Current Month */}
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900">
                  Month
                </h2>
                <span className="text-base sm:text-lg md:text-2xl font-bold text-blue-600">
                  {monthsShort[currentMonth - 1]} {currentYear}
                </span>
              </div>

              {/* Mobile: Dropdown Button */}
              <div className="md:hidden relative z-50">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-xs sm:text-sm font-medium hover:border-blue-400 transition-colors"
                >
                  <span>Select Month</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showMonthDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showMonthDropdown && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-48 overflow-y-auto">
                    {availableMonths.map((item, idx) => {
                      const isActive =
                        item.month === currentMonth &&
                        item.year === currentYear;
                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            handleMonthChange(item.month, item.year)
                          }
                          className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {monthsShort[item.month - 1]} {item.year}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tablet and Up: Navigation Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handlePreviousMonth}
                  disabled={!canGoPrevious}
                  className={`flex items-center gap-1 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-semibold text-xs md:text-sm whitespace-nowrap ${
                    canGoPrevious
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Previous
                </button>

                <button
                  onClick={handleNextMonth}
                  disabled={!canGoNext}
                  className={`flex items-center gap-1 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-semibold text-xs md:text-sm whitespace-nowrap ${
                    canGoNext
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Desktop: Month Pills */}
              <div className="hidden lg:block overflow-x-auto pb-1">
                <div className="flex gap-2 min-w-max">
                  {availableMonths.map((item, idx) => {
                    const isActive =
                      item.month === currentMonth && item.year === currentYear;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMonthChange(item.month, item.year)}
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap font-semibold text-xs md:text-sm transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white border border-gray-200 text-gray-900 hover:border-blue-300"
                        }`}
                      >
                        {monthsShort[item.month - 1]} {item.year}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* Total Fees */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
              <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <DollarSign className="text-blue-600 w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">
                Total
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-3xl font-bold text-gray-900 line-clamp-1 leading-tight">
              ₹{(totalAmount / 1000).toFixed(0)}k
            </p>
          </div>

          {/* Paid */}
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
              <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-emerald-600 w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">
                Paid
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-3xl font-bold text-emerald-700 line-clamp-1 leading-tight">
              ₹{(paidAmount / 1000).toFixed(0)}k
            </p>
          </div>

          {/* Pending Amount */}
          <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
              <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="text-red-600 w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">
                Pending
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-3xl font-bold text-red-700 line-clamp-1 leading-tight">
              ₹{(pendingAmount / 1000).toFixed(0)}k
            </p>
          </div>

          {/* Pending Count */}
          <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
              <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="text-amber-600 w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">
                Count
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-3xl font-bold text-amber-700 leading-tight">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 shadow-lg p-2.5 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Search */}
            <div className="md:col-span-2 flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none flex-1 bg-transparent text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer font-medium text-xs sm:text-sm md:text-base"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden space-y-2 sm:space-y-3">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader className="animate-spin text-blue-600 w-6 h-6" />
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                No fees found
              </p>
            </div>
          ) : (
            filteredFees.map((fee) => (
              <div
                key={fee._id}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 space-y-2.5 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                      {fee.studentId?.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {fee.studentId?.rollno}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full border flex items-center gap-1 whitespace-nowrap font-semibold shrink-0 ${getStatusColor(
                      fee.status,
                    )}`}
                  >
                    {getStatusIcon(fee.status)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-bold text-gray-900">
                      ₹{fee.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Course</p>
                    <p className="text-gray-900">{fee.studentId?.course}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Due Date</p>
                    <p className="text-gray-900">{formatDate(fee.dueDate)}</p>
                  </div>
                </div>

                {/* Action Button */}
                {fee.status === "unpaid" ||
                fee.status === "not_paid_on_time" ? (
                  <button
                    onClick={() => {
                      setPaymentModal(fee);
                      setPaymentDate("");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Paid
                  </button>
                ) : (
                  <div className="text-center text-[10px] sm:text-xs text-gray-500 font-medium">
                    ✓ Completed
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900">
                  Student
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900 hidden lg:table-cell">
                  Roll No
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900 hidden xl:table-cell">
                  Course
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900">
                  Amount
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900 hidden lg:table-cell">
                  Due Date
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900">
                  Status
                </th>
                <th className="p-2 md:p-4 text-left font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 md:p-8">
                    <Loader className="animate-spin mx-auto text-blue-600 w-6 h-6" />
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-6 md:p-8 text-gray-500 font-medium text-xs sm:text-sm"
                  >
                    No fee records found
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-2 md:p-4 font-semibold text-gray-900 truncate text-xs md:text-sm">
                      {fee.studentId?.name}
                    </td>

                    <td className="p-2 md:p-4 text-gray-600 hidden lg:table-cell text-xs md:text-sm">
                      {fee.studentId?.rollno}
                    </td>

                    <td className="p-2 md:p-4 text-gray-600 hidden xl:table-cell text-xs md:text-sm">
                      {fee.studentId?.course}
                    </td>

                    <td className="p-2 md:p-4 font-bold text-gray-900 text-xs md:text-sm">
                      ₹{fee.amount.toLocaleString()}
                    </td>

                    <td className="p-2 md:p-4 text-gray-600 hidden lg:table-cell text-xs md:text-sm">
                      {formatDate(fee.dueDate)}
                    </td>

                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs rounded-full border flex items-center gap-1 w-fit font-semibold ${getStatusColor(
                          fee.status,
                        )}`}
                      >
                        {getStatusIcon(fee.status)}
                        <span className="hidden md:inline">
                          {getStatusLabel(fee.status)}
                        </span>
                      </span>
                    </td>

                    <td className="p-2 md:p-4">
                      {fee.status === "unpaid" ||
                      fee.status === "not_paid_on_time" ? (
                        // State 1: Unpaid — Mark Paid button
                        <button
                          onClick={() => {
                            setPaymentModal(fee);
                            setPaymentDate("");
                          }}
                          className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-[10px] md:text-xs font-semibold whitespace-nowrap"
                        >
                          <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden lg:inline">Mark Paid</span>
                          <span className="lg:hidden">Pay</span>
                        </button>
                      ) : fee.transferStatus === "pending" ? (
                        // State 2: Transfer pending — not clickable
                        <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] md:text-xs font-semibold whitespace-nowrap cursor-default">
                          <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden lg:inline">
                            Transfer Pending
                          </span>
                          <span className="lg:hidden">Pending</span>
                        </span>
                      ) : fee.transferStatus === "approved" ? (
                        // State 3: Transfer approved
                        <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-lg text-[10px] md:text-xs font-semibold whitespace-nowrap cursor-default">
                          <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden lg:inline">
                            Transfer Approved
                          </span>
                          <span className="lg:hidden">Approved</span>
                        </span>
                      ) : fee.transferStatus === "declined" ? (
                        // State 4: Transfer declined — allow retry
                        <span
                          onClick={() =>
                            router.push(`/dashboard/fees/${fee._id}`)
                          }
                          className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 cursor-pointer transition-colors text-[10px] md:text-xs font-semibold whitespace-nowrap"
                        >
                          <ArrowRightLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden lg:inline">
                            Retry Transfer
                          </span>
                          <span className="lg:hidden">Retry</span>
                        </span>
                      ) : (
                        // State 5: Paid, no transfer — Transfer button
                        <span
                          onClick={() =>
                            router.push(`/dashboard/fees/${fee._id}`)
                          }
                          className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 cursor-pointer transition-colors text-[10px] md:text-xs font-semibold whitespace-nowrap"
                        >
                          <ArrowRightLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          Transfer
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-3 sm:p-6 md:p-8 animate-slideIn max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                Mark as Paid
              </h2>
              <button
                onClick={() => {
                  setPaymentModal(null);
                  setPaymentDate("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Fee Details */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-6 space-y-2 sm:space-y-3 border border-gray-200">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <p className="text-gray-600">Student</p>
                <p className="font-semibold text-gray-900 truncate ml-2">
                  {paymentModal.studentId?.name}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <p className="text-gray-600">Roll No</p>
                <p className="font-semibold text-gray-900">
                  {paymentModal.studentId?.rollno}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-xs sm:text-sm">Amount</p>
                <p className="font-bold text-sm sm:text-lg md:text-xl text-blue-600">
                  ₹{paymentModal.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <p className="text-gray-600">Month</p>
                <p className="font-semibold text-gray-900">
                  {monthsShort[paymentModal.month - 1]} {paymentModal.year}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <p className="text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(paymentModal.dueDate)}
                </p>
              </div>
            </div>

            {/* Payment Date Input */}
            <div className="mb-3 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                max={today}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs sm:text-sm md:text-base"
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                Select when payment was received
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setPaymentModal(null);
                  setPaymentDate("");
                }}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={isSubmitting || !paymentDate}
                className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
