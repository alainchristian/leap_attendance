// src/models/student.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class Student extends sequelize.Sequelize.Model {}

  Student.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'unique_id'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    familyId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'family_id',
      references: {
        model: 'family_profiles',
        key: 'id'
      }
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'student_profiles',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  Student.associate = function(models) {
    Student.belongsTo(models.Family, {
      foreignKey: 'family_id',
      as: 'family'
    });
    Student.hasMany(models.EpRegistration, {
      foreignKey: 'student_id',
      as: 'registrations'
    });
  };

  return Student;
};