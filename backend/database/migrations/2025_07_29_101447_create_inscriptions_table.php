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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->string('annee_scolaire');

            $table->foreign('annee_scolaire')->references('annee_scolaire')->on('annee_scolaires')->onDelete('cascade');
            $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade');
            $table->foreignId('specialite_id')->constrained('specialites')->onDelete('cascade');
            $table->date('date_inscription');
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->string('code_inscription')->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
