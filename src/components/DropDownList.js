import React from "react";

const DropDownList = ({ label, name, value, onChange, options, error }) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-2 w-full px-4 py-2.5 border rounded-xl text-sm ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DropDownList;
