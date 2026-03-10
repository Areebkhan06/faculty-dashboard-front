import { useFaculty } from "@/context/facultyContext";
import { useAuth } from "@clerk/nextjs";
import React from "react";

const StatusBadge = ({ status, id }) => {
  const { getToken } = useAuth();
  const { fetchAllStudents ,BackendURL} = useFaculty();

  const handleChangeStatus = async (id, status) => {
    const newStatus = status === "active" ? "dropout" : "active";

    // confirmation
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
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(data);
        fetchAllStudents(); // refresh list
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <span
      onClick={() => handleChangeStatus(id, status)}
      className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        status === "active"
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-rose-100 text-rose-700 border border-rose-300"
      }`}
    >
      {status === "active" ? "🟢 Active" : "⭕ Dropout"}
    </span>
  );
};

export default StatusBadge;
