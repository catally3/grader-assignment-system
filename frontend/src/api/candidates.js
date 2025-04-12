// src/api/candidates.js
import axios from './axiosInstance';

export const getCandidates = async () => {
  try {
    const res = await axios.get('/candidates');
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const addCandidate = async (candidate) => {
  try {
    const res = await axios.post('/candidates', candidate);
    return res.data;
  } catch (err) {
    throw err;
  }
};
