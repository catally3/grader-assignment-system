// src/api/files.js
import axios from "./axiosInstance";

// List files in a category (e.g., resumes, files)
export const listFiles = async (category) => {
  const res = await axios.get(`/files?category=${category}`);
  return res.data.files;
};

// Download a specific file by category and filename
export const downloadFile = async (category, filename) => {
  const res = await axios.get(`/files/${category}/${filename}`, {
    responseType: "blob",
  });

  // Trigger browser download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
