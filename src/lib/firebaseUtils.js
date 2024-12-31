import { getDoc, doc, enableNetwork } from "firebase/firestore";
import { db } from "./firebase"; // Ensure correct Firebase import

export const fetchUserData = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      console.log("User data:", userSnapshot.data());
      return userSnapshot.data(); // Return user data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    if (error.code === "unavailable") {
      console.log("Network unavailable, retrying...");
      await enableNetwork(db); // Reconnect Firebase
      return fetchUserData(userId); // Retry fetching data
    } else {
      console.error("Error fetching user data:", error.message);
      throw error; // Rethrow error for further handling
    }
  }
};
