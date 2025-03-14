export default (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    resumePath: { type: DataTypes.STRING },
    education: { type: DataTypes.STRING },  // changed from 'degree'
    gpa: { type: DataTypes.FLOAT },
    skills: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('skills');
        try {
          return JSON.parse(rawValue);
        } catch (err) {
          return rawValue;
        }
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      }
    },
    experience: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('experience');
        try {
          return JSON.parse(rawValue);
        } catch (err) {
          return rawValue;
        }
      },
      set(value) {
        this.setDataValue('experience', JSON.stringify(value));
      }
    }
  });
  return Candidate;
};
