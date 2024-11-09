import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

const schema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    userType: z.enum(['Admin', 'Teacher', 'Supervisor']),
    gender: z.enum(['Male', 'Female']),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    confirmPassword: z.string().optional()
}).refine((data) => {
    if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const UserForm = ({ initialData, onSubmit, onCancel }) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        watch 
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            email: '',
            userType: 'Supervisor',
            gender: 'Male'
        }
    });

    const handleFormSubmit = async (data) => {
        // Remove confirm password from submission
        const { confirmPassword, ...submitData } = data;
        // Remove password if it's empty (for editing)
        if (!submitData.password) {
            delete submitData.password;
        }
        await onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                </div>
                <div>
                    <Input
                        label="Last Name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                    />
                </div>
            </div>

            <div>
                <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Select
                        label="Role"
                        {...register('userType')}
                        error={errors.userType?.message}
                    >
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Supervisor">Supervisor</option>
                    </Select>
                </div>
                <div>
                    <Select
                        label="Gender"
                        {...register('gender')}
                        error={errors.gender?.message}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Select>
                </div>
            </div>

            {(!initialData || watch('password')) && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Input
                            label={initialData ? "New Password (leave blank to keep current)" : "Password"}
                            type="password"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </div>
                    <div>
                        <Input
                            label="Confirm Password"
                            type="password"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update User' : 'Create User')}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;