"use client"
import { useFaculty } from "@/context/facultyContext";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const RequestPage = () => {
  const { getToken } = useAuth();
  const { BackendURL } = useFaculty();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await getToken({ template: "default" }); // ✅ await was missing

        const res = await fetch(`${BackendURL}/api/get-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) setRequests(data.data);
      } catch (err) {
        console.error("fetchRequests error →", err);
      } finally {
        setLoading(false);
      }
    };

    if (BackendURL) fetchRequests();
  }, [BackendURL]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((r) => (
          <div key={r._id}>
            <p>{r.studentId?.name}</p>
            <p>{r.fromFaculty?.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestPage;