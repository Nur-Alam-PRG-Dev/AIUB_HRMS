<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_employees', 'create_employee', 'edit_employee', 'delete_employee',
            'view_salary', 'create_salary', 'edit_salary', 'approve_salary',
            'view_payroll', 'create_payroll', 'approve_payroll', 'process_payroll',
            'view_leaves', 'manage_leaves', 'approve_leave',
            'view_attendance', 'manage_attendance',
            'view_reports', 'export_reports',
            'manage_roles', 'manage_users', 'view_logs', 'manage_departments',
            'manage_designations', 'manage_announcements',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roles = [
            'super_admin' => $permissions,
            'hr_admin' => [
                'view_employees', 'create_employee', 'edit_employee',
                'view_salary', 'create_salary', 'edit_salary',
                'view_payroll', 'create_payroll', 'approve_payroll', 'process_payroll',
                'view_leaves', 'manage_leaves', 'approve_leave',
                'view_attendance', 'manage_attendance',
                'view_reports', 'export_reports',
                'manage_departments', 'manage_designations', 'manage_announcements',
            ],
            'manager' => [
                'view_employees', 'view_salary', 'view_payroll',
                'view_leaves', 'approve_leave', 'view_attendance',
            ],
            'employee' => [
                'view_attendance',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
