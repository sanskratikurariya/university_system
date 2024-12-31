"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "/src/lib/firebase"; // Firebase imports
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { FaUser, FaRegEnvelope, FaUniversity, FaArrowRight } from "react-icons/fa"; // Icons

const FormPage = () => {
  const router = useRouter();

  // State for form data
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState(""); // Will be pre-filled
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data after login to pre-fill the form
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      setName(auth.currentUser.displayName || "");
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save data to Firestore
      const userData = {
        name,
        rollNumber,
        email,
        branch,
        year,
        createdAt: new Date(),
      };

      // Save user data to Firestore in 'students' collection
      await setDoc(doc(db, "students", auth.currentUser.uid), userData);
      router.push("/main"); // Redirect to main screen after submission
    } catch (error) {
      console.log("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-blue-900">
       
      <div className="absolute inset-0 bg-black bg-opacity-70 z-10">
      <h1 className="text-5xl mt-12 font-bold text-center  text-white">Student Details</h1>
      </div>
     
      <div className="relative z-10 w-full max-w-lg mx-auto p-8 bg-white bg-opacity-30 rounded-lg shadow-2xl animate__animated animate__fadeIn">
       
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="flex items-center gap-4">
            <FaUser className="text-2xl text-white" />
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
              required
            />
          </div>

          {/* Roll Number Field */}
          <div className="flex items-center gap-4">
            <FaRegEnvelope className="text-2xl text-white" />
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
              required
            />
          </div>

          {/* Email Field (Pre-filled) */}
          <div className="flex items-center gap-4">
            <FaRegEnvelope className="text-2xl text-white" />
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-3 rounded-lg bg-white text-black"
            />
          </div>

          {/* Branch Dropdown */}
          <div className="flex items-center gap-4">
            <FaUniversity className="text-2xl text-white" />
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
              required
            >
              <option value="">Select Branch</option>
              <option value="computer-science">Computer Science</option>
              <option value="electronics-communication">Electronics and Communication</option>
              <option value="civil">Civil</option>
              <option value="electrical">Electrical</option>
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-4">
            <FaUniversity className="text-2xl text-white" />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black"
              required
            >
              <option value="">Select Year</option>
              <option value="first-year">First Year</option>
              <option value="second-year">Second Year</option>
              <option value="third-year">Third Year</option>
              <option value="fourth-year">Fourth Year</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
