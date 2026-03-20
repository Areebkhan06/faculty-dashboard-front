"use client";

import React, { useState, useContext, useEffect, createContext } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FacultyContext = createContext();

export const FacultyProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [faculty, setFaculty] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestCount, setrequestCount] = useState("0");

  // 🔐 Check faculty profile after login
  useEffect(() => {
    const checkFacultyProfile = async () => {
      if (!isLoaded || !isSignedIn) {
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkFacultyProfile();
  }, [isLoaded, isSignedIn]);

  // 📚 Fetch students
  const fetchAllStudents = async () => {
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch(`${BackendURL}/api/get-all-students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error(error);
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
        setStudents,
        BackendURL,
        setrequestCount,
        requestCount
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => useContext(FacultyContext);
