export default (sequelize, DataTypes) => {
  const Assignment = sequelize.define('assignment', {
    id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
    applicant_net_id: { type: DataTypes.STRING(10)},
    course_id: { type: DataTypes.INTEGER.UNSIGNED},
    score: { type: DataTypes.FLOAT },
    reasoning: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'assigned' } // e.g., assigned, replaced
  });
  return Assignment;
};
