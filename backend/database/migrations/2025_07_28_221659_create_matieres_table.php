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
        Schema::create('matieres', function (Blueprint $table) {

            $table->string('code_matiere')->primary();
            $table->string('name');
            $table->string('code_ue');
            $table->foreign('code_ue')->references('code_ue')->on('ues')->onDelete('cascade');
            $table->integer('coef');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
};
