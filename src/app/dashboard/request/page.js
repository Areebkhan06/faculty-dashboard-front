"use client";
import { useFaculty } from "@/context/facultyContext";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { ArrowRightLeft, Clock, CheckCircle2, XCircle, Loader } from "lucide-react";

const monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const RequestPage = () => {
  const { getToken } = useAuth();
  const { BackendURL,setrequestCount } = useFaculty();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null); // stores requestId being responded to

  const fetchRequests = async () => {
    try {
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/get-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success){ 
        setrequestCount(data.data.length);
        setRequests(data.data);
      }
    } catch (err) {
      console.error("fetchRequests error →", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (BackendURL) fetchRequests();
  }, [BackendURL]);

  const handleRespond = async (requestId, action) => {
    setResponding(requestId);
    try {
      const token = await getToken({ template: "default" });
      const res = await fetch(`${BackendURL}/api/respond-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (data.success) {
        // remove from list after responding
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    } catch (err) {
      console.error("respond error →", err);
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              Incoming
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transfer Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Review and respond to incoming student transfer requests</p>
            </div>
            {!loading && requests.length > 0 && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                {requests.length} pending
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader className="w-6 h-6 animate-spin text-indigo-500" />
            <p className="text-gray-400 text-sm">Loading requests...</p>
          </div>

        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <ArrowRightLeft className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No pending requests</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>

        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                      {r.studentId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.studentId?.name}</p>
                      <p className="text-gray-400 text-xs">{r.studentId?.email}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-600 rounded-full text-[10px] font-semibold shrink-0">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">From</p>
                    <p className="text-xs font-semibold text-gray-700">{r.fromFaculty?.name}</p>
                    <p className="text-[10px] text-gray-400">{r.fromFaculty?.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Timing</p>
                    <p className="text-xs font-semibold text-gray-700">{r.batchTiming}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Days</p>
                    <p className="text-xs font-semibold text-gray-700">{r.days}</p>
                  </div>
                  {r.feeId && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Fee</p>
                      <p className="text-xs font-semibold text-gray-700">
                        ₹{r.feeId?.amount?.toLocaleString()} — {monthsShort[(r.feeId?.month ?? 1) - 1]} {r.feeId?.year}
                      </p>
                    </div>
                  )}
                  {r.note && (
                    <div className="col-span-2 sm:col-span-3">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Note</p>
                      <p className="text-xs text-gray-600">{r.note}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(r._id, "approved")}
                    disabled={responding === r._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding === r._id ? (
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(r._id, "declined")}
                    disabled={responding === r._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {responding === r._id ? (
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    Decline
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;