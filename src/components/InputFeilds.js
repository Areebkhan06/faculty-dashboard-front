
import React from 'react'

const InputFeilds = ({ label, name, type = "text", value, onChange, placeholder, error }) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder || `Enter ${label}`} className={`mt-2 w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-slate-200"}`} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default InputFeilds
