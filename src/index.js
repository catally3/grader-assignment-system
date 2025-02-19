
const express = require('express');
const app = express();
const port = process.env.APP_PORT || 3000;
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'host.docker.internal',
  port: process.env.MYSQL_LOCAL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD
});

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/courses', async (req, res) => {
  try {
    const courses = await db.any('SELECT * FROM "grader_assignment".courses');
    res.send(courses);
    // success
  } 
  catch(e) {
    console.log('error in getting courses');
    // error
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
 

