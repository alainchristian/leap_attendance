import React, { useState, useEffect } from 'react';
//import DashboardLayout from '../../layouts/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import FormModal from '../../components/modals/FormModal';
import UserForm from '../../components/user/UserForm';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import { toast } from 'react-hot-toast';
import { Plus, UserPlus, Filter, Download } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all'
    });

    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (data) => {
        try {
            await userService.createUser(data);
            toast.success('User created successfully');
            fetchUsers();
            setShowModal(false);
        } catch (error) {
            toast.error(error.message || 'Failed to create user');
        }
    };

    const handleEditUser = async (id, data) => {
        try {
            await userService.updateUser(id, data);
            toast.success('User updated successfully');
            fetchUsers();
            setShowModal(false);
            setSelectedUser(null);
        } catch (error) {
            toast.error(error.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await userService.deleteUser(id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.message || 'Failed to delete user');
        }
    };

    const columns = [
        {
            header: 'Name',
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            cell: ({ row }) => (
                <div className="flex items-center">
                    <div>
                        <p className="font-medium text-gray-900">
                            {row.original.firstName} {row.original.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{row.original.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            accessorKey: 'userType',
            cell: ({ row }) => (
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold 
                    ${row.original.userType === 'Admin' ? 'bg-red-100 text-red-800' : 
                    row.original.userType === 'Teacher' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                    {row.original.userType}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold 
                    ${row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedUser(row.original);
                            setShowModal(true);
                        }}
                        disabled={!currentUser.roles.includes('admin')}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(row.original.id)}
                        disabled={!currentUser.roles.includes('admin')}
                    >
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesRole = filters.role === 'all' || user.userType === filters.role;
        const matchesStatus = filters.status === 'all' || 
            (filters.status === 'active' ? user.isActive : !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

                    <Button 
                        onClick={() => {
                            setSelectedUser(null);
                            setShowModal(true);
                        }}
                        disabled={!currentUser.roles.includes('admin')}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

                <Card>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 md:items-center mb-6">
                            <SearchBar
                                value={filters.search}
                                onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
                                placeholder="Search users..."
                                className="w-full sm:w-96"
                            />
                            
                            <div className="flex gap-2 ml-auto">
                                <FilterDropdown
                                    options={[
                                        { value: 'all', label: 'All Roles' },
                                        { value: 'Admin', label: 'Admin' },
                                        { value: 'Teacher', label: 'Teacher' },
                                        { value: 'Supervisor', label: 'Supervisor' }
                                    ]}
                                    value={filters.role}
                                    onChange={(value) => setFilters(f => ({...f, role: value}))}
                                />
                                
                                <FilterDropdown
                                    options={[
                                        { value: 'all', label: 'All Status' },
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' }
                                    ]}
                                    value={filters.status}
                                    onChange={(value) => setFilters(f => ({...f, status: value}))}
                                />
                            </div>
                        </div>

                        <DataTable
                            data={filteredUsers}
                            columns={columns}
                            loading={loading}
                        />
                    </div>
                </Card>
            </div>

            <FormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                title={selectedUser ? 'Edit User' : 'Create New User'}
            >
                <UserForm
                    initialData={selectedUser}
                    onSubmit={selectedUser ? 
                        (data) => handleEditUser(selectedUser.id, data) : 
                        handleCreateUser
                    }
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                    }}
                />
            </FormModal>
        </DashboardLayout>
    );
};

export default Users;