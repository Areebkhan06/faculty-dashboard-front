"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function FacultyForm() {
  const { getToken, userId } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) newErrors[key] = "This field is required";
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch("http://localhost:3014/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success || data.message == "Faculty already registered") {
        router.push("/dashboard");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)"
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Form container */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-linear-to-r from-blue-100/40 to-cyan-100/40 rounded-2xl blur-xl -z-10"></div>
        
        <form
          onSubmit={handleSubmit}
          className="relative bg-white p-8 rounded-2xl border border-slate-200/60 shadow-xl"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 p-3 bg-linear-to-br from-blue-600 to-cyan-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Faculty Profile
            </h1>
            <p className="text-slate-500 text-sm tracking-wide">Complete your professional information</p>
          </div>

          {/* Success message */}
          {submitted && (
            <div className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-lg animate-in fade-in duration-300">
              <p className="text-green-700 text-sm font-medium">✓ Profile saved successfully!</p>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-5">
            {/* Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-lg text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none ${
                  errors.name
                    ? "border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane.smith@university.edu"
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-lg text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none ${
                  errors.email
                    ? "border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-lg text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none ${
                  errors.phoneNumber
                    ? "border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              />
              {errors.phoneNumber && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.phoneNumber}</p>}
            </div>

            {/* Department */}
            <div className="group relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 tracking-wide">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-lg text-slate-900 transition-all duration-200 focus:outline-none appearance-none cursor-pointer pr-10 ${
                  errors.department
                    ? "border-red-400/60 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
              >
                <option value="">Select a department</option>
                <option value="Software">Software</option>
                <option value="Accounting">Accounting</option>
                <option value="Multimedia">Multimedia</option>
              </select>
              <svg className="absolute right-3 top-10 w-5 h-5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {errors.department && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.department}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || submitted}
            className={`w-full mt-8 py-3.5 px-6 rounded-lg font-semibold text-base transition-all duration-300 relative group overflow-hidden ${
              loading || submitted
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            <span className="relative z-10">
              {loading ? "Saving Profile..." : submitted ? "Profile Saved" : "Save Profile"}
            </span>
            {!loading && !submitted && (
              <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </button>

          {/* Footer text */}
          <p className="text-center text-slate-400 text-xs mt-6">
            Your information is secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
}