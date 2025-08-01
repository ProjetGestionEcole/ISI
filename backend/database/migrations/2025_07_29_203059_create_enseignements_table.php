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
            $table->string('code_matiere');
            $table->foreign('code_matiere')->references('code_matiere')->on('matieres')->onDelete('cascade');
            $table->string('code_classe');
            $table->foreign('code_classe')->references('code_classe')->on('classes')->onDelete('cascade');
            $table->foreignId('code_prof')->references('id')->on('users')->onDelete('cascade');
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
