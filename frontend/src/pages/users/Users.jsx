import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/modals/ConfirmModal';
import userService from '../../services/userService';
import { useAuth } from '../../context/auth.context';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUserList();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (user) => {
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

    const columns = [
        {
            header: 'Name',
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-gray-900">{row.original.firstName} {row.original.lastName}</div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
                </div>
            ),
        },
        {
            header: 'Gender',
            accessorKey: 'gender',
            cell: ({ row }) => (
                <span className="text-gray-900">
                    {row.original.gender}
                </span>
            ),
        },
        {
            header: 'Roles',
            accessorKey: 'roles',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.roles.map((role, index) => (
                        <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                            {role}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.original.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    {currentUser?.id !== row.original.id && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={Edit2}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                icon={Trash2}
                                onClick={() => handleDeleteUser(row.original)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage system users, roles, and permissions
                    </p>
                </div>
                <Button
                    variant="success"
                    icon={UserPlus}
                >
                    Add User
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                            placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
                            focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow">
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    loading={loading}
                    showPagination={true}
                    pageSize={10}
                />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete User"
                    message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
                    confirmLabel="Delete"
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