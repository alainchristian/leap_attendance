// src/models/ep_rotation.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EpRotation extends sequelize.Sequelize.Model {}

  EpRotation.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    academicYearId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'academic_year_id',
      references: {
        model: 'academic_years',
        key: 'id'
      }
    },
    gradeLevel: {
      type: DataTypes.ENUM('EY', 'S4'),
      allowNull: false,
      field: 'grade_level'
    },
    rotationNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'rotation_number'
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
    modelName: 'EpRotation',
    tableName: 'ep_rotations',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  EpRotation.associate = function(models) {
    EpRotation.belongsTo(models.AcademicYear, {
      foreignKey: 'academic_year_id',
      as: 'academicYear'
    });
    EpRotation.hasMany(models.EpOffering, {
      foreignKey: 'rotation_id',
      as: 'offerings'
    });
  };

  return EpRotation;
};