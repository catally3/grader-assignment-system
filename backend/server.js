import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import applicantRoutes from './src/routes/applicantRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import assignmentRoutes from './src/routes/assignmentRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import exportRoutes from './src/routes/exportRoutes.js'
import fileRoutes from './src/routes/fileRoutes.js';

import './src/models/index.js'; // ensure database initialization runs

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoints
app.use('/api/applicants', applicantRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/files', fileRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
