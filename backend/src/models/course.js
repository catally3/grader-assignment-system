export default (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    professorName: { type: DataTypes.STRING, allowNull: false },
    courseName: { type: DataTypes.STRING, allowNull: false },
    // The criteria field stores course requirements (e.g., degree, minimum GPA, required skills)
    criteria: { type: DataTypes.JSON }
  });
  return Course;
};
