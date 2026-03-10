"use client";

import Sidebar from "@/components/Sidebar";
import Loading from "@/components/Loading";
import { useFaculty } from "@/context/facultyContext";

export default function DashboardLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64">{children}</div>
    </div>
  );
}