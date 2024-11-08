// backend/src/models/user_role.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class UserRole extends sequelize.Sequelize.Model {}

  UserRole.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  // Define associations
  UserRole.associate = function(models) {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    UserRole.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
  };

  return UserRole;
};