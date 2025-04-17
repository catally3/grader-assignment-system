export default (sequelize, DataTypes) => {
    const Recommendation = sequelize.define('recommendation', {
      id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true}, 
      semester: {type: DataTypes.STRING, allowNull: false, defaultValue: "Semester"},
      professor_id: { type: DataTypes.INTEGER.UNSIGNED},
      applicant_name: {type: DataTypes.STRING},
      applicant_net_id: { type: DataTypes.STRING(10), defaultValue: "xxx000000"}
    });
    return Recommendation;
  };