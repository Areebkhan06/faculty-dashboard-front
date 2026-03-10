"use client";

import React, { useState, useContext, useEffect, createContext } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const FacultyContext = createContext();

export const FacultyProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [faculty, setFaculty] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Check Faculty Profile
  useEffect(() => {
    const checkFacultyProfile = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken({ template: "default" });

        const res = await fetch(`${BackendURL}/api/profile-check`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success && data.faculty) {
          setFaculty(data.faculty);
        } else {
          router.replace("/complete-profile");
        }
      } catch (error) {
        console.error("Profile check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFacultyProfile();
  }, [isLoaded, isSignedIn]);

  if (!faculty) {
  return res.json({
    success: false,
    message: "Faculty profile not found",
  });
}

  // ✅ Fetch All Students
  const fetchAllStudents = async () => {

    if(!faculty){
      router.replace("/complete-profile");
    }
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/get-all-students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setStudents(data.students); // ✅ store in state
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <FacultyContext.Provider
      value={{
        faculty,
        students,
        fetchAllStudents,
        loading,
        isSignedIn,
        setLoading,
        BackendURL,
        checkFacultyProfile,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => useContext(FacultyContext);
