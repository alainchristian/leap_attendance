// src/models/academic_year.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class AcademicYear extends sequelize.Sequelize.Model {}

  AcademicYear.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    yearName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'year_name'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'AcademicYear',
    tableName: 'academic_years',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  AcademicYear.associate = function(models) {
    AcademicYear.hasMany(models.EpRotation, {
      foreignKey: 'academic_year_id',
      as: 'rotations'
    });
  };

  return AcademicYear;
};