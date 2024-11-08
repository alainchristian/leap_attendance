
// src/models/ep_center.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class EpCenter extends sequelize.Sequelize.Model {}

  EpCenter.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    centerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'center_name'
    },
    centerDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'center_description'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'EpCenter',
    tableName: 'ep_centers',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  EpCenter.associate = function(models) {
    EpCenter.hasMany(models.EnrichmentProgram, {
      foreignKey: 'center_id',
      as: 'programs'
    });
  };

  return EpCenter;
};
