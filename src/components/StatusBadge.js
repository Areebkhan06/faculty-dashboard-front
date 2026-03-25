import { useFaculty } from "@/context/facultyContext";
import { useAuth } from "@clerk/nextjs";
import React from "react";

const StatusBadge = ({ status, id }) => {
  const { getToken } = useAuth();
  const { fetchAllStudents, BackendURL } = useFaculty();

  const handleChangeStatus = async (id, status) => {
    // ✅ Don't allow changing completed status
    if (status === "completed") return;

    const newStatus = status === "active" ? "dropout" : "active";

    const confirmChange = window.confirm(
      `Are you sure you want to change status to ${newStatus}?`,
    );

    if (!confirmChange) return;

    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/change-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) fetchAllStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const getStyle = () => {
    if (status === "active")    return "bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-pointer";
    if (status === "dropout")   return "bg-rose-100 text-rose-700 border border-rose-300 cursor-pointer";
    if (status === "completed") return "bg-blue-100 text-blue-700 border border-blue-300 cursor-default"; // ✅ not clickable
    return "bg-gray-100 text-gray-600 border border-gray-300 cursor-default";
  };

  const getLabel = () => {
    if (status === "active")    return "🟢 Active";
    if (status === "dropout")   return "⭕ Dropout";
    if (status === "completed") return "✅ Completed";
    return status;
  };

  return (
    <span
      onClick={() => handleChangeStatus(id, status)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStyle()}`}
    >
      {getLabel()}
    </span>
  );
};

export default StatusBadge;