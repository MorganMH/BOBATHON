<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Kathy is the signed-in user of the command centre.
        User::updateOrCreate(
            ['email' => 'kathy.bryant@northwind.example'],
            ['name' => 'Kathy Bryant', 'password' => bcrypt('password')],
        );

        $this->call(DemoSeeder::class);
    }
}
