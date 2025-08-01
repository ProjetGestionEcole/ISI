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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('mcc')->nullable();
            $table->tinyInteger('examen')->nullable();

            // Foreign keys
            $table->string('code_matiere');
            $table->foreign('code_matiere')->references('code_matiere')->on('matieres')->onDelete('cascade');
            $table->foreignId('id_enseignant')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_etudiant')->constrained('users')->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
