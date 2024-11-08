// src/models/role_permission.model.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends sequelize.Sequelize.Model {}

  RolePermission.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permissionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'permission_id',
      references: {
        model: 'permissions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id']
      }
    ]
  });

  RolePermission.associate = function(models) {
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
    RolePermission.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
      as: 'permission'
    });
  };

  return RolePermission;
};
