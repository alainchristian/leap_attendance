// src/models/ep_offering.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EpOffering extends sequelize.Sequelize.Model {}

  EpOffering.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    rotationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'rotation_id',
      references: {
        model: 'ep_rotations',
        key: 'id'
      }
    },
    programId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'program_id',
      references: {
        model: 'enrichment_programs',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'teacher_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      field: 'max_capacity'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'EpOffering',
    tableName: 'ep_offerings',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  EpOffering.associate = function(models) {
    EpOffering.belongsTo(models.EpRotation, {
      foreignKey: 'rotation_id',
      as: 'rotation'
    });
    EpOffering.belongsTo(models.EnrichmentProgram, {
      foreignKey: 'program_id',
      as: 'program'
    });
    EpOffering.belongsTo(models.User, {
      foreignKey: 'teacher_id',
      as: 'teacher'
    });
    EpOffering.hasMany(models.EpRegistration, {
      foreignKey: 'offering_id',
      as: 'registrations'
    });
  };

  return EpOffering;
};