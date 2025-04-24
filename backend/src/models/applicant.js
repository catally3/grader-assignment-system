export default (sequelize, DataTypes) => {
  const Applicant = sequelize.define('applicant', {
    applicant_name: { type: DataTypes.STRING },
    student_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      defaultValue: '0000000000'
    },
    document_id: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
      defaultValue: '0000000'
    },
    // semester: {type: DataTypes.STRING, allowNull: false, primaryKey: true, defaultValue: "Semester"},
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Semester'
    },
    school_year: { type: DataTypes.STRING(10), defaultValue: 'Masters' },
    university: {
      type: DataTypes.STRING(35),
      defaultValue: 'The University of Texas at Dallas'
    },
    school: {
      type: DataTypes.STRING,
      defaultValue: 'Erik Jonsson School of Engineering and Computer Science'
    },
    graduation_date: { type: DataTypes.STRING(10), defaultValue: '2026-05-01' },
    major: { type: DataTypes.STRING, defaultValue: 'Computer Science' },
    qualified: { type: DataTypes.BOOLEAN },
    gpa: { type: DataTypes.FLOAT.UNSIGNED },
    applicant_email: {
      type: DataTypes.STRING(50),
      defaultValue: 'xxx000000@utdallas.edu'
    },
    resume_path: { type: DataTypes.STRING },
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
  return Applicant;
};
