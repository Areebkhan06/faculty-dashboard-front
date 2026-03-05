import React from "react";

const FeatureCard = ({ icon, title, desc, gradient, index }) => {
  return (
    <div
      className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/60 p-6 sm:p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
      ></div>

      <div className="relative">
        <div
          className={`w-12 sm:w-14 h-12 sm:h-14 bg-linear-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
          {title}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
