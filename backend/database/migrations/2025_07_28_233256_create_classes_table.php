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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('code_classe')->unique();
            $table->string('nom_classe');
            $table->string('annee_scolaire')->references('annee_scolaire')->on('annee_scolaires');

            // Clés étrangères 
            $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
            $table->foreignId('specialite_id')->constrained('specialites')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
