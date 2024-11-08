
// src/models/ep_attendance.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EpAttendance extends sequelize.Sequelize.Model {}

  EpAttendance.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    registrationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'registration_id',
      references: {
        model: 'ep_registrations',
        key: 'id'
      }
    },
    attendanceDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'attendance_date'
    },
    attendanceStatus: {
      type: DataTypes.ENUM('Present', 'Absent', 'Excused'),
      allowNull: false,
      field: 'attendance_status'
    },
    markedById: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'marked_by_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'EpAttendance',
    tableName: 'ep_attendance',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['registration_id', 'attendance_date'],
        where: {
          deleted_at: null
        }
      }
    ]
  });

  EpAttendance.associate = function(models) {
    EpAttendance.belongsTo(models.EpRegistration, {
      foreignKey: 'registration_id',
      as: 'registration'
    });
    EpAttendance.belongsTo(models.User, {
      foreignKey: 'marked_by_id',
      as: 'markedBy'
    });
  };

  return EpAttendance;
};