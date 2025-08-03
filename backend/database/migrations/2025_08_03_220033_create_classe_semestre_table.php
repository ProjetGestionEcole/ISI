<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classe_semestre', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('classe_id');
            $table->string('code_semestre');
            $table->string('annee_scolaire'); // Use string to match annee_scolaires primary key
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('classe_id');
            $table->index('code_semestre');
            $table->index('annee_scolaire');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classe_semestre');
    }
};
