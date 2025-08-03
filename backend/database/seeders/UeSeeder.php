<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Each semester has 4-5 UEs
     */
    public function run(): void
    {
        $semestres = DB::table('semestres')->get();

        if ($semestres->isEmpty()) {
            echo "Warning: No semesters found. Please run SemestreSeeder first.\n";
            return;
        }

        foreach ($semestres as $semestre) {
            // Create 4-5 UEs per semester (randomly choose between 4 and 5)
            $nbUes = rand(4, 5);
            
            for ($i = 1; $i <= $nbUes; $i++) {
                $ueCode = $semestre->code_semestre . '_UE' . $i;
                $ueName = "UE $i - " . $semestre->name;
                
                try {
                    DB::table('ues')->updateOrInsert(
                        ['code_ue' => $ueCode],
                        [
                            'code_ue' => $ueCode,
                            'name' => $ueName,
                            'code_semestre' => $semestre->code_semestre,
                            'credits' => rand(4, 8), // 4-8 credits per UE
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                } catch (\Exception $e) {
                    echo "Error creating UE {$ueCode}: " . $e->getMessage() . "\n";
                }
            }
        }
    }
}
