export default (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    professorName: { type: DataTypes.STRING, allowNull: false },
    professorEmail: { type: DataTypes.STRING },
    courseNumber: { type: DataTypes.STRING },
    section: { type: DataTypes.STRING },
    courseName: { type: DataTypes.STRING, allowNull: false },
    recommendedStudentName: { type: DataTypes.STRING },
    recommendedStudentNetid: { type: DataTypes.STRING },
    numOfGraders: { type: DataTypes.INTEGER },
    keywords: { type: DataTypes.JSON }
  });
  return Course;
};
