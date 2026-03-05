"use client";

import React, { useState, useContext, useEffect, createContext } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FacultyContext = createContext();

export const FacultyProvider = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

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

        const res = await fetch("http://localhost:3014/api/profile-check", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success) {
          setFaculty(data.faculty);
        } else {
          router.push("/complete-profile");
        }
      } catch (error) {
        console.error("Profile check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFacultyProfile();
  }, [isLoaded, isSignedIn, getToken, router]);

  // ✅ Fetch All Students
  const fetchAllStudents = async () => {
    try {
      const token = await getToken({ template: "default" });

      const res = await fetch("http://localhost:3014/api/get-all-students", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        console.log(data);
        
        setStudents(data.students);  // ✅ store in state
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
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => useContext(FacultyContext);