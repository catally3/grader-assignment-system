import React, { createContext, useState, useContext } from "react";

const SemesterContext = createContext();

export const useSemester = () => {
  return useContext(SemesterContext);
};

export const SemesterProvider = ({ children }) => {
  const [semesters, setSemesters] = useState([]); // Global state for semesters
  const [semester, setSemester] = useState(""); // Currently selected semester

  return (
    <SemesterContext.Provider
      value={{ semesters, setSemesters, semester, setSemester }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
