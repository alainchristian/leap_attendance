// src/models/family.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class Family extends sequelize.Sequelize.Model {}

  Family.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'family_name'
    },
    familyMama: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'family_mama'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'Family',
    tableName: 'family_profiles',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  Family.associate = function(models) {
    Family.hasMany(models.Student, {
      foreignKey: 'family_id',
      as: 'students'
    });
  };

  return Family;
};