<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\SalaryStructure;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersAndEmployeesSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@aiub.edu'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('Admin@1234'),
                'email_verified_at' => now(),
                'provider' => 'email',
                'is_active' => true,
            ]
        );
        $admin->assignRole('super_admin');

        // HR Admin
        $hrUser = User::firstOrCreate(
            ['email' => 'hr@aiub.edu'],
            [
                'name' => 'Dr. Ahmed Rahman',
                'password' => Hash::make('Hr@12345'),
                'email_verified_at' => now(),
                'provider' => 'email',
                'is_active' => true,
            ]
        );
        $hrUser->assignRole('hr_admin');

        $cseDept = Department::where('code', 'CSE')->first();
        $eeeDept = Department::where('code', 'EEE')->first();
        $bbaDept = Department::where('code', 'BBA')->first();
        $hrDept = Department::where('code', 'HR')->first();

        $cseDesig = Designation::where('title', 'like', 'Assistant Professor - CSE%')->first();
        $hrDesig = Designation::where('title', 'like', 'Manager - HR%')->first();

        // Create HR Employee record for the HR admin user
        $hrEmployee = Employee::firstOrCreate(
            ['user_id' => $hrUser->id],
            [
                'employee_id' => 'AIUB-EMP-0001',
                'first_name' => 'Ahmed',
                'last_name' => 'Rahman',
                'phone' => '01711000001',
                'date_of_birth' => '1978-05-15',
                'gender' => 'male',
                'address' => 'House 23, Road 5, Banani, Dhaka',
                'department_id' => $hrDept?->id ?? $cseDept?->id,
                'designation_id' => $hrDesig?->id ?? $cseDesig?->id,
                'joining_date' => '2010-01-01',
                'employment_type' => 'full_time',
                'status' => 'active',
                'bank_name' => 'Dutch Bangla Bank',
                'account_number' => '1234567890',
            ]
        );

        // Create salary structure for HR employee
        SalaryStructure::firstOrCreate(
            ['employee_id' => $hrEmployee->id, 'is_current' => true],
            [
                'basic_salary' => 85000,
                'house_rent_allowance' => 42500,
                'medical_allowance' => 5000,
                'transport_allowance' => 3000,
                'other_allowance' => 2000,
                'provident_fund_percent' => 10,
                'tax_percent' => 5,
                'other_deductions' => 0,
                'effective_from' => '2024-01-01',
                'created_by' => $admin->id,
            ]
        );

        // Sample employees
        $sampleEmployees = [
            [
                'name' => 'Sumaiya Khan', 'email' => 'sumaiya.khan@aiub.edu',
                'first_name' => 'Sumaiya', 'last_name' => 'Khan', 'gender' => 'female',
                'dept_code' => 'CSE', 'basic' => 55000, 'emp_id' => 'AIUB-EMP-0002',
            ],
            [
                'name' => 'Rafiqul Islam', 'email' => 'rafiqul.islam@aiub.edu',
                'first_name' => 'Rafiqul', 'last_name' => 'Islam', 'gender' => 'male',
                'dept_code' => 'ADMIN', 'basic' => 42000, 'emp_id' => 'AIUB-EMP-0003',
            ],
            [
                'name' => 'Nishat Anjum', 'email' => 'nishat.anjum@aiub.edu',
                'first_name' => 'Nishat', 'last_name' => 'Anjum', 'gender' => 'female',
                'dept_code' => 'CSE', 'basic' => 95000, 'emp_id' => 'AIUB-EMP-0004',
            ],
            [
                'name' => 'Karim Uddin', 'email' => 'karim.uddin@aiub.edu',
                'first_name' => 'Karim', 'last_name' => 'Uddin', 'gender' => 'male',
                'dept_code' => 'EEE', 'basic' => 72000, 'emp_id' => 'AIUB-EMP-0005',
            ],
            [
                'name' => 'Fatima Begum', 'email' => 'fatima.begum@aiub.edu',
                'first_name' => 'Fatima', 'last_name' => 'Begum', 'gender' => 'female',
                'dept_code' => 'BBA', 'basic' => 60000, 'emp_id' => 'AIUB-EMP-0006',
            ],
        ];

        foreach ($sampleEmployees as $idx => $sample) {
            $user = User::firstOrCreate(
                ['email' => $sample['email']],
                [
                    'name' => $sample['name'],
                    'password' => Hash::make('Employee@123'),
                    'email_verified_at' => now(),
                    'provider' => 'email',
                    'is_active' => true,
                ]
            );
            $user->assignRole('employee');

            $dept = Department::where('code', $sample['dept_code'])->first();
            $desig = Designation::where('department_id', $dept?->id)->first();

            $emp = Employee::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'employee_id' => $sample['emp_id'],
                    'first_name' => $sample['first_name'],
                    'last_name' => $sample['last_name'],
                    'gender' => $sample['gender'],
                    'phone' => '0171100000' . ($idx + 2),
                    'date_of_birth' => '1990-0' . ($idx + 1) . '-10',
                    'address' => 'Dhaka, Bangladesh',
                    'department_id' => $dept?->id,
                    'designation_id' => $desig?->id,
                    'joining_date' => '2020-0' . ($idx + 1) . '-01',
                    'employment_type' => 'full_time',
                    'status' => 'active',
                ]
            );

            SalaryStructure::firstOrCreate(
                ['employee_id' => $emp->id, 'is_current' => true],
                [
                    'basic_salary' => $sample['basic'],
                    'house_rent_allowance' => $sample['basic'] * 0.5,
                    'medical_allowance' => 5000,
                    'transport_allowance' => 2500,
                    'other_allowance' => 1000,
                    'provident_fund_percent' => 10,
                    'tax_percent' => 5,
                    'other_deductions' => 0,
                    'effective_from' => '2024-01-01',
                    'created_by' => $admin->id,
                ]
            );
        }

        $this->command->info('Users and employees seeded.');
    }
}
