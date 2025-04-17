// src/api/candidates.js
import axios from "./axiosInstance";

export const getCourses = async () => {
  try {
    const res = await axios.get("/courses");
    return res.data;
  } catch (err) {
    throw err;
  }
};
