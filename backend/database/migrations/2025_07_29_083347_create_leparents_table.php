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
        Schema::create('leparents', function (Blueprint $table) {
            $table->id(); // correspond à un user avec rôle "parent"
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // le compte parent
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade'); // l’enfant (user aussi)
            
            $table->enum('relation', ['pere', 'mere', 'tuteur'])->default('tuteur');
            $table->string('profession')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leparents');
    }
};
