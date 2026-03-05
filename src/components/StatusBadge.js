import React from 'react'

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
        status === "active"
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-rose-100 text-rose-700 border border-rose-300"
      }`}
    >
      {status === "active" ? "🟢 Active" : "⭕ Dropout"}
    </span>
  )
}

export default StatusBadge
