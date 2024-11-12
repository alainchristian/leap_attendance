import React, { useState, useEffect } from 'react';
import { 
  Shield,
  Lock,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import Button from '../common/Button';

const RoleManagement = ({ 
  isOpen, 
  onClose,
  availablePermissions = []
}) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        // Update existing role
        await fetch(`/api/roles/${selectedRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new role
        await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      fetchRoles();
      resetForm();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map(p => p.id) || []
    });
    setIsEditing(true);
  };

  const handleDelete = async (role) => {
    if (window.confirm(`Are you sure you want to delete the ${role.name} role?`)) {
      try {
        await fetch(`/api/roles/${role.id}`, { method: 'DELETE' });
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    const category = permission.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-asyv-green" />
              <h2 className="text-xl font-semibold text-gray-900">
                Role Management
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Roles List */}
              <div className="lg:col-span-1 border-r">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Roles</h3>
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Role
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {roles.map(role => (
                      <div 
                        key={role.id}
                        className={`p-3 rounded-lg border ${
                          expandedRole?.id === role.id
                            ? 'border-asyv-green bg-asyv-green/5'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-asyv-green" />
                            <span className="font-medium text-gray-900">{role.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(role)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(role)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setExpandedRole(expandedRole?.id === role.id ? null : role)}
                              className="text-gray-400"
                            >
                              {expandedRole?.id === role.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Role Details */}
                        {expandedRole?.id === role.id && (
                          <div className="mt-3 pl-7">
                            <p className="text-sm text-gray-500 mb-2">{role.description}</p>
                            <div className="space-y-1">
                              {role.permissions?.map(permission => (
                                <div 
                                  key={permission.id}
                                  className="flex items-center space-x-2 text-sm text-gray-600"
                                >
                                  <Lock className="h-3 w-3" />
                                  <span>{permission.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Form */}
              {isEditing && (
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedRole ? 'Edit Role' : 'Create New Role'}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-asyv-green focus:border-asyv-green"
                        placeholder="Enter role name"
                      />
                    </div>

                    {/* Role Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-asyv-green focus:border-asyv-green"
                        placeholder="Enter role description"
                      />
                    </div>

                    {/* Permissions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="space-y-4">
                        {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                          <div key={category} className="border rounded-lg">
                            <div className="bg-gray-50 px-4 py-2 rounded-t-lg border-b">
                              <h4 className="font-medium text-gray-900">{category}</h4>
                            </div>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {permissions.map(permission => (
                                <label
                                  key={permission.id}
                                  className="flex items-center space-x-3"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                      setFormData(prev => ({
                                        ...prev,
                                        permissions: e.target.checked
                                          ? [...prev.permissions, permission.id]
                                          : prev.permissions.filter(id => id !== permission.id)
                                      }));
                                    }}
                                    className="h-4 w-4 text-asyv-green border-gray-300 rounded focus:ring-asyv-green"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">
                                      {permission.name}
                                    </p>
                                    {permission.description && (
                                      <p className="text-xs text-gray-500">
                                        {permission.description}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                      <Button
                        type="submit"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {selectedRole ? 'Update Role' : 'Create Role'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Info Panel when no role is being edited */}
              {!isEditing && (
                <div className="lg:col-span-2 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-asyv-green/10">
                      <Info className="h-6 w-6 text-asyv-green" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Manage User Roles
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a role to edit its permissions or create a new role to define custom access levels for users.
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={() => setIsEditing(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create New Role
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;