import Sequelize from 'sequelize';
import applicant from './applicant.js';
import course from './course.js';
import assignment from './assignment.js';
import recommendation from './recommendation.js';

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = process.env;

console.log(`Connecting to MySQL at ${DB_HOST}:${DB_PORT} as ${DB_USER} to database ${DB_NAME}`);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: 'mysql',
  logging: console.log,
  pool: { max: 5, min: 0, idle: 10000 }
});

const db = { Sequelize, sequelize };

db.Applicant = applicant(sequelize, Sequelize);
db.Course = course(sequelize, Sequelize);
db.Assignment = assignment(sequelize, Sequelize);
db.Recommendation = recommendation(sequelize, Sequelize);

// Define associations
db.Applicant.hasMany(db.Assignment, { foreignKey: 'student_id' });
db.Assignment.belongsTo(db.Applicant, { foreignKey: 'student_id' });
db.Course.hasMany(db.Assignment, { foreignKey: 'course_id' });
db.Assignment.belongsTo(db.Course, { foreignKey: 'course_id' });
db.Course.hasMany(db.Recommendation, {foreignKey: 'professor_id'});
db.Recommendation.belongsTo(db.Course, {foreignKey: 'professor_id'});
db.Applicant.hasMany(db.Recommendation, {foreignKey: 'applicant_net_id'});
db.Recommendation.belongsTo(db.Applicant, {foreignKey: 'applicant_net_id'});

/**
 * Wait for the database connection to succeed.
 * It will try a few times with a delay between each attempt.
 */
async function waitForDatabase(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established.');
      return;
    } catch (err) {
      console.log(`Database connection failed (attempt ${i + 1}): ${err.message}`);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Unable to connect to the database after several attempts.');
}

async function initDatabase() {
  try {
    await waitForDatabase();
    await sequelize.sync({ alter: true }); // Alter existing tables to match models
    console.log('Database & tables created!');
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
}

initDatabase();

export default db;