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
        Schema::create('enseignements', function (Blueprint $table) {
            $table->id();
            /*$table->string('code_matiere');
            $table->foreign('code_matiere')->references('code_matiere')->on('matieres')->onDelete('cascade');
            $table->string('code_niveau');
            $table->foreign('code_niveau')->references('code_niveau')->on('niveaux')->onDelete('cascade');
            $table->string('code_specialite')->nullable();
            $table->foreign('code_specialite')->references('code_specialite')->on('specialites')->onDelete('cascade');
            $table->string('code_classe')->nullable();
            $table->foreign('code_classe')->references('code_classe')->on('classes')->onDelete('cascade');
            $table->string('code_ue')->nullable();
            $table->foreign('code_ue')->references('code_ue')->on('ues')->onDelete('cascade');
            $table->string('code_prof')->nullable();
            $table->foreign('code_prof')->references('id')->on('users')->onDelete('cascade');
            $table->string('annee_scolaire')->references('annee_scolaire')->on('annee_scolaires')->onDelete('cascade');$*/
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignements');
    }
};
