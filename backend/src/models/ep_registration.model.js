// src/models/ep_registration.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EpRegistration extends sequelize.Sequelize.Model {}

  EpRegistration.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'student_id',
      references: {
        model: 'student_profiles',
        key: 'id'
      }
    },
    offeringId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'offering_id',
      references: {
        model: 'ep_offerings',
        key: 'id'
      }
    },
    registrationStatus: {
      type: DataTypes.ENUM('Active', 'Dropped', 'Completed'),
      defaultValue: 'Active',
      field: 'registration_status'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'EpRegistration',
    tableName: 'ep_registrations',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'offering_id'],
        where: {
          deleted_at: null
        }
      }
    ]
  });

  EpRegistration.associate = function(models) {
    EpRegistration.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student'
    });
    EpRegistration.belongsTo(models.EpOffering, {
      foreignKey: 'offering_id',
      as: 'offering'
    });
    EpRegistration.hasMany(models.EpAttendance, {
      foreignKey: 'registration_id',
      as: 'attendances'
    });
  };

  return EpRegistration;
};