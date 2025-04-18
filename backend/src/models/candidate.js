export default (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    // SQL-generated primary key 'id' remains unchanged.
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    // Add a new field for the applicant ID (as it comes from the resume)
    applicantId: { type: DataTypes.STRING }, // You may also choose a numeric type if applicable.
    resumePath: { type: DataTypes.STRING },
    education: { type: DataTypes.STRING },
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
