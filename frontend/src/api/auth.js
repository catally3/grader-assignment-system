// src/api/auth.js
import axios from "./axiosInstance";

export const login = async (email, password) => {
  try {
    const response = await axios.post("/login", { email, password });
    const { token } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      return { success: true };
    }

    return { success: false, message: "Token not received" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};
