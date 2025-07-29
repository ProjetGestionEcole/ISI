<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Mention;
class MentionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $mentions[] = [            
                'appreciation' => "Insuffisant",'min_moyenne' => 08.00,'max_moyenne' =>9.99, 'created_at' => now(),'updated_at' => now(),
                'appreciation' => "Mention Passable",'min_moyenne' => 10.00,'max_moyenne' =>11.99, 'created_at' => now(),'updated_at' => now(),
                'appreciation' => "Mention Assez Bien",'min_moyenne' => 12.0,'max_moyenne' =>13.99, 'created_at' => now(),'updated_at' => now(),
                'appreciation' => "Mention Bien",'min_moyenne' => 14.0,'max_moyenne' =>15.99, 'created_at' => now(),'updated_at' => now(),
                'appreciation' => "Mention Très Bien",'min_moyenne' => 16.0,'max_moyenne' =>18.99, 'created_at' => now(),'updated_at' => now(),
                'appreciation' => "Mention Excellent",'min_moyenne' => 19.0,'max_moyenne' =>20.00, 'created_at' => now(),'updated_at' => now(),
        ];
        foreach ($mentions as $mention) {
            Mention::updateOrCreate(
                ['appreciation' => $mention['appreciation']],
                [
                    'min_moyenne' => $mention['min_moyenne'],
                    'max_moyenne' => $mention['max_moyenne'],
                    'created_at' => $mention['created_at'],
                    'updated_at' => $mention['updated_at']
                ]
            );
        }

    }
}
