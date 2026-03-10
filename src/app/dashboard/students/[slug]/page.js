"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Phone,
  BookOpen,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  User,
  IndianRupee,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Loading from "@/components/Loading";
import { useFaculty } from "@/context/facultyContext";

const Page = () => {
  const {BackendURL} = useFaculty();
  const { slug } = useParams();
  const { getToken } = useAuth();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const res = await fetch(`${BackendURL}/api/student-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: slug }),
        });

        const data = await res.json();

        if (data.success) {
          setStudentData(data.student);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStudent();
  }, [slug, getToken]);

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status color
  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  if (loading || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-100/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-72 sm:w-80 h-72 sm:h-80 bg-indigo-100/30 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">
              Student Information
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 break-words">
            {studentData.name}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
            Roll No:{" "}
            <span className="font-semibold text-gray-900">{studentData.rollno}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Card - Left Side (takes 2 columns on desktop) */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-6 sm:mb-8">
              {/* Top gradient bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Profile Header with Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <User className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                        {studentData.name}
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1">
                        {studentData.course} • Roll No. {studentData.rollno}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(
                            studentData.status,
                          )}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">
                            {studentData.status.charAt(0).toUpperCase() +
                              studentData.status.slice(1)}
                          </span>
                          <span className="sm:hidden">
                            {studentData.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                      Contact Information
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                          {formatPhone(studentData.phone)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admission Information */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                      Admission Details
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Admission Date</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatDate(studentData.admissionDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

              <div className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
                  Course Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Course */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Course Name</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                        {studentData.course}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {studentData.courseDuration}
                      </p>
                    </div>
                  </div>

                  {/* Class Days */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Class Days</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {studentData.days}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Batch Time */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Batch Time</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {studentData.batch}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Fee Card and Additional Info */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            {/* Fee Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl border border-blue-200 shadow-xl overflow-hidden sticky top-6">
              <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Monthly Fee
                    </h3>
                    <p className="text-gray-600 text-xs">Tuition & Course</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-900">
                    ₹{studentData.monthlyFee?.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-2">/month</p>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                  Record Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Student ID</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 font-mono break-all">
                      {studentData._id}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">
                      {formatDate(studentData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Student profile information last synchronized on{" "}
            <span className="font-semibold text-gray-700">
              {formatDate(studentData.updatedAt)}
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          div:first-child {
            animation: slideDown 0.6s ease-out;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
