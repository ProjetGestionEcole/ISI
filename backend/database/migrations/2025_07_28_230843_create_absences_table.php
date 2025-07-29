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
        Schema::create('absences', function (Blueprint $table) {
            $table->id();

            // Clés étrangères
            $table->unsignedBigInteger('etudiant_id');
            $table->unsignedBigInteger('prof_id');
            $table->string('code_matiere');


            // Foreign keys
            $table->foreign('etudiant_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('prof_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('code_matiere')->references('code_matiere')->on('*matieres')->onDelete('cascade');

            $table->date('date_absence')->timestamp();           
            $table->enum('statut', ['justifiee', 'non_justifiee'])->default('non_justifiee');
        
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
