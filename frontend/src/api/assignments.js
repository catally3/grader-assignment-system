// src/api/assignments.js
import axios from "./axiosInstance";

export const getAssignment = async () => {
  try {
    const res = await axios.get("/assignments");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateAssignment = async (id, assignmentInfo) => {
  try {
    const res = await axios.update(`/assignments/${id}`, assignmentInfo);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteAssignment = async (id) => {
  try {
    const res = await axios.delete(`/assignments/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};
