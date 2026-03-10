"use client"
import React, { useState } from 'react';
import { Calendar, DollarSign, CheckCircle2, AlertCircle, Search } from 'lucide-react';

const FeeManagement = () => {
  // Static data based on the MongoDB schema
  const staticFees = [
    {
      id: '1',
      student: { id: 's1', name: 'Aarav Sharma', email: 'aarav@school.com' },
      faculty: { id: 'f1', name: 'Dr. Priya Kapoor' },
      amount: 5000,
      month: 1,
      year: 2024,
      dueDate: '2024-01-15',
      paid: true,
      paidAt: '2024-01-14',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      student: { id: 's2', name: 'Divya Patel', email: 'divya@school.com' },
      faculty: { id: 'f2', name: 'Prof. Rajesh Kumar' },
      amount: 5000,
      month: 2,
      year: 2024,
      dueDate: '2024-02-15',
      paid: false,
      paidAt: null,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      student: { id: 's3', name: 'Aarjun Singh', email: 'aarjun@school.com' },
      faculty: { id: 'f1', name: 'Dr. Priya Kapoor' },
      amount: 5000,
      month: 2,
      year: 2024,
      dueDate: '2024-02-15',
      paid: true,
      paidAt: '2024-02-13',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      student: { id: 's4', name: 'Neha Verma', email: 'neha@school.com' },
      faculty: { id: 'f3', name: 'Ms. Anjali Desai' },
      amount: 5000,
      month: 3,
      year: 2024,
      dueDate: '2024-03-15',
      paid: false,
      paidAt: null,
      createdAt: '2024-03-01'
    },
    {
      id: '5',
      student: { id: 's1', name: 'Aarav Sharma', email: 'aarav@school.com' },
      faculty: { id: 'f1', name: 'Dr. Priya Kapoor' },
      amount: 5000,
      month: 3,
      year: 2024,
      dueDate: '2024-03-15',
      paid: true,
      paidAt: '2024-03-15',
      createdAt: '2024-03-01'
    },
    {
      id: '6',
      student: { id: 's2', name: 'Divya Patel', email: 'divya@school.com' },
      faculty: { id: 'f2', name: 'Prof. Rajesh Kumar' },
      amount: 5000,
      month: 1,
      year: 2024,
      dueDate: '2024-01-15',
      paid: true,
      paidAt: '2024-01-12',
      createdAt: '2024-01-01'
    },
    {
      id: '7',
      student: { id: 's5', name: 'Rohan Gupta', email: 'rohan@school.com' },
      faculty: { id: 'f2', name: 'Prof. Rajesh Kumar' },
      amount: 5000,
      month: 3,
      year: 2024,
      dueDate: '2024-03-15',
      paid: false,
      paidAt: null,
      createdAt: '2024-03-01'
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Filter logic
  const filteredFees = staticFees.filter(fee => {
    const matchesSearch = 
      fee.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.faculty.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'paid' && fee.paid) ||
      (filterStatus === 'pending' && !fee.paid);
    
    const matchesMonth = 
      selectedMonth === 'all' || 
      fee.month === parseInt(selectedMonth);

    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Calculate statistics
  const totalFees = filteredFees.length;
  const paidFees = filteredFees.filter(f => f.paid).length;
  const totalAmount = filteredFees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = filteredFees.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 md:p-10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Fee Management
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Track and manage student fee payments</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {[
            { label: 'Total Records', value: totalFees, icon: '📋', color: 'from-blue-500 to-blue-600' },
            { label: 'Paid', value: `₹${paidAmount.toLocaleString()}`, icon: '✓', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Pending', value: `₹${(totalAmount - paidAmount).toLocaleString()}`, icon: '⏳', color: 'from-amber-500 to-amber-600' },
            { label: 'Success Rate', value: `${totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0}%`, icon: '📊', color: 'from-purple-500 to-purple-600' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-linear-to-br ${stat.color} rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              style={{
                animation: `slideIn 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="text-3xl sm:text-4xl opacity-20">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 sm:top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <option value="all">All Months</option>
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold">Student</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold hidden sm:table-cell">Faculty</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold">Amount</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold hidden md:table-cell">Month/Year</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold hidden lg:table-cell">Due Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-gray-700 font-semibold hidden xl:table-cell">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length > 0 ? (
                  filteredFees.map((fee, idx) => (
                    <tr
                      key={fee.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200"
                      style={{
                        animation: `fadeIn 0.4s ease-out ${idx * 0.05}s both`
                      }}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <p className="text-gray-900 font-medium text-xs sm:text-sm">{fee.student.name}</p>
                          <p className="text-gray-500 text-xs">{fee.student.email}</p>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden sm:table-cell text-xs sm:text-sm">{fee.faculty.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className="flex items-center gap-1 text-gray-900 font-semibold text-xs sm:text-sm">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                          {fee.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden md:table-cell text-xs sm:text-sm">{months[fee.month - 1]} {fee.year}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden lg:table-cell flex items-center gap-1 text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(fee.dueDate)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {fee.paid ? (
                          <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Paid</span>
                            <span className="sm:hidden">P</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Pending</span>
                            <span className="sm:hidden">P</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden xl:table-cell text-xs sm:text-sm">
                        {fee.paidAt ? formatDate(fee.paidAt) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
                      <p className="text-sm sm:text-lg font-medium">No records found</p>
                      <p className="text-xs sm:text-sm">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm">
          <p>Showing {filteredFees.length} of {staticFees.length} records</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeManagement;