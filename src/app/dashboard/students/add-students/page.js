"use client";

import React, { useState } from "react";
import { Upload, UserPlus, FileSpreadsheet } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import DropDownList from "@/components/DropDownList";
import InputField from "@/components/InputFeilds";

const batchOptions = [
  { label: "7:30 AM – 9:00 AM", value: "7:30-9:00" },
  { label: "9:00 AM – 10:30 AM", value: "9:00-10:30" },
  { label: "10:30 AM – 12:30 PM", value: "10:30-12:30" },
  { label: "12:30 PM – 1:30 PM", value: "12:30-1:30" },
  { label: "2:00 PM – 3:30 PM", value: "2:00-3:30" },
  { label: "3:30 PM – 5:00 PM", value: "3:30-5:00" },
  { label: "5:00 PM – 6:30 PM", value: "5:00-6:30" },
];

const daysOptions = [
  { label: "Monday, Wednesday, Friday (MWF)", value: "MWF" },
  { label: "Tuesday, Thursday, Saturday (TTS)", value: "TTS" },
  { label: "Daily (Mon-Sat)", value: "Daily" },
  { label: "Weekend (Sat-Sun)", value: "Weekend" },
];

const courseOptions = [
  "English Speaking Course",
  "DCAP",
  "ADCE",
  "AI&ML",
  "MDCE",
  "PDSHE",
  "SOFTWARE&HARDWARE",
  "PDSEA",
  "DCHN",
  "ADCHN",
  "E-ACCOUNTING",
  "TALLY PRIME",
  "PDEA",
  "ADEA",
  "ANIMATION",
  "ADVANCE ANIMATION",
  "MASTERS IN ANIMATION",
  "DIPLOMA IN WEBSITE ENGINEERING",
  "ADVANCE DIPLOMA IN WEBSITE ENGINEERING",
  "DM",
  "CYBER SECURITY & ETHICAL HACKING",
  "DATA SCIENCE",
  "CHATGPT",
  "MOBILE APPLICATION DEVELOPMENT",
  "CLOUD COMPUTING",
  "BPO",
].map((course) => ({ label: course, value: course }));

export default function AddStudentsPage() {
  const [method, setMethod] = useState("individual");
  const [isLoading, setisLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isSignedIn, isLoaded, getToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    rollno: "",
    course: "",
    courseDuration: "",
    fee: "",
    admissionDate: "",
    batch: "",
    days: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleExcelUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const token = await getToken({ template: "default" });

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:3014/api/upload-students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      alert(`${data.message} (Imported: ${data.insertedCount})`);

      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();

    // Frontend validation
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) newErrors[key] = "This field is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Get Clerk token for backend authentication
      const token = await getToken({ template: "default" }); // or your JWT template

      const res = await fetch("http://localhost:3014/api/individual-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token to backend
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Student added successfully!");
        // Reset form
        setForm({
          name: "",
          phone: "",
          rollno: "",
          course: "",
          courseDuration: "",
          fee: "",
          admissionDate: "",
          batch: "",
          days: "",
        });
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error! Please try again.");
    } finally {
      setisLoading(false);
    }
  };
  console.log(form);

  if (!isLoaded) return null;
  if (!isSignedIn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-700">
          You must be logged in to add students.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Add Students
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Choose how you want to add students to the system.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
          <button
            onClick={() => setMethod("individual")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              method === "individual"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <UserPlus size={16} /> Add Individually
          </button>
          <button
            onClick={() => setMethod("excel")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              method === "excel"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet size={16} /> Upload Excel
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {method === "individual" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <InputField
                label="Student Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <InputField
                label="Roll no"
                name="rollno"
                type="number"
                value={form.rollno}
                onChange={handleChange}
                error={errors.rollno}
              />

              {/* Course Dropdown */}
              <DropDownList
                label="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
                error={errors.course}
                options={courseOptions}
              />

              <InputField
                label="Course Duration"
                name="courseDuration"
                value={form.courseDuration}
                onChange={handleChange}
                error={errors.courseDuration}
                placeholder="Enter duration (e.g., 3 months)"
              />

              <InputField
                label="Monthly Fee"
                name="fee"
                type="number"
                value={form.fee}
                onChange={handleChange}
                error={errors.fee}
              />
              <InputField
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={form.admissionDate}
                onChange={handleChange}
                error={errors.admissionDate}
              />

              <DropDownList
                label="Batch Timing"
                name="batch"
                value={form.batch}
                onChange={handleChange}
                error={errors.batch}
                options={batchOptions}
              />
              <DropDownList
                label="Class Days"
                name="days"
                value={form.days}
                onChange={handleChange}
                error={errors.days}
                options={daysOptions}
              />

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Student"}
                </button>
              </div>
            </form>
          )}

          {method === "excel" && (
            <div className="space-y-6 text-center">
              <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 hover:border-blue-500 transition cursor-pointer block">
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <Upload className="mx-auto text-slate-400 mb-4" size={40} />

                <p className="text-sm font-medium text-slate-700">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select Excel file"}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Supported format: .xlsx
                </p>
              </label>

              {/* Upload Button */}
              <button
                onClick={handleExcelUpload}
                disabled={!selectedFile || loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload & Import"}
              </button>

              {/* ✅ Download Template Button */}
              <a
                href="/Student_Demo_Data.xlsx"
                download
                className="block text-sm text-green-600 font-medium hover:underline"
              >
                Download Excel Format
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
