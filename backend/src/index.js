const express = require('express');
const mysql = require('mysql2/promise');
const courseRoutes = require('./routes/courseRoutes');
const fileRoutes = require('./routes/fileRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();
const cors = require('cors');
const port = process.env.APP_PORT || 3001;

// **[Kay] Add cors**
app.use(cors());
app.use(express.json());

// **[Kay] Edited properties**
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Create a MySQL connection pool using mysql2/promise.
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'mysql',
//   port: process.env.MYSQL_LOCAL_PORT,
//   database: process.env.MYSQL_DATABASE,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_ROOT_PASSWORD
// });

// Make the pool available to all controllers via app.locals.
app.locals.pool = pool;

// Mount modular routes.
app.use('/api/courses', courseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/import', importRoutes);

app.get('/', (req, res) => {
  res.send('Hello World! Backend for Grader Assignment System is running.');
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
