<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            DepartmentsAndDesignationsSeeder::class,
            LeaveTypesSeeder::class,
            UsersAndEmployeesSeeder::class,
        ]);
    }
}
