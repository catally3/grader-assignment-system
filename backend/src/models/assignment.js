export default (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    candidateId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.FLOAT },
    reasoning: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'assigned' } // e.g., assigned, replaced
  });
  return Assignment;
};
