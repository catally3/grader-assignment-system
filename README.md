
# Grader Assignment System (GAS)

A web-based platform to manage and assign graders to university courses. 
Built for academic departments, the system supports data uploads, grader matching, and clear assignment tracking.

<img width="1725" alt="image" src="https://github.com/user-attachments/assets/67226e9f-8a8d-45db-a719-949f7e021c6b" />

## Getting Started

```bash
git@github.com:catally3/grader-assignment-system.git
cd grader-assignment-system
npm install
```

## Running Locally

```bash
docker-compose up --build
```
client: React frontend on http://localhost:3000
server: Node.js API on http://localhost:3001/api
db: MySQL database container

## Features

- **Semester Selection**: View and manage grader assignments by semester.
- **Bulk Uploads**: Import course lists, candidate data, and resumes(parsing excel, pdf files).
- **Course and Candidate Browser**: Search, filter, and sort by course or candidate attributes.
- **Matching Algorithm**: Matches best grader candidates based on resume and course's preferences.
- **Manual Reassignment**: Easily adjust grader-course pairings via modal UI.
- **Assignment Dashboard**: Visual summary of assignment status by course.
- **Validation System**: Checks for missing fields, duplicates, and resume mismatches.
- **Export Support**: Download finalized assignments.

## Tech Stack

| Layer            | Tech Stack              |
|------------------|-------------------------|
| Frontend         | React + Emotion         |
| Backend          | Node.js + Express       |
| Database         | MySQL                   |
| Containerization | Docker                  |
| Hosting          | UTD Virtual Machine     |





