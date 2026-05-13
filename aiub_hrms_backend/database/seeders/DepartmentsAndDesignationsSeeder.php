<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Designation;
use Illuminate\Database\Seeder;

class DepartmentsAndDesignationsSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Computer Science & Engineering', 'code' => 'CSE'],
            ['name' => 'Electrical & Electronic Engineering', 'code' => 'EEE'],
            ['name' => 'Business Administration', 'code' => 'BBA'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Administration', 'code' => 'ADMIN'],
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Finance', 'code' => 'FIN'],
        ];

        foreach ($departments as $dept) {
            $department = Department::firstOrCreate(
                ['code' => $dept['code']],
                ['name' => $dept['name'], 'description' => $dept['name'] . ' Department', 'is_active' => true]
            );

            $designations = [
                ['title' => 'Lecturer - ' . $dept['code'], 'grade' => 'L1'],
                ['title' => 'Assistant Professor - ' . $dept['code'], 'grade' => 'L2'],
                ['title' => 'Associate Professor - ' . $dept['code'], 'grade' => 'L3'],
                ['title' => 'Professor - ' . $dept['code'], 'grade' => 'L4'],
            ];

            if (in_array($dept['code'], ['ADMIN', 'HR', 'FIN'])) {
                $designations = [
                    ['title' => 'Officer - ' . $dept['code'], 'grade' => 'A1'],
                    ['title' => 'Senior Officer - ' . $dept['code'], 'grade' => 'A2'],
                    ['title' => 'Manager - ' . $dept['code'], 'grade' => 'A3'],
                    ['title' => 'Director - ' . $dept['code'], 'grade' => 'A4'],
                ];
            }

            foreach ($designations as $desig) {
                Designation::firstOrCreate(
                    ['title' => $desig['title']],
                    ['grade' => $desig['grade'], 'department_id' => $department->id]
                );
            }
        }

        $this->command->info('Departments and designations seeded.');
    }
}
