<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypesSeeder extends Seeder
{
    public function run(): void
    {
        $leaveTypes = [
            ['name' => 'Annual Leave', 'days_per_year' => 21, 'is_paid' => true, 'carry_forward' => true],
            ['name' => 'Sick Leave', 'days_per_year' => 14, 'is_paid' => true, 'carry_forward' => false],
            ['name' => 'Casual Leave', 'days_per_year' => 7, 'is_paid' => true, 'carry_forward' => false],
            ['name' => 'Maternity Leave', 'days_per_year' => 90, 'is_paid' => true, 'carry_forward' => false],
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::firstOrCreate(['name' => $type['name']], $type);
        }

        $this->command->info('Leave types seeded.');
    }
}
