import React from "react";

const MetricCard = ({ label, value, icon }) => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:shadow-lg hover:border-blue-300/60 transition-all group">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
          {label}
        </span>
        <div className="text-slate-600 group-hover:text-blue-600 transition">
          {icon}
        </div>
      </div>
      <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
        {value}
      </span>
    </div>
  );
};

export default MetricCard;
