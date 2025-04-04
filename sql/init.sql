-- Drop tables if they already exist
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Candidates;
DROP TABLE IF EXISTS Courses;

-- Create Candidates table
CREATE TABLE Candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  resumePath VARCHAR(255),
  degree VARCHAR(255),
  gpa FLOAT,
  skills TEXT,
  workExperienceEntries TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Courses table
CREATE TABLE Courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  professorName VARCHAR(255) NOT NULL,
  professorEmail VARCHAR(255),
  courseNumber VARCHAR(50),
  section VARCHAR(50),
  courseName VARCHAR(255) NOT NULL,
  recommendedStudentName VARCHAR(255),
  recommendedStudentNetid VARCHAR(255),
  numOfGraders INT,
  keywords JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Assignments table
CREATE TABLE Assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidateId INT NOT NULL,
  courseId INT NOT NULL,
  score FLOAT,
  reasoning TEXT,
  status VARCHAR(255) DEFAULT 'assigned',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (candidateId) REFERENCES Candidates(id),
  FOREIGN KEY (courseId) REFERENCES Courses(id)
);
