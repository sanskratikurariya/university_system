"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "/src/lib/firebase"; // Import Firestore
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { fetchUserData } from "src/lib/firebaseUtils"; // Import the fetchUserData function

const Home = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await setPersistence(auth, browserSessionPersistence); // Set session persistence
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Details:", user);
      alert(`Welcome, ${user.displayName}!`);

      // Fetch user data after successful sign-in
      const data = await fetchUserData(user.uid);
      console.log("Fetched user data:", data);

      // Check if the user's details are already submitted
      const userDoc = doc(db, "users", user.uid); // Assuming "users" collection
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        router.push("/profile"); // Redirect to profile if details are submitted
      } else {
        router.push("/form"); // Redirect to form if details are not submitted
      }
    } catch (error) {
      console.log("Error during sign-in:", error.message);
      alert("Sign-In Failed!");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data after sign-in
          const data = await fetchUserData(user.uid);
          console.log("Fetched user data on auth state change:", data);

          // Check if user details are already submitted
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            router.push("/profile"); // Redirect to profile if details are submitted
          } else {
            router.push("/form"); // Redirect to form if details are not submitted
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white bg-blue-900">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/innerbanner1.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-80 z-10"></div>
      <div className="relative z-20 w-full max-w-lg mx-auto p-8 bg-white bg-opacity-30 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">University Management System</h1>
        <p className="text-center mb-6 text-gray-900 font-bold">
          Manage your university tasks with ease and efficiency.
        </p>
        <div className="flex flex-col gap-6">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="text-3xl" />
            )}
            Sign Up with Google
          </button>
          <button className="bg-blue-600 text-lg px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Sign Up with Email
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
