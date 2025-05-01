// src/api/match.js
import axios from "./axiosInstance";

// matching start: POST /match
export const runMatching = async () => {
  const res = await axios.post("/match");
  return res.data;
};

// get matching result: GET /match/results
export const getMatchingResults = async () => {
  const res = await axios.get("/match/results");
  return res.data;
};

// reassign start: POST /match/reassign
export const reassignCourses = async () => {
  const res = await axios.post("/match/reassign");
  return res.data;
};
