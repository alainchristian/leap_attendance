import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  UserCog,
  Shield
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import userService from '../../services/userService';
import ConfirmModal from '../../components/modals/ConfirmModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserList();
      setUsers(Array.isArray(response.data) ? response.data : []);
      console.log('Fetched users:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await userService.toggleUserStatus(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'firstName',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-asyv-green/10 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-asyv-green" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {`${row.original.firstName || ''} ${row.original.lastName || ''}`}
            </div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Roles',
      accessorKey: 'roles',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.original.roles) ? row.original.roles.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-asyv-green/10 text-asyv-green gap-1"
            >
              <Shield className="h-3 w-3" />
              {role.name || role}
            </span>
          )) : null}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant={row.original.isActive ? "success" : "danger"}
            size="sm"
            className="gap-1"
            onClick={() => handleToggleStatus(row.original)}
          >
            {row.original.isActive ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Inactive
              </>
            )}
          </Button>
        </div>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-blue-600"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-red-600"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and their permissions
          </p>
        </div>
        <div className="mt-4 flex gap-3 md:mt-0 md:ml-4">
          <Button
            variant="secondary"
          >
            <Shield className="h-4 w-4 mr-2" />
            Manage Roles
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-asyv-green focus:border-asyv-green"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            All Users
          </Button>
          <Button variant="outline">
            Active
          </Button>
          <Button variant="outline">
            Inactive
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <DataTable
          data={filteredUsers}
          columns={columns}
          showPagination={true}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;