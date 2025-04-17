export default (sequelize, DataTypes) => {
  const Course = sequelize.define('course', {
    id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    semester: {type: DataTypes.STRING, allowNull: false, primaryKey: true, defaultValue: "Semester"},
    professor_name: { type: DataTypes.STRING},
    professor_email: { type: DataTypes.STRING, defaultValue: "xxx000000@utdallas.edu"},
    course_number: { type: DataTypes.STRING(10) },
    course_section: { type: DataTypes.STRING(5) },
    course_name: { type: DataTypes.STRING},
    number_of_graders: { type: DataTypes.INTEGER },
    keywords: { type: DataTypes.JSON }
  });
  return Course;
};
