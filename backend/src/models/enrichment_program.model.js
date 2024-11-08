// src/models/enrichment_program.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EnrichmentProgram extends sequelize.Sequelize.Model {}

  EnrichmentProgram.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    programName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'program_name'
    },
    centerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'center_id',
      references: {
        model: 'ep_centers',
        key: 'id'
      }
    },
    programDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'program_description'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'EnrichmentProgram',
    tableName: 'enrichment_programs',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  EnrichmentProgram.associate = function(models) {
    EnrichmentProgram.belongsTo(models.EpCenter, {
      foreignKey: 'center_id',
      as: 'center'
    });
    EnrichmentProgram.hasMany(models.EpOffering, {
      foreignKey: 'program_id',
      as: 'offerings'
    });
  };

  return EnrichmentProgram;
};