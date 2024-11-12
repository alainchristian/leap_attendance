import React, { useState, useEffect } from 'react';
import { 
  UserCircle, 
  Mail, 
  Key, 
  Shield, 
  UserCog,
  X
} from 'lucide-react';
import Button from '../common/Button';

const UserFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user = null, 
  availableRoles = []
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        roles: user.roles?.map(role => role.id || role) || [],
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!user) { // Only validate password for new users
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <UserCog className="h-6 w-6 text-asyv-green" />
              <h2 className="text-xl font-semibold text-gray-900">
                {user ? 'Edit User' : 'Create New User'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.firstName 
                        ? 'focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-asyv-green focus:border-asyv-green'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className={`h-5 w-5 ${
                      errors.firstName ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.lastName 
                        ? 'focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-asyv-green focus:border-asyv-green'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className={`h-5 w-5 ${
                      errors.lastName ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      errors.email 
                        ? 'focus:ring-red-500 focus:border-red-500' 
                        : 'focus:ring-asyv-green focus:border-asyv-green'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${
                      errors.email ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Fields - Only show for new users */}
              {!user && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.password 
                            ? 'focus:ring-red-500 focus:border-red-500' 
                            : 'focus:ring-asyv-green focus:border-asyv-green'
                        }`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className={`h-5 w-5 ${
                          errors.password ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        } pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.confirmPassword 
                            ? 'focus:ring-red-500 focus:border-red-500' 
                            : 'focus:ring-asyv-green focus:border-asyv-green'
                        }`}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className={`h-5 w-5 ${
                          errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              )}

              {/* Roles */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles
                </label>
                <div className="space-y-2">
                  {availableRoles.map(role => (
                    <label
                      key={role.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role.id)}
                        onChange={() => handleRoleChange(role.id)}
                        className="h-4 w-4 text-asyv-green border-gray-300 rounded focus:ring-asyv-green"
                      />
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-asyv-green" />
                        <span className="font-medium text-gray-900">{role.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{role.description}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && (
                  <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="sm:col-span-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-asyv-green border-gray-300 rounded focus:ring-asyv-green"
                  />
                  <label className="text-sm text-gray-700">Active Account</label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
              >
                {user ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;