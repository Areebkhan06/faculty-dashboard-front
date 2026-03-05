import { TrendingUp } from "lucide-react";
import React from "react";

const StatCard = ({ title, value, icon, trend, color, borderColor }) => {
  return (
    <div
      className={`relative rounded-lg border ${borderColor} shadow-sm overflow-hidden group hover:shadow-md transition p-5 bg-linear-to-br ${color}`}
    >
      <div className="relative space-y-3">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/60 rounded-lg group-hover:bg-white/80 transition">
            {icon}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp size={14} />
            {trend}
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {value}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
