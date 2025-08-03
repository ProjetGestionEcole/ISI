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
           $table->string('code_enseignement');
            $table->foreign('code_enseignement')->references('code_enseignement')->on('enseignements')->onDelete('cascade');
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
