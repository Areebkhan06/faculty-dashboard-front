"use client";
import { useFaculty } from "@/context/facultyContext";
import { batchOptions, daysOptions } from "@/data";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";

const inputClass =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";
const selectClass =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer appearance-none";
const labelClass =
  "block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide";
const cardClass =
  "bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm";

const SelectField = React.memo(
  ({ label, name, value, onChange, options, required }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={selectClass}
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  ),
);
SelectField.displayName = "SelectField";

const INITIAL_FORM = {
  facultyName: "",
  studentData: "",
  transferTo: "",
  batchTiming: "",
  days: "",
  note: "",
};

const page = () => {
  const { slug } = useParams();
  const { getToken } = useAuth();
  const router = useRouter();
  const { BackendURL } = useFaculty();

  const [student, setStudent] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  // ── Fetch student + fee details ──────────────────────────────────────
  useEffect(() => {
    if (!slug || !BackendURL) return;

    const fetchStudent = async () => {
      setLoadingStudent(true);
      try {
        const res = await fetch(`${BackendURL}/api/fees-student-details`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: slug }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (data.success && data.data) {
          setStudent(data.data);
          setForm((prev) => ({
            ...prev,
            facultyName: data.data?.facultyId?.name ?? "",
            studentData: data.data?.studentId?.name ?? "",
          }));
        } else {
          setError(data.message || "Failed to load student data.");
        }
      } catch (err) {
        console.error("fetchStudent error:", err);
        setError("Could not load student details. Please try again.");
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchStudent();
  }, [slug, BackendURL]);

  // ── Fetch faculties for dropdown ─────────────────────────────────────
  useEffect(() => {
    if (!BackendURL) return;
    let cancelled = false;

    const fetchFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No auth token");

        const res = await fetch(`${BackendURL}/api/fetch-faculty`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!cancelled && data?.success) {
          setFaculties(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error("fetchFaculties error:", err);
        if (!cancelled) setFaculties([]);
      } finally {
        if (!cancelled) setLoadingFaculties(false);
      }
    };

    fetchFaculties();
    return () => {
      cancelled = true;
    };
  }, [BackendURL, getToken]);

  // ── Memoised faculty list excluding current faculty ──────────────────
  const filteredFaculties = useMemo(() => {
    if (!student?.facultyId?._id) return faculties;
    return faculties.filter((f) => f._id !== student.facultyId._id); // exclude self
  }, [faculties, student]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      // Basic validation
      if (!form.transferTo)
        return setError("Please select a faculty to transfer to.");
      if (!form.batchTiming) return setError("Please select a batch timing.");
      if (!form.days) return setError("Please select days.");
      if (!student?.studentId?._id)
        return setError("Student data not loaded yet. Please wait.");

      setSubmitting(true);
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No auth token");

        const res = await fetch(`${BackendURL}/api/transfer-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feeId:slug,
            studentId: student?.studentId?._id,
            studentName: form.studentData,
            fromFaculty: student?.facultyId?._id, // ✅ who is sending
            toFaculty: form.transferTo,
            batchTiming: form.batchTiming,
            days: form.days,
            note: form.note.trim(),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.success) {
          setSubmitted(true);
        } else {
          setError(data.message || "Submission failed. Please try again.");
        }
      } catch (err) {
        console.error("handleSubmit error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [form, student, BackendURL, getToken],
  );

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-gray-800 text-xl font-bold">
            Transfer Request Sent!
          </h2>
          <p className="text-gray-400 text-sm">
            Waiting for the faculty to accept.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────
  if (loadingStudent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-6 h-6 animate-spin text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-gray-400 text-sm">Loading student details...</p>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mb-6 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Student Transfer
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Transfer Details
          </h1>
          <p className="mt-1 text-gray-400 text-sm">
            Fee ID: <span className="font-mono text-gray-600">{slug}</span>
          </p>
        </div>

        {/* Global error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Faculty Info — read only, auto-filled */}
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Faculty Info
            </p>
            <div>
              <label className={labelClass}>Faculty Name</label>
              <input
                type="text"
                name="facultyName"
                value={form.facultyName}
                readOnly
                className={
                  inputClass + " bg-gray-50 cursor-not-allowed text-gray-400"
                }
              />
            </div>
          </div>

          {/* Student Info — read only, auto-filled */}
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500">
              Student Info
            </p>
            <div>
              <label className={labelClass}>Student Name</label>
              <input
                type="text"
                name="studentData"
                value={form.studentData}
                readOnly
                className={
                  inputClass + " bg-gray-50 cursor-not-allowed text-gray-400"
                }
              />
            </div>
          </div>

          {/* Transfer Info */}
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-500">
              Transfer Info
            </p>
            <div>
              <label className={labelClass}>Transfer To (Faculty)</label>
              <div className="relative">
                <select
                  name="transferTo"
                  value={form.transferTo}
                  onChange={handleChange}
                  required
                  disabled={loadingFaculties}
                  className={
                    selectClass +
                    (loadingFaculties ? " opacity-50 cursor-not-allowed" : "")
                  }
                >
                  <option value="">
                    {loadingFaculties
                      ? "Loading faculties..."
                      : "Select Faculty"}
                  </option>
                  {filteredFaculties.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f?.name ?? "Unknown"}
                      {f?.department ? ` — ${f.department}` : ""}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Schedule
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Batch Timing"
                name="batchTiming"
                value={form.batchTiming}
                onChange={handleChange}
                options={batchOptions}
                required
              />
              <SelectField
                label="Days"
                name="days"
                value={form.days}
                onChange={handleChange}
                options={daysOptions}
                required
              />
            </div>
          </div>

          {/* Note */}
          <div className={cardClass}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Note (Optional)
            </p>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Reason for transfer..."
              className={inputClass + " resize-none"}
            />
            <p className="text-right text-[10px] text-gray-300">
              {form.note.length}/500
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || loadingStudent || loadingFaculties}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-indigo-200"
          >
            {submitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Submit Transfer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
