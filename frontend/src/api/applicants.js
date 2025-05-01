// src/api/candidates.js
import axios from "./axiosInstance";

export const getApplicants = async (page = 1, limit = 20) => {
  try {
    const res = await axios.get(`/applicants?page=${page}&limit=${limit}`);
    return res.data; // { data, page, hasMore, total }
  } catch (err) {
    throw err;
  }
};

export const createApplicants = async (applicant) => {
  try {
    const res = await axios.post("/applicants", applicant);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const deleteApplicant = async (id) => {
  try {
    const res = await axios.delete(`/applicants/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const uploadCv = async (file) => {
  try {
    const res = await axios.post("/upload/cv", file);
    return res.data;
  } catch (err) {
    throw err;
  }
};
