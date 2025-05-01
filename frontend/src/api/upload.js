// api/upload.js
import axios from "./axiosInstance";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resumeFile", file);

  const response = await axios.post("/upload/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadResumeZip = async (zipFile) => {
  const formData = new FormData();
  formData.append("resumeZip", zipFile);

  const response = await axios.post("/upload/resumes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadCandidateList = async (excelFile) => {
  const formData = new FormData();
  formData.append("candidateList", excelFile);

  const res = await axios.post(`/upload/candidates`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadCourseList = async (file) => {
  const formData = new FormData();
  formData.append("courseList", file);

  const res = await axios.post(`/upload/courses`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
