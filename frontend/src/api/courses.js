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

export const createCourse = async (courseData) => {
  try {
    const res = await axios.post("/courses", courseData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const uploadCourses = async (file) => {
  try {
    const res = await axios.post("/upload/courses", file);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await axios.delete(`/courses/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};
